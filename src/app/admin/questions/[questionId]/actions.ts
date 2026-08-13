"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/require-admin";

export type QuestionFormState = { error: string } | { success: true } | null;

export async function updateQuestion(
  questionId: string,
  _prevState: QuestionFormState,
  formData: FormData,
): Promise<QuestionFormState> {
  const { supabase } = await requireAdmin();

  const prompt = formData.get("prompt") as string;
  const type = formData.get("type") as string;
  const orderIndex = Number(formData.get("orderIndex") ?? 0);

  const { error } = await supabase
    .from("questions")
    .update({ prompt, type, order_index: orderIndex })
    .eq("id", questionId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/admin/questions/${questionId}`);
  return { success: true };
}

export type OptionFormState = { error: string } | null;

export async function addOption(
  questionId: string,
  _prevState: OptionFormState,
  formData: FormData,
): Promise<OptionFormState> {
  const { supabase } = await requireAdmin();

  const text = formData.get("text") as string;
  const isCorrect = formData.get("isCorrect") === "on";
  const orderIndex = Number(formData.get("orderIndex") ?? 0);

  if (!text?.trim()) {
    return { error: "Text is required." };
  }

  const { error } = await supabase.from("question_options").insert({
    question_id: questionId,
    text,
    is_correct: isCorrect,
    order_index: orderIndex,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/admin/questions/${questionId}`);
  return null;
}

export async function deleteOption(questionId: string, optionId: string) {
  const { supabase } = await requireAdmin();
  await supabase.from("question_options").delete().eq("id", optionId);
  revalidatePath(`/admin/questions/${questionId}`);
}
