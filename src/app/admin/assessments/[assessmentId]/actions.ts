"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/require-admin";

export type AssessmentFormState = { error: string } | { success: true } | null;

export async function updateAssessment(
  assessmentId: string,
  _prevState: AssessmentFormState,
  formData: FormData,
): Promise<AssessmentFormState> {
  const { supabase } = await requireAdmin();

  const title = formData.get("title") as string;
  const version = Number(formData.get("version") ?? 1);

  const { error } = await supabase
    .from("assessments")
    .update({ title, version })
    .eq("id", assessmentId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/admin/assessments/${assessmentId}`);
  return { success: true };
}
