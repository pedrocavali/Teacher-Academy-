import type { AssessmentQuestionPayload } from "@/lib/placement/payload";

export type PlacementResponse =
  | { type: "choice"; optionIndex: number }
  | { type: "text"; value: string };

// Options inside an assessment_questions.payload JSONB blob have no DB row
// id (unlike activities' question_options table), so the client refers to
// a multiple_choice answer by its array index instead.
export function isPlacementResponseCorrect(
  payload: AssessmentQuestionPayload,
  response: PlacementResponse | undefined,
): boolean {
  if (payload.type === "multiple_choice") {
    if (response?.type !== "choice") return false;
    return payload.options[response.optionIndex]?.isCorrect === true;
  }

  if (payload.type === "fill_blank") {
    if (response?.type !== "text") return false;
    const accepted = payload.acceptedAnswers.map((a) => a.trim().toLowerCase());
    return accepted.includes(response.value.trim().toLowerCase());
  }

  return false;
}
