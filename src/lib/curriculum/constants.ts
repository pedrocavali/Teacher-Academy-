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
// enum also has matching, speaking, writing, and role_play — left out here:
// matching needs a pair_key/match_target column the current question_options
// schema doesn't have yet, and speaking/writing/role_play are only
// meaningful once the AI layer (Phases 11-13) can grade or converse. Rather
// than let an admin create a half-working activity, the CMS just doesn't
// offer those types yet.
export const ACTIVITY_TYPES = [
  "multiple_choice",
  "true_false",
  "fill_blank",
  "ordering",
  "reading_comprehension",
  "listening_comprehension",
  "grammar",
  "vocabulary",
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
