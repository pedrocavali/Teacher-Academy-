// Blueprint Section 32 sketches a full AIProvider interface up front
// (generateExercise, evaluateWriting, evaluateSpeaking, generateFeedback,
// chat, generateLessonVariant). Grown incrementally instead, same as every
// other phase in this build: methods exist here only once something calls
// them. Phase 13+ adds more as they're actually needed, never speculatively.

export type WritingFeedback = {
  strengths: string[];
  improvements: string[];
  taskCompletion: "not_met" | "partially_met" | "met";
  overallComment: string;
};

export type SkillRating = "low" | "medium" | "high";

export type SpeakingFeedback = {
  transcript: string;
  // Matches Blueprint Section 20's four dimensions exactly. Deliberately a
  // 3-point scale, not a 0-100 score — an LLM's read on pronunciation from
  // audio alone can't honestly support that much precision. Advanced
  // pronunciation scoring is explicitly out of scope for MVP.
  intelligibility: SkillRating;
  fluency: SkillRating;
  vocabulary: SkillRating;
  grammar: SkillRating;
  responseQuality: "not_met" | "partially_met" | "met";
  strengths: string[];
  improvements: string[];
  overallComment: string;
};

export type CoachTurn = { role: "user" | "assistant"; content: string };

export type CoachResponse = {
  reply: string;
  // App-driven, not AI-driven: the caller tells the provider when this is
  // the last allowed turn (Blueprint Decision #4 — bounded practice, not an
  // open-ended chatbot), and the model wraps up instead of deciding on its
  // own when to stop.
  isFinal: boolean;
};

export interface AIProvider {
  evaluateWriting(input: {
    prompt: string;
    submission: string;
    cefrLevel?: string;
  }): Promise<WritingFeedback>;

  evaluateSpeaking(input: {
    prompt: string;
    audioBase64: string;
    audioMimeType: string;
    cefrLevel?: string;
  }): Promise<SpeakingFeedback>;

  continueCoachConversation(input: {
    scenario: string;
    history: CoachTurn[];
    cefrLevel?: string;
    isFinalTurn: boolean;
  }): Promise<CoachResponse>;
}
