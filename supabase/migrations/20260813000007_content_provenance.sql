-- Content provenance & review audit trail
--
-- What this does: tracks where a piece of content's underlying idea came
-- from (Blueprint Section 16 — never copy Voxy/Cambridge/etc., but log
-- pedagogical inspiration with license terms) and an audit trail of every
-- draft -> review -> approved -> published transition (Section 17).
-- Admin-only surface; not part of the learner experience.
--
-- Dependencies: 20260813000002 (is_admin), 20260813000004 (lessons).
-- RLS: admin-only for all operations on all three tables — no learner
--   access needed for MVP.
-- Indexes: FK columns; (content_type, content_id) on content_reviews for
--   "show me this lesson's review history".
-- FKs: lesson_content_sources -> lessons / content_sources, cascade both
--   ways (a join row is meaningless without either side).

create table public.content_sources (
  id uuid primary key default gen_random_uuid(),
  source_name text not null,
  source_url text,
  author text,
  license text,
  attribution_required boolean not null default false,
  commercial_use_allowed boolean,
  modification_allowed boolean,
  date_added date not null default current_date,
  notes text
);

create table public.lesson_content_sources (
  lesson_id uuid not null references public.lessons (id) on delete cascade,
  content_source_id uuid not null references public.content_sources (id) on delete cascade,
  primary key (lesson_id, content_source_id)
);

-- content_type is a free-text discriminator ('lesson' | 'activity' today)
-- rather than an enum, since new reviewable content types may be added
-- without a migration.
create table public.content_reviews (
  id uuid primary key default gen_random_uuid(),
  content_type text not null,
  content_id uuid not null,
  reviewer_id uuid not null references public.profiles (id) on delete set null,
  from_status public.content_status,
  to_status public.content_status not null,
  comment text,
  created_at timestamptz not null default now()
);

create index lesson_content_sources_content_source_id_idx on public.lesson_content_sources (content_source_id);
create index content_reviews_content_idx on public.content_reviews (content_type, content_id);
create index content_reviews_reviewer_id_idx on public.content_reviews (reviewer_id);

alter table public.content_sources enable row level security;
alter table public.lesson_content_sources enable row level security;
alter table public.content_reviews enable row level security;

create policy "content_sources_admin_all_select" on public.content_sources for select using (public.is_admin());
create policy "content_sources_admin_insert" on public.content_sources for insert with check (public.is_admin());
create policy "content_sources_admin_update" on public.content_sources for update using (public.is_admin()) with check (public.is_admin());
create policy "content_sources_admin_delete" on public.content_sources for delete using (public.is_admin());

create policy "lesson_content_sources_admin_select" on public.lesson_content_sources for select using (public.is_admin());
create policy "lesson_content_sources_admin_insert" on public.lesson_content_sources for insert with check (public.is_admin());
create policy "lesson_content_sources_admin_delete" on public.lesson_content_sources for delete using (public.is_admin());

create policy "content_reviews_admin_select" on public.content_reviews for select using (public.is_admin());
create policy "content_reviews_admin_insert" on public.content_reviews for insert with check (public.is_admin());
