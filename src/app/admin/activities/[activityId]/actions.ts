"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/require-admin";

export type ActivityFormState = { error: string } | { success: true } | null;

export async function updateActivity(
  activityId: string,
  _prevState: ActivityFormState,
  formData: FormData,
): Promise<ActivityFormState> {
  const { supabase } = await requireAdmin();

  const type = formData.get("type") as string;
  const skill = formData.get("skill") as string;
  const instructions = formData.get("instructions") as string;
  const estimatedMinutes = Number(formData.get("estimatedMinutes") ?? 5);
  const orderIndex = Number(formData.get("orderIndex") ?? 0);

  const { error } = await supabase
    .from("activities")
    .update({
      type,
      skill,
      instructions: instructions || null,
      estimated_minutes: estimatedMinutes,
      order_index: orderIndex,
    })
    .eq("id", activityId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/admin/activities/${activityId}`);
  return { success: true };
}
