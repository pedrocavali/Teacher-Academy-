"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/require-admin";

export type LessonFormState = { error: string } | { success: true } | null;

export async function updateLesson(
  lessonId: string,
  _prevState: LessonFormState,
  formData: FormData,
): Promise<LessonFormState> {
  const { supabase } = await requireAdmin();

  const slug = formData.get("slug") as string;
  const title = formData.get("title") as string;
  const objective = formData.get("objective") as string;
  const cefrLevel = formData.get("cefrLevel") as string;
  const primarySkill = formData.get("primarySkill") as string;
  const estimatedMinutes = Number(formData.get("estimatedMinutes") ?? 15);
  const orderIndex = Number(formData.get("orderIndex") ?? 0);

  const { error } = await supabase
    .from("lessons")
    .update({
      slug,
      title,
      objective,
      cefr_level: cefrLevel,
      primary_skill: primarySkill,
      estimated_minutes: estimatedMinutes,
      order_index: orderIndex,
    })
    .eq("id", lessonId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/admin/lessons/${lessonId}`);
  return { success: true };
}
