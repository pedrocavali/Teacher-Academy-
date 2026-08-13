-- Placement assessment
--
-- What this does: the diagnostic placement flow (Blueprint Section 10) —
-- a fixed-form assessment made of per-skill questions, an attempt per user
-- run, item-level responses, and a final aggregated result (overall +
-- per-skill CEFR level). Deliberately not adaptive/IRT for MVP; storing
-- item-level responses keeps that door open later without a schema change.
--
-- Dependencies: 20260813000001 (enums), 20260813000002 (is_admin,
--   set_updated_at), 20260813000003 (cefr_level).
-- RLS:
--   - assessments / assessment_questions: published-or-admin, same pattern
--     as other content tables (an assessment is content, authored by admin).
--   - assessment_attempts / responses / results: owned by the learner who
--     took them (select/insert/update own rows only); admin gets read-only
--     SELECT for analytics, never UPDATE/DELETE on learner data (Blueprint
--     Section 16: admin manages content, not learner records).
-- Indexes: FK columns; (user_id) on attempts/results for "my placement
--   history"; (attempt_id) on responses for "load this attempt's answers".
-- FKs: assessment_questions -> assessments (cascade); attempts -> assessment
--   + user (restrict on assessment so history isn't lost if content is
--   edited, cascade on user so a deleted account takes its attempts with
--   it); responses -> attempt + question (cascade on attempt); results ->
--   attempt + user (cascade).

create table public.assessments (
  id uuid primary key default gen_random_uuid(),
  type text not null default 'placement',
  title text not null,
  version smallint not null default 1,
  status public.content_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.assessment_questions (
  id uuid primary key default gen_random_uuid(),
  assessment_id uuid not null references public.assessments (id) on delete cascade,
  skill public.skill_type not null,
  target_cefr_level public.cefr_level not null,
  order_index smallint not null default 0,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.assessment_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  assessment_id uuid not null references public.assessments (id) on delete restrict,
  status public.progress_status not null default 'not_started',
  started_at timestamptz not null default now(),
  completed_at timestamptz
);

create table public.assessment_responses (
  id uuid primary key default gen_random_uuid(),
  attempt_id uuid not null references public.assessment_attempts (id) on delete cascade,
  question_id uuid not null references public.assessment_questions (id) on delete restrict,
  response jsonb not null,
  is_correct boolean,
  score numeric,
  created_at timestamptz not null default now()
);

create table public.assessment_results (
  id uuid primary key default gen_random_uuid(),
  attempt_id uuid not null references public.assessment_attempts (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  overall_level public.cefr_level not null,
  reading_level public.cefr_level,
  listening_level public.cefr_level,
  writing_level public.cefr_level,
  speaking_level public.cefr_level,
  grammar_level public.cefr_level,
  vocabulary_level public.cefr_level,
  raw_scores jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index assessment_questions_assessment_id_idx on public.assessment_questions (assessment_id);
create index assessment_attempts_user_id_idx on public.assessment_attempts (user_id);
create index assessment_attempts_assessment_id_idx on public.assessment_attempts (assessment_id);
create index assessment_responses_attempt_id_idx on public.assessment_responses (attempt_id);
create index assessment_responses_question_id_idx on public.assessment_responses (question_id);
create index assessment_results_attempt_id_idx on public.assessment_results (attempt_id);
create index assessment_results_user_id_idx on public.assessment_results (user_id);

create trigger assessments_set_updated_at
  before update on public.assessments
  for each row execute function public.set_updated_at();
create trigger assessment_questions_set_updated_at
  before update on public.assessment_questions
  for each row execute function public.set_updated_at();

alter table public.assessments enable row level security;
alter table public.assessment_questions enable row level security;
alter table public.assessment_attempts enable row level security;
alter table public.assessment_responses enable row level security;
alter table public.assessment_results enable row level security;

create policy "assessments_select_published_or_admin"
  on public.assessments for select
  using (status = 'published' or public.is_admin());
create policy "assessments_admin_insert" on public.assessments for insert with check (public.is_admin());
create policy "assessments_admin_update" on public.assessments for update using (public.is_admin()) with check (public.is_admin());
create policy "assessments_admin_delete" on public.assessments for delete using (public.is_admin());

create policy "assessment_questions_select_via_assessment_or_admin"
  on public.assessment_questions for select
  using (
    public.is_admin()
    or exists (select 1 from public.assessments a where a.id = assessment_questions.assessment_id and a.status = 'published')
  );
create policy "assessment_questions_admin_insert" on public.assessment_questions for insert with check (public.is_admin());
create policy "assessment_questions_admin_update" on public.assessment_questions for update using (public.is_admin()) with check (public.is_admin());
create policy "assessment_questions_admin_delete" on public.assessment_questions for delete using (public.is_admin());

create policy "assessment_attempts_select_own_or_admin"
  on public.assessment_attempts for select
  using (user_id = auth.uid() or public.is_admin());
create policy "assessment_attempts_insert_own"
  on public.assessment_attempts for insert
  with check (user_id = auth.uid());
create policy "assessment_attempts_update_own"
  on public.assessment_attempts for update
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "assessment_responses_select_own_or_admin"
  on public.assessment_responses for select
  using (
    public.is_admin()
    or exists (select 1 from public.assessment_attempts at where at.id = assessment_responses.attempt_id and at.user_id = auth.uid())
  );
create policy "assessment_responses_insert_own"
  on public.assessment_responses for insert
  with check (
    exists (select 1 from public.assessment_attempts at where at.id = assessment_responses.attempt_id and at.user_id = auth.uid())
  );
create policy "assessment_responses_update_own"
  on public.assessment_responses for update
  using (
    exists (select 1 from public.assessment_attempts at where at.id = assessment_responses.attempt_id and at.user_id = auth.uid())
  )
  with check (
    exists (select 1 from public.assessment_attempts at where at.id = assessment_responses.attempt_id and at.user_id = auth.uid())
  );

create policy "assessment_results_select_own_or_admin"
  on public.assessment_results for select
  using (user_id = auth.uid() or public.is_admin());
create policy "assessment_results_insert_own"
  on public.assessment_results for insert
  with check (user_id = auth.uid());
