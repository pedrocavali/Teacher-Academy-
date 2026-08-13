-- Content hierarchy: courses -> units -> lessons
--
-- What this does: the top three levels of the curriculum tree (Blueprint
-- Section 8/14). `courses` is a thin wrapper kept for future multi-program
-- growth even though MVP ships effectively one program. `units` are
-- topic-based and carry a `track` (general | teachers); `lessons` live under
-- a unit and each targets one CEFR level + primary skill (Section 6: units
-- span multiple levels via their lessons, not the unit itself).
--
-- Dependencies: 20260813000001 (enums), 20260813000002 (is_admin, set_updated_at).
-- RLS: learners can SELECT only rows with status = 'published'; admin has
--   full CRUD on all three tables.
-- Indexes: FK columns, status (catalog filtering), (parent_id, order_index)
--   for ordered listing.
-- FKs: units.course_id -> courses, lessons.unit_id -> units, both
--   on delete restrict (a course/unit with children must be cleaned up
--   explicitly, not silently cascaded, to avoid accidental content loss).

create table public.courses (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text,
  status public.content_status not null default 'draft',
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.units (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses (id) on delete restrict,
  slug text not null unique,
  title text not null,
  description text,
  track public.track_type not null,
  order_index smallint not null default 0,
  cover_image_url text,
  status public.content_status not null default 'draft',
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.lessons (
  id uuid primary key default gen_random_uuid(),
  unit_id uuid not null references public.units (id) on delete restrict,
  slug text not null unique,
  title text not null,
  objective text not null,
  cefr_level public.cefr_level not null,
  primary_skill public.skill_type not null,
  order_index smallint not null default 0,
  estimated_minutes smallint not null default 15,
  status public.content_status not null default 'draft',
  version smallint not null default 1,
  created_by uuid references public.profiles (id) on delete set null,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.courses is 'Top-level program wrapper (e.g. "Teacher Academy English Program").';
comment on table public.units is 'Topic-based groupings spanning multiple CEFR levels via their lessons.';
comment on table public.lessons is 'A single teachable session; owns the "content core" activities are built from.';

create index units_course_id_idx on public.units (course_id);
create index units_status_idx on public.units (status);
create index units_course_order_idx on public.units (course_id, order_index);

create index lessons_unit_id_idx on public.lessons (unit_id);
create index lessons_status_idx on public.lessons (status);
create index lessons_unit_order_idx on public.lessons (unit_id, order_index);
create index lessons_cefr_level_idx on public.lessons (cefr_level);
create index lessons_primary_skill_idx on public.lessons (primary_skill);

create trigger courses_set_updated_at
  before update on public.courses
  for each row execute function public.set_updated_at();

create trigger units_set_updated_at
  before update on public.units
  for each row execute function public.set_updated_at();

create trigger lessons_set_updated_at
  before update on public.lessons
  for each row execute function public.set_updated_at();

alter table public.courses enable row level security;
alter table public.units enable row level security;
alter table public.lessons enable row level security;

create policy "courses_select_published_or_admin"
  on public.courses for select
  using (status = 'published' or public.is_admin());
create policy "courses_admin_insert" on public.courses for insert with check (public.is_admin());
create policy "courses_admin_update" on public.courses for update using (public.is_admin()) with check (public.is_admin());
create policy "courses_admin_delete" on public.courses for delete using (public.is_admin());

create policy "units_select_published_or_admin"
  on public.units for select
  using (status = 'published' or public.is_admin());
create policy "units_admin_insert" on public.units for insert with check (public.is_admin());
create policy "units_admin_update" on public.units for update using (public.is_admin()) with check (public.is_admin());
create policy "units_admin_delete" on public.units for delete using (public.is_admin());

create policy "lessons_select_published_or_admin"
  on public.lessons for select
  using (status = 'published' or public.is_admin());
create policy "lessons_admin_insert" on public.lessons for insert with check (public.is_admin());
create policy "lessons_admin_update" on public.lessons for update using (public.is_admin()) with check (public.is_admin());
create policy "lessons_admin_delete" on public.lessons for delete using (public.is_admin());
