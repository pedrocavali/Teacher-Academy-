-- CEFR level reference data
--
-- What this does: a small reference table describing each CEFR level, used
-- for display (order, description) wherever `public.cefr_level` enum values
-- are shown in the UI. Seeded once; content only, not user data.
--
-- Dependencies: 20260813000001 (cefr_level enum).
-- RLS: enabled, publicly readable (reference data, no sensitivity), admin
--   write only.
-- Indexes: primary key on code covers lookups.
-- FKs: none.

create table public.cefr_levels (
  code public.cefr_level primary key,
  order_index smallint not null unique,
  description text not null
);

comment on table public.cefr_levels is 'Reference data describing each CEFR level; seeded, admin-editable.';

alter table public.cefr_levels enable row level security;

create policy "cefr_levels_select_all"
  on public.cefr_levels for select
  to anon, authenticated
  using (true);

create policy "cefr_levels_admin_write"
  on public.cefr_levels for insert
  with check (public.is_admin());

create policy "cefr_levels_admin_update"
  on public.cefr_levels for update
  using (public.is_admin())
  with check (public.is_admin());

create policy "cefr_levels_admin_delete"
  on public.cefr_levels for delete
  using (public.is_admin());

insert into public.cefr_levels (code, order_index, description) values
  ('A1', 1, 'Breakthrough — basic phrases and simple interactions.'),
  ('A2', 2, 'Waystage — routine tasks on familiar topics.'),
  ('B1', 3, 'Threshold — independent use in familiar contexts.'),
  ('B2', 4, 'Vantage — fluent, spontaneous interaction with some precision.'),
  ('C1', 5, 'Effective Operational Proficiency — flexible, effective use for complex purposes.'),
  ('C2', 6, 'Mastery — precise, nuanced use in virtually all contexts.');
