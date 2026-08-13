-- Extensions and shared enum types
--
-- What this does: enables required Postgres extensions and defines the
-- fixed-vocabulary enum types shared across later migrations (roles, CEFR
-- levels, skills, content status, activity types, etc.), per Blueprint
-- Section 14. Enums are used instead of lookup tables for values that are
-- fixed and rarely change — simpler FKs, no extra joins for filtering.
--
-- Dependencies: none (first migration).
-- RLS: not applicable — no tables created here.
-- Indexes / FKs: not applicable.

create extension if not exists pgcrypto;

create type public.user_role as enum ('admin', 'learner');

create type public.cefr_level as enum ('A1', 'A2', 'B1', 'B2', 'C1', 'C2');

create type public.track_type as enum ('general', 'teachers');

create type public.skill_type as enum (
  'reading', 'listening', 'writing', 'speaking', 'grammar', 'vocabulary'
);

-- draft -> review -> approved -> published content pipeline (Blueprint Section 7 / 17).
create type public.content_status as enum ('draft', 'review', 'approved', 'published');

create type public.activity_type as enum (
  'multiple_choice', 'true_false', 'fill_blank', 'matching', 'ordering',
  'reading_comprehension', 'listening_comprehension', 'speaking', 'writing',
  'grammar', 'vocabulary', 'role_play'
);

create type public.content_item_type as enum (
  'video', 'audio', 'transcript', 'reading_passage', 'image'
);

create type public.media_type as enum ('video', 'audio', 'image');

create type public.progress_status as enum ('not_started', 'in_progress', 'completed');

create type public.ai_conversation_context as enum ('coach', 'lesson');

create type public.ai_message_role as enum ('user', 'assistant');

create type public.recommendation_item_type as enum ('lesson', 'activity');
