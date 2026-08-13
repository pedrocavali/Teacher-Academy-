"use server";

import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/require-admin";

export type AssessmentQuestionFormState = { error: string } | null;

export async function updateAssessmentQuestion(
  questionId: string,
  _prevState: AssessmentQuestionFormState,
  formData: FormData,
): Promise<AssessmentQuestionFormState> {
  const { supabase } = await requireAdmin();

  const skill = formData.get("skill") as string;
  const targetCefrLevel = formData.get("targetCefrLevel") as string;
  const orderIndex = Number(formData.get("orderIndex") ?? 0);
  const payloadRaw = formData.get("payload") as string;

  let payload: unknown;
  try {
    payload = JSON.parse(payloadRaw);
  } catch {
    return { error: "Invalid question payload." };
  }

  const { error } = await supabase
    .from("assessment_questions")
    .update({
      skill,
      target_cefr_level: targetCefrLevel,
      order_index: orderIndex,
      payload,
    })
    .eq("id", questionId);

  if (error) {
    return { error: error.message };
  }

  return null;
}

export async function deleteAssessmentQuestion(assessmentId: string, questionId: string) {
  const { supabase } = await requireAdmin();
  await supabase.from("assessment_questions").delete().eq("id", questionId);
  redirect(`/admin/assessments/${assessmentId}`);
}
