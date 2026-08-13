"use server";

import { createClient } from "@/lib/supabase/server";
import { continueCoachConversation } from "@/lib/ai/service";
import type { CoachTurn } from "@/lib/ai/provider";

// Blueprint Decision #4: bounded practice, not an open-ended chatbot.
// App-level cap, not the model's judgment call — see continueCoachConversation.
const MAX_USER_TURNS = 3;

export type CoachResult =
  | { error: string }
  | { success: true; conversationId: string; reply: string; isFinal: boolean };

async function getSpeakingLevel(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
) {
  const { data } = await supabase
    .from("user_skill_levels")
    .select("cefr_level")
    .eq("user_id", userId)
    .eq("skill", "speaking")
    .maybeSingle();
  return data?.cefr_level;
}

export async function startCoachConversation(activityId: string): Promise<CoachResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You need to be signed in." };
  }

  const { data: activity } = await supabase
    .from("activities")
    .select("id, instructions, lesson_id")
    .eq("id", activityId)
    .eq("status", "published")
    .single();

  if (!activity) {
    return { error: "Activity not found." };
  }

  let response;
  try {
    response = await continueCoachConversation({
      scenario: activity.instructions ?? "",
      history: [],
      cefrLevel: await getSpeakingLevel(supabase, user.id),
      isFinalTurn: false,
    });
  } catch (e) {
    return {
      error: e instanceof Error ? e.message : "The AI coach couldn't start. Please try again.",
    };
  }

  const { data: conversation, error: convError } = await supabase
    .from("ai_conversations")
    .insert({
      user_id: user.id,
      context_type: "lesson",
      lesson_id: activity.lesson_id,
      status: "in_progress",
    })
    .select("id")
    .single();

  if (convError || !conversation) {
    return { error: convError?.message ?? "Could not start the conversation." };
  }

  await supabase
    .from("ai_messages")
    .insert({ conversation_id: conversation.id, role: "assistant", content: response.reply });

  return {
    success: true,
    conversationId: conversation.id,
    reply: response.reply,
    isFinal: response.isFinal,
  };
}

export async function sendCoachMessage(
  activityId: string,
  conversationId: string,
  message: string,
): Promise<CoachResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You need to be signed in." };
  }

  if (!message.trim()) {
    return { error: "Say something before sending." };
  }

  const { data: conversation } = await supabase
    .from("ai_conversations")
    .select("id, status")
    .eq("id", conversationId)
    .eq("user_id", user.id)
    .single();

  if (!conversation) {
    return { error: "Conversation not found." };
  }
  if (conversation.status === "completed") {
    return { error: "This conversation has ended." };
  }

  const { data: activity } = await supabase
    .from("activities")
    .select("id, instructions")
    .eq("id", activityId)
    .eq("status", "published")
    .single();

  if (!activity) {
    return { error: "Activity not found." };
  }

  const { data: priorMessages } = await supabase
    .from("ai_messages")
    .select("role, content")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true });

  const history: CoachTurn[] = (priorMessages ?? []).map((m) => ({
    role: m.role === "user" ? "user" : "assistant",
    content: m.content,
  }));
  history.push({ role: "user", content: message });

  const userTurnCount = history.filter((t) => t.role === "user").length;
  const isFinalTurn = userTurnCount >= MAX_USER_TURNS;

  let response;
  try {
    response = await continueCoachConversation({
      scenario: activity.instructions ?? "",
      history,
      cefrLevel: await getSpeakingLevel(supabase, user.id),
      isFinalTurn,
    });
  } catch (e) {
    return {
      error: e instanceof Error ? e.message : "The AI coach couldn't reply. Please try again.",
    };
  }

  await supabase.from("ai_messages").insert([
    { conversation_id: conversationId, role: "user", content: message },
    { conversation_id: conversationId, role: "assistant", content: response.reply },
  ]);

  if (response.isFinal) {
    await supabase
      .from("ai_conversations")
      .update({ status: "completed" })
      .eq("id", conversationId);
  }

  return {
    success: true,
    conversationId,
    reply: response.reply,
    isFinal: response.isFinal,
  };
}
