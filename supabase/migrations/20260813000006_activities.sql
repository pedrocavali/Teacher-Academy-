-- Activity engine: activities, variants, questions, options
--
-- What this does: implements the per-type activity model (Blueprint Section
-- 9). Objective, gradable types (multiple_choice, true_false, fill_blank,
-- matching, ordering) use relational `questions` + `question_options` so
-- grading is deterministic and analyzable; open-ended types (speaking,
-- writing) carry their prompt/config in `activities.config` JSONB instead —
-- there is no fixed answer key to normalize into rows.
--
-- Dependencies: 20260813000001 (enums), 20260813000002 (is_admin,
--   set_updated_at), 20260813000004 (lessons).
-- RLS: activities/activity_variants gate on their own status column;
--   questions/question_options have no status of their own and inherit
--   visibility from their parent activity's status.
-- Indexes: FK columns, (lesson_id, order_index) for ordered lesson playback.
-- FKs: activities.lesson_id -> lessons (cascade), activity_variants /
--   questions -> activities (cascade), question_options -> questions
--   (cascade) — all are meaningless without their parent.

create table public.activities (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid not null references public.lessons (id) on delete cascade,
  type public.activity_type not null,
  skill public.skill_type not null,
  order_index smallint not null default 0,
  instructions text,
  config jsonb not null default '{}'::jsonb,
  status public.content_status not null default 'draft',
  estimated_minutes smallint not null default 5,
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.activities is 'One exercise within a lesson. Open-ended types (speaking/writing) store their prompt in `config`.';

create table public.activity_variants (
  id uuid primary key default gen_random_uuid(),
  activity_id uuid not null references public.activities (id) on delete cascade,
  variant_key text not null,
  content jsonb not null default '{}'::jsonb,
  status public.content_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (activity_id, variant_key)
);

comment on table public.activity_variants is 'Alternate question sets over the same activity, for content variety without new lessons.';

create table public.questions (
  id uuid primary key default gen_random_uuid(),
  activity_id uuid not null references public.activities (id) on delete cascade,
  variant_id uuid references public.activity_variants (id) on delete cascade,
  prompt text not null,
  type public.activity_type not null,
  order_index smallint not null default 0,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.question_options (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null references public.questions (id) on delete cascade,
  text text not null,
  is_correct boolean not null default false,
  order_index smallint not null default 0,
  feedback text
);

create index activities_lesson_id_idx on public.activities (lesson_id);
create index activities_status_idx on public.activities (status);
create index activities_lesson_order_idx on public.activities (lesson_id, order_index);
create index activity_variants_activity_id_idx on public.activity_variants (activity_id);
create index questions_activity_id_idx on public.questions (activity_id);
create index questions_variant_id_idx on public.questions (variant_id);
create index question_options_question_id_idx on public.question_options (question_id);

create trigger activities_set_updated_at
  before update on public.activities
  for each row execute function public.set_updated_at();
create trigger activity_variants_set_updated_at
  before update on public.activity_variants
  for each row execute function public.set_updated_at();
create trigger questions_set_updated_at
  before update on public.questions
  for each row execute function public.set_updated_at();

alter table public.activities enable row level security;
alter table public.activity_variants enable row level security;
alter table public.questions enable row level security;
alter table public.question_options enable row level security;

create policy "activities_select_published_or_admin"
  on public.activities for select
  using (status = 'published' or public.is_admin());
create policy "activities_admin_insert" on public.activities for insert with check (public.is_admin());
create policy "activities_admin_update" on public.activities for update using (public.is_admin()) with check (public.is_admin());
create policy "activities_admin_delete" on public.activities for delete using (public.is_admin());

create policy "activity_variants_select_published_or_admin"
  on public.activity_variants for select
  using (status = 'published' or public.is_admin());
create policy "activity_variants_admin_insert" on public.activity_variants for insert with check (public.is_admin());
create policy "activity_variants_admin_update" on public.activity_variants for update using (public.is_admin()) with check (public.is_admin());
create policy "activity_variants_admin_delete" on public.activity_variants for delete using (public.is_admin());

create policy "questions_select_via_activity_or_admin"
  on public.questions for select
  using (
    public.is_admin()
    or exists (select 1 from public.activities a where a.id = questions.activity_id and a.status = 'published')
  );
create policy "questions_admin_insert" on public.questions for insert with check (public.is_admin());
create policy "questions_admin_update" on public.questions for update using (public.is_admin()) with check (public.is_admin());
create policy "questions_admin_delete" on public.questions for delete using (public.is_admin());

create policy "question_options_select_via_activity_or_admin"
  on public.question_options for select
  using (
    public.is_admin()
    or exists (
      select 1 from public.questions q
      join public.activities a on a.id = q.activity_id
      where q.id = question_options.question_id and a.status = 'published'
    )
  );
create policy "question_options_admin_insert" on public.question_options for insert with check (public.is_admin());
create policy "question_options_admin_update" on public.question_options for update using (public.is_admin()) with check (public.is_admin());
create policy "question_options_admin_delete" on public.question_options for delete using (public.is_admin());
