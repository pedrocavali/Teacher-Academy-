"use server";

import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/require-admin";

export type AssessmentFormState = { error: string } | null;

export async function createAssessment(
  _prevState: AssessmentFormState,
  formData: FormData,
): Promise<AssessmentFormState> {
  const { supabase } = await requireAdmin();

  const title = formData.get("title") as string;
  const version = Number(formData.get("version") ?? 1);

  const { data, error } = await supabase
    .from("assessments")
    .insert({ type: "placement", title, version })
    .select("id")
    .single();

  if (error) {
    return { error: error.message };
  }

  redirect(`/admin/assessments/${data.id}`);
}
