"use server";

import { createClient } from "@/lib/supabase/server";
import { logEvent } from "@/lib/events/log";

export type SubmittedResponse =
  | { type: "choice"; optionId: string }
  | { type: "text"; value: string }
  | { type: "order"; optionIds: string[] };

export type QuestionResult = {
  questionId: string;
  correct: boolean;
  correctOptionIds?: string[];
  correctText?: string;
  correctOrder?: string[];
};

export type AttemptResult =
  | { error: string }
  | { success: true; score: number; maxScore: number; results: QuestionResult[] };

type OptionRow = { id: string; text: string; is_correct: boolean; order_index: number };

// The only place is_correct is ever read for a learner-facing request. The
// activity player never receives it — this re-fetches the real answer key
// server-side and grades against the learner's submitted responses, only
// revealing correct answers in the return value, after grading is done.
export async function submitActivityAttempt(
  activityId: string,
  responses: Record<string, SubmittedResponse>,
): Promise<AttemptResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You need to be signed in." };
  }

  const { data: questions, error } = await supabase
    .from("questions")
    .select("id, type, question_options(id, text, is_correct, order_index)")
    .eq("activity_id", activityId);

  if (error || !questions || questions.length === 0) {
    return { error: "Activity not found." };
  }

  let score = 0;
  const results: QuestionResult[] = [];

  for (const question of questions) {
    const options = (question.question_options ?? []) as OptionRow[];
    const response = responses[question.id];
    let correct = false;
    const result: QuestionResult = { questionId: question.id, correct: false };

    if (question.type === "multiple_choice" || question.type === "true_false") {
      const correctOption = options.find((o) => o.is_correct);
      correct = response?.type === "choice" && response.optionId === correctOption?.id;
      result.correctOptionIds = correctOption ? [correctOption.id] : [];
    } else if (question.type === "fill_blank") {
      const acceptedAnswers = options
        .filter((o) => o.is_correct)
        .map((o) => o.text.trim().toLowerCase());
      const submitted = response?.type === "text" ? response.value.trim().toLowerCase() : "";
      correct = submitted.length > 0 && acceptedAnswers.includes(submitted);
      result.correctText = options.find((o) => o.is_correct)?.text;
    } else if (question.type === "ordering") {
      const correctOrder = [...options]
        .sort((a, b) => a.order_index - b.order_index)
        .map((o) => o.id);
      const submittedOrder = response?.type === "order" ? response.optionIds : [];
      correct =
        correctOrder.length > 0 &&
        JSON.stringify(correctOrder) === JSON.stringify(submittedOrder);
      result.correctOrder = correctOrder;
    }

    result.correct = correct;
    if (correct) score++;
    results.push(result);
  }

  const maxScore = questions.length;

  await supabase.from("activity_attempts").insert({
    user_id: user.id,
    activity_id: activityId,
    score,
    max_score: maxScore,
    is_correct: score === maxScore,
    responses,
    completed_at: new Date().toISOString(),
  });

  await logEvent(supabase, {
    userId: user.id,
    eventType: "activity_completed",
    entityType: "activity",
    entityId: activityId,
    properties: { score, maxScore },
  });

  return { success: true, score, maxScore, results };
}
