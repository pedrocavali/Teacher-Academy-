"use server";

import { createClient } from "@/lib/supabase/server";

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

  return { success: true };
}
