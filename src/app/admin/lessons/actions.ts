"use server";

import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/require-admin";

export type LessonFormState = { error: string } | null;

export async function createLesson(
  _prevState: LessonFormState,
  formData: FormData,
): Promise<LessonFormState> {
  const { supabase } = await requireAdmin();

  const unitId = formData.get("unitId") as string;
  const slug = formData.get("slug") as string;
  const title = formData.get("title") as string;
  const objective = formData.get("objective") as string;
  const cefrLevel = formData.get("cefrLevel") as string;
  const primarySkill = formData.get("primarySkill") as string;
  const estimatedMinutes = Number(formData.get("estimatedMinutes") ?? 15);
  const orderIndex = Number(formData.get("orderIndex") ?? 0);

  const { data, error } = await supabase
    .from("lessons")
    .insert({
      unit_id: unitId,
      slug,
      title,
      objective,
      cefr_level: cefrLevel,
      primary_skill: primarySkill,
      estimated_minutes: estimatedMinutes,
      order_index: orderIndex,
    })
    .select("id")
    .single();

  if (error) {
    return { error: error.message };
  }

  redirect(`/admin/lessons/${data.id}`);
}
