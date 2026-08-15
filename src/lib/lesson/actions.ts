"use server";

import { createClient } from "@/lib/supabase/server";
import { logEvent } from "@/lib/events/log";
import { recordStudyActivity } from "@/lib/gamification/actions";

export async function completeLesson(
  lessonId: string,
): Promise<{ error: string } | { success: true }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You need to be signed in." };
  }

  const { error } = await supabase
    .from("lesson_progress")
    .update({ status: "completed", completed_at: new Date().toISOString() })
    .eq("user_id", user.id)
    .eq("lesson_id", lessonId);

  if (error) {
    return { error: error.message };
  }

  await logEvent(supabase, {
    userId: user.id,
    eventType: "lesson_completed",
    entityType: "lesson",
    entityId: lessonId,
  });

  const { data: lesson } = await supabase
    .from("lessons")
    .select("estimated_minutes")
    .eq("id", lessonId)
    .maybeSingle();
  await recordStudyActivity(supabase, user.id, lesson?.estimated_minutes ?? 0);

  return { success: true };
}
