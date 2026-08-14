"use server";

import { createClient } from "@/lib/supabase/server";
import { logEvent } from "@/lib/events/log";

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

  return { success: true };
}
