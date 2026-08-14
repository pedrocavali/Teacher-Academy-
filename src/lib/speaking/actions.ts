"use server";

import { createClient } from "@/lib/supabase/server";
import { evaluateSpeaking } from "@/lib/ai/service";
import type { SpeakingFeedback } from "@/lib/ai/provider";
import { logEvent } from "@/lib/events/log";

export type SubmitSpeakingResult =
  | { error: string }
  | { success: true; feedback: SpeakingFeedback };

export async function submitSpeaking(
  activityId: string,
  audioStoragePath: string,
): Promise<SubmitSpeakingResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You need to be signed in." };
  }

  // RLS (speaking_recordings_select_own_or_admin) already confines this to
  // the caller's own folder, but check the path prefix too so a malformed
  // client request can't even try to read someone else's recording.
  if (!audioStoragePath.startsWith(`${user.id}/`)) {
    return { error: "Invalid recording." };
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

  const { data: audioFile, error: downloadError } = await supabase.storage
    .from("speaking-recordings")
    .download(audioStoragePath);

  if (downloadError || !audioFile) {
    return { error: downloadError?.message ?? "Could not read the recording." };
  }

  const { data: skillLevel } = await supabase
    .from("user_skill_levels")
    .select("cefr_level")
    .eq("user_id", user.id)
    .eq("skill", "speaking")
    .maybeSingle();

  const audioBuffer = await audioFile.arrayBuffer();
  const audioBase64 = Buffer.from(audioBuffer).toString("base64");

  let feedback: SpeakingFeedback;
  try {
    feedback = await evaluateSpeaking({
      prompt: activity.instructions ?? "",
      audioBase64,
      audioMimeType: audioFile.type || "audio/webm",
      cefrLevel: skillLevel?.cefr_level,
    });
  } catch (e) {
    return {
      error: e instanceof Error ? e.message : "AI feedback failed. Please try again.",
    };
  }

  const { error } = await supabase.from("speaking_attempts").insert({
    user_id: user.id,
    activity_id: activityId,
    audio_storage_path: audioStoragePath,
    transcript: feedback.transcript,
    ai_feedback: feedback,
    scores: {
      intelligibility: feedback.intelligibility,
      fluency: feedback.fluency,
      vocabulary: feedback.vocabulary,
      grammar: feedback.grammar,
      responseQuality: feedback.responseQuality,
    },
  });

  if (error) {
    return { error: error.message };
  }

  await logEvent(supabase, {
    userId: user.id,
    eventType: "speaking_submitted",
    entityType: "activity",
    entityId: activityId,
  });

  return { success: true, feedback };
}
