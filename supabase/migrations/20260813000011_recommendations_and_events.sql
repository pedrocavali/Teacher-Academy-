-- Recommendations log + analytics events
--
-- What this does: `recommendations` logs every item the rule-based Learning
-- Engine (Blueprint Section 11) surfaced to a learner, so click-through can
-- be measured without redesigning anything later. `events` is a single
-- append-only table covering the full analytics event list (Blueprint
-- Section 33 / 18) — logins, lesson/activity started/completed, scores,
-- recommendation clicks, etc. — avoiding a proliferation of near-identical
-- tables; aggregation views can be added once real query patterns emerge.
--
-- Dependencies: 20260813000001 (enums), 20260813000002 (is_admin).
-- RLS: both tables are learner-owned for read (own rows) and insert-only —
--   a learner can log/see their own recommendations and events but never
--   edit or delete history; admin gets read-only SELECT across all rows.
-- Indexes: (user_id, created_at) on events — the standard "this user's
--   recent activity" query; (event_type, created_at) for admin analytics
--   aggregation by event type.
-- FKs: cascade on user_id (account deletion removes its history).

create table public.recommendations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  item_type public.recommendation_item_type not null,
  item_id uuid not null,
  reason_code text not null,
  score numeric,
  created_at timestamptz not null default now(),
  clicked_at timestamptz,
  dismissed_at timestamptz
);

create table public.events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  event_type text not null,
  entity_type text,
  entity_id uuid,
  properties jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index recommendations_user_id_idx on public.recommendations (user_id);
create index events_user_id_created_at_idx on public.events (user_id, created_at);
create index events_event_type_created_at_idx on public.events (event_type, created_at);

alter table public.recommendations enable row level security;
alter table public.events enable row level security;

create policy "recommendations_select_own_or_admin" on public.recommendations for select using (user_id = auth.uid() or public.is_admin());
create policy "recommendations_insert_own" on public.recommendations for insert with check (user_id = auth.uid());
create policy "recommendations_update_own" on public.recommendations for update using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "events_select_own_or_admin" on public.events for select using (user_id = auth.uid() or public.is_admin());
create policy "events_insert_own" on public.events for insert with check (user_id = auth.uid());
