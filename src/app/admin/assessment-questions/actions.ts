"use server";

import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/require-admin";

export type AssessmentQuestionFormState = { error: string } | null;

export async function createAssessmentQuestion(
  _prevState: AssessmentQuestionFormState,
  formData: FormData,
): Promise<AssessmentQuestionFormState> {
  const { supabase } = await requireAdmin();

  const assessmentId = formData.get("assessmentId") as string;
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

  const { data, error } = await supabase
    .from("assessment_questions")
    .insert({
      assessment_id: assessmentId,
      skill,
      target_cefr_level: targetCefrLevel,
      order_index: orderIndex,
      payload,
    })
    .select("id")
    .single();

  if (error) {
    return { error: error.message };
  }

  redirect(`/admin/assessment-questions/${data.id}`);
}
