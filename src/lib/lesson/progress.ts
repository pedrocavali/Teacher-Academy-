import type { SupabaseClient } from "@supabase/supabase-js";
import { logEvent } from "@/lib/events/log";

// Plain server-side helper (not a Server Action) — called directly from the
// lesson page's own render. Only ever inserts; never touches an existing
// row, so revisiting a completed lesson can't silently downgrade it back to
// in_progress.
export async function ensureLessonStarted(
  supabase: SupabaseClient,
  userId: string,
  lessonId: string,
) {
  const { data: existing } = await supabase
    .from("lesson_progress")
    .select("id")
    .eq("user_id", userId)
    .eq("lesson_id", lessonId)
    .maybeSingle();

  if (!existing) {
    await supabase.from("lesson_progress").insert({
      user_id: userId,
      lesson_id: lessonId,
      status: "in_progress",
      started_at: new Date().toISOString(),
    });
    await logEvent(supabase, {
      userId,
      eventType: "lesson_started",
      entityType: "lesson",
      entityId: lessonId,
    });
  }
}
