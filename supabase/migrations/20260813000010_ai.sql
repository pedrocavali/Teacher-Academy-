-- AI layer: coach conversations + admin content generation jobs
--
-- What this does: backs the AIProvider/AIService layer (Blueprint Section
-- 12). `ai_conversations` + `ai_messages` store AI Coach practice sessions,
-- owned by the learner. `ai_generation_jobs` logs every admin-triggered
-- content draft request (topic/level/skill/objective in, draft content out)
-- so AI-generated drafts are traceable and never bypass the review pipeline.
--
-- Dependencies: 20260813000001 (enums), 20260813000002 (is_admin),
--   20260813000004 (lessons).
-- RLS: conversations/messages are learner-owned (select/insert own only;
--   messages checked via their parent conversation's ownership); admin gets
--   read-only SELECT for support/QA. ai_generation_jobs is admin-only start
--   to finish — it's an authoring tool, not learner-facing.
-- Indexes: (user_id) on conversations; (conversation_id) on messages.
-- FKs: messages -> conversations cascade (a conversation's messages don't
--   outlive it); conversations -> lesson set null (an AI coach session
--   should survive its lesson being edited/removed).

create table public.ai_conversations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  context_type public.ai_conversation_context not null,
  lesson_id uuid references public.lessons (id) on delete set null,
  status public.progress_status not null default 'in_progress',
  started_at timestamptz not null default now()
);

create table public.ai_messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.ai_conversations (id) on delete cascade,
  role public.ai_message_role not null,
  content text not null,
  tokens_used integer,
  created_at timestamptz not null default now()
);

create table public.ai_generation_jobs (
  id uuid primary key default gen_random_uuid(),
  requested_by uuid not null references public.profiles (id) on delete set null,
  type text not null,
  input_params jsonb not null default '{}'::jsonb,
  output jsonb,
  status public.progress_status not null default 'in_progress',
  created_at timestamptz not null default now()
);

create index ai_conversations_user_id_idx on public.ai_conversations (user_id);
create index ai_conversations_lesson_id_idx on public.ai_conversations (lesson_id);
create index ai_messages_conversation_id_idx on public.ai_messages (conversation_id);
create index ai_generation_jobs_requested_by_idx on public.ai_generation_jobs (requested_by);

alter table public.ai_conversations enable row level security;
alter table public.ai_messages enable row level security;
alter table public.ai_generation_jobs enable row level security;

create policy "ai_conversations_select_own_or_admin" on public.ai_conversations for select using (user_id = auth.uid() or public.is_admin());
create policy "ai_conversations_insert_own" on public.ai_conversations for insert with check (user_id = auth.uid());
create policy "ai_conversations_update_own" on public.ai_conversations for update using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "ai_messages_select_own_or_admin"
  on public.ai_messages for select
  using (
    public.is_admin()
    or exists (select 1 from public.ai_conversations c where c.id = ai_messages.conversation_id and c.user_id = auth.uid())
  );
create policy "ai_messages_insert_own"
  on public.ai_messages for insert
  with check (
    exists (select 1 from public.ai_conversations c where c.id = ai_messages.conversation_id and c.user_id = auth.uid())
  );

create policy "ai_generation_jobs_admin_select" on public.ai_generation_jobs for select using (public.is_admin());
create policy "ai_generation_jobs_admin_insert" on public.ai_generation_jobs for insert with check (public.is_admin());
create policy "ai_generation_jobs_admin_update" on public.ai_generation_jobs for update using (public.is_admin()) with check (public.is_admin());
