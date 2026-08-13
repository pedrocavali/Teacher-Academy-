"use server";

import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/require-admin";

export type ActivityFormState = { error: string } | null;

export async function createActivity(
  _prevState: ActivityFormState,
  formData: FormData,
): Promise<ActivityFormState> {
  const { supabase } = await requireAdmin();

  const lessonId = formData.get("lessonId") as string;
  const type = formData.get("type") as string;
  const skill = formData.get("skill") as string;
  const instructions = formData.get("instructions") as string;
  const estimatedMinutes = Number(formData.get("estimatedMinutes") ?? 5);
  const orderIndex = Number(formData.get("orderIndex") ?? 0);

  const { data, error } = await supabase
    .from("activities")
    .insert({
      lesson_id: lessonId,
      type,
      skill,
      instructions: instructions || null,
      estimated_minutes: estimatedMinutes,
      order_index: orderIndex,
    })
    .select("id")
    .single();

  if (error) {
    return { error: error.message };
  }

  redirect(`/admin/activities/${data.id}`);
}
