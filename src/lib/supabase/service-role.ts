import { createClient } from "@supabase/supabase-js";

// Server-only — bypasses RLS entirely via SUPABASE_SERVICE_ROLE_KEY. Use
// only for reads that legitimately need rows an authenticated learner's own
// session is no longer allowed to see directly: question_options.is_correct
// and assessment_questions.payload (see migration 15 — admin and learner
// share the same Postgres role, so RLS can't hide just one column from a
// row that's otherwise visible). Never import this from a "use client"
// file, and never forward its results to the client without stripping the
// answer-key fields first, same as every other content read in this app.
export function createServiceRoleClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );
}
