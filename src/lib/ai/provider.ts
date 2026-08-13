// Blueprint Section 32 sketches a full AIProvider interface up front
// (generateExercise, evaluateWriting, evaluateSpeaking, generateFeedback,
// chat, generateLessonVariant). Grown incrementally instead, same as every
// other phase in this build: only evaluateWriting exists because it's the
// only one with a caller right now. Phase 12+ add methods here as they're
// actually needed, never speculatively.

export type WritingFeedback = {
  strengths: string[];
  improvements: string[];
  taskCompletion: "not_met" | "partially_met" | "met";
  overallComment: string;
};

export interface AIProvider {
  evaluateWriting(input: {
    prompt: string;
    submission: string;
    cefrLevel?: string;
  }): Promise<WritingFeedback>;
}
