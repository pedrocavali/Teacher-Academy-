// Mirrors the public.cefr_level and public.skill_type enums from
// supabase/migrations/20260813000001_extensions_and_enums.sql.

export const CEFR_LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"] as const;

export const SKILLS = [
  "reading",
  "listening",
  "writing",
  "speaking",
  "grammar",
  "vocabulary",
] as const;
