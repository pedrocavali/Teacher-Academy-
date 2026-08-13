-- Learner progress: skill levels, lesson progress, attempts, submissions
--
-- What this does: every table here is learner-owned history (Blueprint
-- Section 14/16) — the rule-based Learning Engine reads these to compute
-- recommendations, and the dashboard reads them to show progress.
-- `writing_submissions` / `speaking_attempts` store the AI-generated
-- feedback inline (Blueprint Section 14 note: no separate generic
-- `ai_feedback` table — feedback is always 1:1 with its submission).
--
-- Dependencies: 20260813000001 (enums), 20260813000002 (is_admin,
--   set_updated_at), 20260813000004 (lessons), 20260813000006 (activities,
--   activity_variants).
-- RLS: owner (select/insert/update own rows only, no delete — history
--   shouldn't be erasable by the learner); admin gets read-only SELECT
--   across all rows for analytics, never write access to learner data.
-- Indexes: (user_id) on every table for "my progress" queries; (user_id,
--   skill) unique on user_skill_levels (one current level per skill);
--   (user_id, lesson_id) unique on lesson_progress.
-- FKs: all cascade on user_id (deleting an account removes their history);
--   restrict on content FKs (lesson/activity) so history isn't silently
--   lost if content is edited/removed — content deletion must be handled
--   explicitly by an admin.

create table public.user_skill_levels (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  skill public.skill_type not null,
  cefr_level public.cefr_level not null,
  source text not null default 'ongoing',
  updated_at timestamptz not null default now(),
  unique (user_id, skill)
);

create table public.lesson_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  lesson_id uuid not null references public.lessons (id) on delete restrict,
  status public.progress_status not null default 'not_started',
  started_at timestamptz,
  completed_at timestamptz,
  time_spent_seconds integer not null default 0,
  unique (user_id, lesson_id)
);

create table public.activity_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  activity_id uuid not null references public.activities (id) on delete restrict,
  variant_id uuid references public.activity_variants (id) on delete set null,
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  score numeric,
  max_score numeric,
  is_correct boolean,
  responses jsonb not null default '{}'::jsonb,
  time_spent_seconds integer not null default 0
);

create table public.writing_submissions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  activity_id uuid not null references public.activities (id) on delete restrict,
  text text not null,
  ai_feedback jsonb,
  scores jsonb,
  status public.progress_status not null default 'completed',
  created_at timestamptz not null default now()
);

create table public.speaking_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  activity_id uuid not null references public.activities (id) on delete restrict,
  audio_storage_path text not null,
  transcript text,
  ai_feedback jsonb,
  scores jsonb,
  status public.progress_status not null default 'completed',
  created_at timestamptz not null default now()
);

create index user_skill_levels_user_id_idx on public.user_skill_levels (user_id);
create index lesson_progress_user_id_idx on public.lesson_progress (user_id);
create index lesson_progress_lesson_id_idx on public.lesson_progress (lesson_id);
create index activity_attempts_user_id_idx on public.activity_attempts (user_id);
create index activity_attempts_activity_id_idx on public.activity_attempts (activity_id);
create index writing_submissions_user_id_idx on public.writing_submissions (user_id);
create index writing_submissions_activity_id_idx on public.writing_submissions (activity_id);
create index speaking_attempts_user_id_idx on public.speaking_attempts (user_id);
create index speaking_attempts_activity_id_idx on public.speaking_attempts (activity_id);

alter table public.user_skill_levels enable row level security;
alter table public.lesson_progress enable row level security;
alter table public.activity_attempts enable row level security;
alter table public.writing_submissions enable row level security;
alter table public.speaking_attempts enable row level security;

create policy "user_skill_levels_select_own_or_admin" on public.user_skill_levels for select using (user_id = auth.uid() or public.is_admin());
create policy "user_skill_levels_insert_own" on public.user_skill_levels for insert with check (user_id = auth.uid());
create policy "user_skill_levels_update_own" on public.user_skill_levels for update using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "lesson_progress_select_own_or_admin" on public.lesson_progress for select using (user_id = auth.uid() or public.is_admin());
create policy "lesson_progress_insert_own" on public.lesson_progress for insert with check (user_id = auth.uid());
create policy "lesson_progress_update_own" on public.lesson_progress for update using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "activity_attempts_select_own_or_admin" on public.activity_attempts for select using (user_id = auth.uid() or public.is_admin());
create policy "activity_attempts_insert_own" on public.activity_attempts for insert with check (user_id = auth.uid());
create policy "activity_attempts_update_own" on public.activity_attempts for update using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "writing_submissions_select_own_or_admin" on public.writing_submissions for select using (user_id = auth.uid() or public.is_admin());
create policy "writing_submissions_insert_own" on public.writing_submissions for insert with check (user_id = auth.uid());
create policy "writing_submissions_update_own" on public.writing_submissions for update using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "speaking_attempts_select_own_or_admin" on public.speaking_attempts for select using (user_id = auth.uid() or public.is_admin());
create policy "speaking_attempts_insert_own" on public.speaking_attempts for insert with check (user_id = auth.uid());
create policy "speaking_attempts_update_own" on public.speaking_attempts for update using (user_id = auth.uid()) with check (user_id = auth.uid());
