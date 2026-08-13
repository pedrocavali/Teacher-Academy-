// Mirrors the public.cefr_level, public.skill_type, and public.activity_type
// enums from supabase/migrations/20260813000001_extensions_and_enums.sql.

export const CEFR_LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"] as const;

export const SKILLS = [
  "reading",
  "listening",
  "writing",
  "speaking",
  "grammar",
  "vocabulary",
] as const;

// Activity types an admin can author right now. The full public.activity_type
// enum also has matching and role_play — still left out: matching needs a
// pair_key/match_target column the current question_options schema doesn't
// have yet, and role_play needs Phase 13 (the AI coach, a conversation
// rather than a single graded response). "writing" (Phase 11) and
// "speaking" (Phase 12) were added once AIService could actually grade
// them — before that they'd have been a submission into the void.
export const ACTIVITY_TYPES = [
  "multiple_choice",
  "true_false",
  "fill_blank",
  "ordering",
  "reading_comprehension",
  "listening_comprehension",
  "grammar",
  "vocabulary",
  "writing",
  "speaking",
] as const;

// The actual interaction widget a question renders as. activities.type above
// is the pedagogical/skill label shown to the learner; questions.type is
// what decides which renderer a given question uses — a "vocabulary"
// activity's questions are still, mechanically, multiple_choice or
// fill_blank items.
export const QUESTION_TYPES = [
  "multiple_choice",
  "true_false",
  "fill_blank",
  "ordering",
] as const;

export type QuestionType = (typeof QUESTION_TYPES)[number];
