"use server";

import { createClient } from "@/lib/supabase/server";
import { evaluateWriting } from "@/lib/ai/service";
import type { WritingFeedback } from "@/lib/ai/provider";
import { logEvent } from "@/lib/events/log";

export type SubmitWritingResult =
  | { error: string }
  | { success: true; feedback: WritingFeedback };

export async function submitWriting(
  activityId: string,
  text: string,
): Promise<SubmitWritingResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You need to be signed in." };
  }

  if (!text.trim()) {
    return { error: "Write something before submitting." };
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

  const { data: skillLevel } = await supabase
    .from("user_skill_levels")
    .select("cefr_level")
    .eq("user_id", user.id)
    .eq("skill", "writing")
    .maybeSingle();

  let feedback: WritingFeedback;
  try {
    feedback = await evaluateWriting({
      prompt: activity.instructions ?? "",
      submission: text,
      cefrLevel: skillLevel?.cefr_level,
    });
  } catch (e) {
    return {
      error: e instanceof Error ? e.message : "AI feedback failed. Please try again.",
    };
  }

  const { error } = await supabase.from("writing_submissions").insert({
    user_id: user.id,
    activity_id: activityId,
    text,
    ai_feedback: feedback,
    scores: { taskCompletion: feedback.taskCompletion },
  });

  if (error) {
    return { error: error.message };
  }

  await logEvent(supabase, {
    userId: user.id,
    eventType: "writing_submitted",
    entityType: "activity",
    entityId: activityId,
  });

  return { success: true, feedback };
}
