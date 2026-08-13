-- Content core: media, content items, vocabulary, grammar
--
-- What this does: the reusable "Content Core" a lesson's activities are
-- generated from (Blueprint Section 12) — video/audio/transcript/reading
-- plus the vocabulary and grammar focus. `vocabulary_items` and
-- `grammar_topics` carry their own `content_status` so they can be
-- authored/reviewed independently of any single lesson (Blueprint Section
-- 18: every content item needs level/skill/status), then linked to lessons
-- via join tables.
--
-- Dependencies: 20260813000001 (enums), 20260813000002 (is_admin,
--   set_updated_at), 20260813000004 (lessons).
-- RLS:
--   - vocabulary_items / grammar_topics: own status column governs
--     visibility directly (published or admin).
--   - media_assets: admin-authored content media; a learner may read a row
--     only if it's referenced by a content_item on a published lesson.
--   - content_items / lesson_vocabulary / lesson_grammar: no status of
--     their own — visibility inherits from the parent lesson's status.
-- Indexes: FK columns; (lesson_id) on content_items for the common
--   "load this lesson's content core" query.
-- FKs: content_items.lesson_id -> lessons (cascade — content items don't
--   outlive their lesson), content_items.media_asset_id -> media_assets
--   (set null — deleting a media asset shouldn't delete the content item).

create table public.media_assets (
  id uuid primary key default gen_random_uuid(),
  storage_path text not null,
  type public.media_type not null,
  duration_seconds integer,
  mime_type text,
  uploaded_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now()
);

comment on table public.media_assets is 'Admin-authored lesson media (video/audio/image) stored in the lesson-media bucket.';

create table public.content_items (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid not null references public.lessons (id) on delete cascade,
  type public.content_item_type not null,
  media_asset_id uuid references public.media_assets (id) on delete set null,
  text_content text,
  metadata jsonb not null default '{}'::jsonb,
  order_index smallint not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.content_items is 'One piece of a lesson''s content core (video, audio, transcript, reading passage, image).';

create table public.vocabulary_items (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid references public.lessons (id) on delete set null,
  term text not null,
  definition text not null,
  example_sentence text,
  cefr_level public.cefr_level not null,
  part_of_speech text,
  status public.content_status not null default 'draft',
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.grammar_topics (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  cefr_level public.cefr_level not null,
  explanation text not null,
  examples jsonb not null default '[]'::jsonb,
  status public.content_status not null default 'draft',
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.lesson_vocabulary (
  lesson_id uuid not null references public.lessons (id) on delete cascade,
  vocabulary_item_id uuid not null references public.vocabulary_items (id) on delete cascade,
  primary key (lesson_id, vocabulary_item_id)
);

create table public.lesson_grammar (
  lesson_id uuid not null references public.lessons (id) on delete cascade,
  grammar_topic_id uuid not null references public.grammar_topics (id) on delete cascade,
  primary key (lesson_id, grammar_topic_id)
);

create index content_items_lesson_id_idx on public.content_items (lesson_id);
create index content_items_media_asset_id_idx on public.content_items (media_asset_id);
create index vocabulary_items_lesson_id_idx on public.vocabulary_items (lesson_id);
create index vocabulary_items_status_idx on public.vocabulary_items (status);
create index vocabulary_items_cefr_level_idx on public.vocabulary_items (cefr_level);
create index grammar_topics_status_idx on public.grammar_topics (status);
create index grammar_topics_cefr_level_idx on public.grammar_topics (cefr_level);
create index lesson_vocabulary_vocabulary_item_id_idx on public.lesson_vocabulary (vocabulary_item_id);
create index lesson_grammar_grammar_topic_id_idx on public.lesson_grammar (grammar_topic_id);

create trigger content_items_set_updated_at
  before update on public.content_items
  for each row execute function public.set_updated_at();
create trigger vocabulary_items_set_updated_at
  before update on public.vocabulary_items
  for each row execute function public.set_updated_at();
create trigger grammar_topics_set_updated_at
  before update on public.grammar_topics
  for each row execute function public.set_updated_at();

alter table public.media_assets enable row level security;
alter table public.content_items enable row level security;
alter table public.vocabulary_items enable row level security;
alter table public.grammar_topics enable row level security;
alter table public.lesson_vocabulary enable row level security;
alter table public.lesson_grammar enable row level security;

create policy "media_assets_select_via_published_lesson_or_admin"
  on public.media_assets for select
  using (
    public.is_admin()
    or exists (
      select 1 from public.content_items ci
      join public.lessons l on l.id = ci.lesson_id
      where ci.media_asset_id = media_assets.id and l.status = 'published'
    )
  );
create policy "media_assets_admin_insert" on public.media_assets for insert with check (public.is_admin());
create policy "media_assets_admin_update" on public.media_assets for update using (public.is_admin()) with check (public.is_admin());
create policy "media_assets_admin_delete" on public.media_assets for delete using (public.is_admin());

create policy "content_items_select_via_lesson_or_admin"
  on public.content_items for select
  using (
    public.is_admin()
    or exists (select 1 from public.lessons l where l.id = content_items.lesson_id and l.status = 'published')
  );
create policy "content_items_admin_insert" on public.content_items for insert with check (public.is_admin());
create policy "content_items_admin_update" on public.content_items for update using (public.is_admin()) with check (public.is_admin());
create policy "content_items_admin_delete" on public.content_items for delete using (public.is_admin());

create policy "vocabulary_items_select_published_or_admin"
  on public.vocabulary_items for select
  using (status = 'published' or public.is_admin());
create policy "vocabulary_items_admin_insert" on public.vocabulary_items for insert with check (public.is_admin());
create policy "vocabulary_items_admin_update" on public.vocabulary_items for update using (public.is_admin()) with check (public.is_admin());
create policy "vocabulary_items_admin_delete" on public.vocabulary_items for delete using (public.is_admin());

create policy "grammar_topics_select_published_or_admin"
  on public.grammar_topics for select
  using (status = 'published' or public.is_admin());
create policy "grammar_topics_admin_insert" on public.grammar_topics for insert with check (public.is_admin());
create policy "grammar_topics_admin_update" on public.grammar_topics for update using (public.is_admin()) with check (public.is_admin());
create policy "grammar_topics_admin_delete" on public.grammar_topics for delete using (public.is_admin());

create policy "lesson_vocabulary_select_via_lesson_or_admin"
  on public.lesson_vocabulary for select
  using (
    public.is_admin()
    or exists (select 1 from public.lessons l where l.id = lesson_vocabulary.lesson_id and l.status = 'published')
  );
create policy "lesson_vocabulary_admin_write" on public.lesson_vocabulary for insert with check (public.is_admin());
create policy "lesson_vocabulary_admin_delete" on public.lesson_vocabulary for delete using (public.is_admin());

create policy "lesson_grammar_select_via_lesson_or_admin"
  on public.lesson_grammar for select
  using (
    public.is_admin()
    or exists (select 1 from public.lessons l where l.id = lesson_grammar.lesson_id and l.status = 'published')
  );
create policy "lesson_grammar_admin_write" on public.lesson_grammar for insert with check (public.is_admin());
create policy "lesson_grammar_admin_delete" on public.lesson_grammar for delete using (public.is_admin());
