"use server";

import { requireAdmin } from "@/lib/auth/require-admin";

export type ContentType = "course" | "unit" | "lesson" | "activity" | "assessment";

const TABLES: Record<ContentType, string> = {
  course: "courses",
  unit: "units",
  lesson: "lessons",
  activity: "activities",
  assessment: "assessments",
};

// Shared across course/unit/lesson/activity/assessment: updates the
// entity's status and logs the transition to content_reviews, matching the
// draft -> review -> approved -> published pipeline from the blueprint. RLS
// already restricts both writes to admins; requireAdmin() here just gives
// a clean error instead of a raw Postgres one if this is ever hit by a
// non-admin.
export async function changeContentStatus(
  contentType: ContentType,
  id: string,
  fromStatus: string,
  toStatus: string,
): Promise<{ error: string } | { success: true }> {
  const { supabase, user } = await requireAdmin();

  const { error } = await supabase
    .from(TABLES[contentType])
    .update({ status: toStatus })
    .eq("id", id);

  if (error) {
    return { error: error.message };
  }

  await supabase.from("content_reviews").insert({
    content_type: contentType,
    content_id: id,
    reviewer_id: user.id,
    from_status: fromStatus,
    to_status: toStatus,
  });

  return { success: true };
}
