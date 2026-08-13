-- Light gamification: streaks + weekly goals
--
-- What this does: backs the deliberately light gamification surface
-- (Blueprint Section 34) — a study streak and a weekly minutes goal.
-- No points/badges/leaderboards for MVP.
--
-- Dependencies: 20260813000002 (is_admin).
-- RLS: learner-owned, select/insert/update own rows only; admin read-only.
-- Indexes: primary key on user_streaks.user_id covers its one lookup;
--   (user_id, week_start) unique on weekly_goals (one goal row per week).
-- FKs: cascade on user_id.

create table public.user_streaks (
  user_id uuid primary key references public.profiles (id) on delete cascade,
  current_streak integer not null default 0,
  longest_streak integer not null default 0,
  last_activity_date date
);

create table public.weekly_goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  week_start date not null,
  target_minutes integer not null default 60,
  minutes_completed integer not null default 0,
  unique (user_id, week_start)
);

create index weekly_goals_user_id_idx on public.weekly_goals (user_id);

alter table public.user_streaks enable row level security;
alter table public.weekly_goals enable row level security;

create policy "user_streaks_select_own_or_admin" on public.user_streaks for select using (user_id = auth.uid() or public.is_admin());
create policy "user_streaks_insert_own" on public.user_streaks for insert with check (user_id = auth.uid());
create policy "user_streaks_update_own" on public.user_streaks for update using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "weekly_goals_select_own_or_admin" on public.weekly_goals for select using (user_id = auth.uid() or public.is_admin());
create policy "weekly_goals_insert_own" on public.weekly_goals for insert with check (user_id = auth.uid());
create policy "weekly_goals_update_own" on public.weekly_goals for update using (user_id = auth.uid()) with check (user_id = auth.uid());
