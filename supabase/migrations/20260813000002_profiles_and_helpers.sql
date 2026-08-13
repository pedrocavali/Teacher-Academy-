-- Profiles + shared helper functions
--
-- What this does:
--   - `public.profiles`: 1:1 extension of `auth.users` (Blueprint Section 15/16).
--   - `public.is_admin()`: security-definer helper used by every RLS policy
--     in later migrations to grant admins full access without recursive
--     policy evaluation.
--   - `public.set_updated_at()`: reusable BEFORE UPDATE trigger function,
--     attached to every table with an `updated_at` column.
--   - `handle_new_user()` trigger on `auth.users`: creates the matching
--     `profiles` row at signup (role defaults to 'learner').
--   - `prevent_role_change()` trigger: blocks a non-admin from promoting
--     themselves by directly updating `profiles.role` via the client SDK.
--
-- Dependencies: 20260813000001 (user_role enum).
-- RLS: enabled. Learner reads/updates own row only; admin reads/updates all.
--   No INSERT/DELETE policy for regular clients — rows are created only via
--   the `handle_new_user` trigger (security definer, bypasses RLS) and
--   deleted only via `auth.users` cascade (admin/API operation).
-- Indexes: primary key on id (= auth.users.id) covers all current lookups.
-- FKs: profiles.id -> auth.users.id, on delete cascade.

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  avatar_url text,
  role public.user_role not null default 'learner',
  timezone text not null default 'UTC',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.profiles is 'One row per auth.users, carries app-level identity and role.';

alter table public.profiles enable row level security;

-- security definer: lets policies on `profiles` itself call this without
-- recursively re-evaluating RLS on the inner select.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data ->> 'full_name');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create or replace function public.prevent_role_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.role <> old.role and not public.is_admin() then
    raise exception 'Only admins can change role';
  end if;
  return new;
end;
$$;

create trigger profiles_prevent_role_change
  before update on public.profiles
  for each row execute function public.prevent_role_change();

create policy "profiles_select_own_or_admin"
  on public.profiles for select
  using (id = auth.uid() or public.is_admin());

create policy "profiles_update_own_or_admin"
  on public.profiles for update
  using (id = auth.uid() or public.is_admin())
  with check (id = auth.uid() or public.is_admin());
