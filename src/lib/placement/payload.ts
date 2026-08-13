// Shape stored in assessment_questions.payload (JSONB). Unlike activities,
// which use relational questions/question_options tables, placement
// questions are simple enough (and expected to change rarely, authored by
// one admin) that a JSONB blob is less machinery for the same result. See
// Blueprint Section 10 — placement is a fixed-form diagnostic, not the full
// activity engine.
export type AssessmentQuestionPayload =
  | {
      type: "multiple_choice";
      prompt: string;
      context?: string;
      options: { text: string; isCorrect: boolean }[];
    }
  | {
      type: "fill_blank";
      prompt: string;
      context?: string;
      acceptedAnswers: string[];
    };
