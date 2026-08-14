-- Answer-key RLS hardening
--
-- What this does: closes a gap found during Phase 16 QA — RLS is row-level
-- only, so the previous "learner can select rows of a published activity's
-- questions" policies also exposed `question_options.is_correct` and the
-- isCorrect/acceptedAnswers embedded in `assessment_questions.payload` to
-- any authenticated learner calling the Supabase REST API directly,
-- completely bypassing the app's UI-level "never select is_correct"
-- discipline (confirmed live: a plain authenticated, non-admin session
-- could `select is_correct from question_options` for any published
-- activity). Postgres/PostgREST can't express "same row, minus one column"
-- per app-role within a single grant — admin and learner share the same
-- `authenticated` Postgres role — so the fix is to restrict SELECT on these
-- two tables to admins only, and move every learner-facing read (rendering
-- activity options / placement questions) and every grading read (checking
-- answers) to a server-only service-role client that deliberately bypasses
-- RLS, inside code that already never forwards the answer key to the
-- client (src/lib/supabase/service-role.ts).
--
-- Dependencies: 20260813000002 (is_admin), 20260813000006 (question_options),
--   20260813000008 (assessment_questions).
-- RLS: question_options / assessment_questions become admin-only for SELECT.
--   Their INSERT/UPDATE/DELETE policies (already admin-only) are unchanged,
--   as is every other table's RLS.
-- FKs / Indexes: none added.

drop policy "question_options_select_via_activity_or_admin" on public.question_options;
create policy "question_options_select_admin"
  on public.question_options for select
  using (public.is_admin());

drop policy "assessment_questions_select_via_assessment_or_admin" on public.assessment_questions;
create policy "assessment_questions_select_admin"
  on public.assessment_questions for select
  using (public.is_admin());
