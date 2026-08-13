"use server";

import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/require-admin";

export type QuestionFormState = { error: string } | null;

export async function createQuestion(
  _prevState: QuestionFormState,
  formData: FormData,
): Promise<QuestionFormState> {
  const { supabase } = await requireAdmin();

  const activityId = formData.get("activityId") as string;
  const prompt = formData.get("prompt") as string;
  const type = formData.get("type") as string;
  const orderIndex = Number(formData.get("orderIndex") ?? 0);

  const { data, error } = await supabase
    .from("questions")
    .insert({ activity_id: activityId, prompt, type, order_index: orderIndex })
    .select("id")
    .single();

  if (error) {
    return { error: error.message };
  }

  redirect(`/admin/questions/${data.id}`);
}
