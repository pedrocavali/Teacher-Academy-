-- Fix admin bootstrap: allow direct DB updates to set the first admin
--
-- What this does: `prevent_role_change()` (from 20260813000002) blocks any
-- update to profiles.role where the caller isn't already an admin. As
-- originally written, it checked `is_admin()` unconditionally — but
-- `is_admin()` resolves via `auth.uid()`, which is null outside a Supabase
-- Auth session (e.g. a superuser query run from the SQL Editor). That made
-- it impossible to ever bootstrap the first admin without manually
-- disabling the trigger first. This fix only enforces the check when
-- there's an actual authenticated (non-admin) session trying to
-- self-promote; a direct database operation with no auth session is
-- unaffected.
--
-- Dependencies: 20260813000002 (profiles, is_admin, prevent_role_change).
-- RLS: no policy changes — this only adjusts a trigger function's logic.

create or replace function public.prevent_role_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.role <> old.role and auth.uid() is not null and not public.is_admin() then
    raise exception 'Only admins can change role';
  end if;
  return new;
end;
$$;
