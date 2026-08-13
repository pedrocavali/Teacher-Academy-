-- Storage buckets: lesson media + speaking recordings
--
-- What this does: two buckets per Blueprint Section 15/16/20/20.
--   - `lesson-media` (public): admin-authored video/audio/images for
--     published lessons. Publicly readable (not sensitive), admin-only
--     write, matching `media_assets`/`content_items`.
--   - `speaking-recordings` (private): learner-uploaded speaking practice
--     audio. Objects are keyed by `{user_id}/...`; a learner can only
--     read/write/delete inside their own folder, admin can read all (for
--     QA/support), matching `speaking_attempts.audio_storage_path`.
--
-- Dependencies: 20260813000002 (is_admin).
-- RLS: storage.objects RLS is already enabled by Supabase; this migration
--   only adds policies scoped by bucket_id.
-- Indexes / FKs: not applicable — bucket/object metadata is managed by
--   Supabase Storage internally.

insert into storage.buckets (id, name, public)
values ('lesson-media', 'lesson-media', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('speaking-recordings', 'speaking-recordings', false)
on conflict (id) do nothing;

create policy "lesson_media_public_read"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'lesson-media');

create policy "lesson_media_admin_insert"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'lesson-media' and public.is_admin());

create policy "lesson_media_admin_update"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'lesson-media' and public.is_admin())
  with check (bucket_id = 'lesson-media' and public.is_admin());

create policy "lesson_media_admin_delete"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'lesson-media' and public.is_admin());

create policy "speaking_recordings_select_own_or_admin"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'speaking-recordings'
    and ((storage.foldername(name))[1] = auth.uid()::text or public.is_admin())
  );

create policy "speaking_recordings_insert_own"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'speaking-recordings'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "speaking_recordings_update_own"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'speaking-recordings'
    and (storage.foldername(name))[1] = auth.uid()::text
  )
  with check (
    bucket_id = 'speaking-recordings'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "speaking_recordings_delete_own"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'speaking-recordings'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
