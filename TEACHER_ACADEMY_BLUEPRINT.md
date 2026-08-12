# TEACHER ACADEMY — BLUEPRINT

**Status:** Draft for review — no application code has been written yet.
**Repository state at time of writing:** empty (no commits, no files, no remote branches). This is a greenfield build; nothing existing constrains the decisions below.

---

## 1. Executive Summary

Teacher Academy is a self-paced, 100% asynchronous English-learning platform for an initial cohort of ~30 teachers. It combines a CEFR-referenced curriculum, a non-linear catalog (learners choose topics; the system recommends practice), an activity engine that renders many exercise types from a shared content core, AI-assisted writing/speaking feedback and a conversational coach, and an admin CMS with a draft → review → approved → published content pipeline.

The recommended build is a **modular monolith**: Next.js (App Router, TypeScript, Tailwind) on Vercel, Supabase (Postgres, Auth, Storage) as the backend, and OpenAI behind a single internal `AIProvider` abstraction. Nothing here requires infrastructure sized for more than a few hundred concurrent users; the architecture is chosen so it doesn't need a rewrite when the cohort grows, not because 30 users demands it today.

This document proposes the product, content, data, and technical architecture, flags complexity and risk per module, and lists the decisions that need your explicit approval before implementation starts (Section 25). **No implementation should begin until those decisions are confirmed.**

---

## 2. Product Vision

Teacher Academy is not a course website — it is a small **language learning platform**: placement → leveled skill profile → a catalog the learner can explore or be guided through → lessons built from reusable content → activities across all four skills plus grammar/vocabulary → AI feedback on writing and speaking → a conversational AI coach → progress tracking that feeds recommendations back into the catalog.

The product should feel structurally similar to Voxy/Coursera/LinkedIn Learning/Duolingo (catalog + recommendation + micro-learning + progress), without copying their visual identity, content, or IP. All content is original, AI-drafted-and-human-reviewed, or explicitly licensed (tracked via `content_sources`).

---

## 3. Target User

- ~30 teachers (professional adults), not children — tone, gamification, and UI should be adult-professional, not playful/childish.
- Mixed English levels, plausibly A2–C1, unknown at signup (hence placement).
- Studying around/between work — sessions of 5–20 minutes, on phone or laptop, at irregular times. Mobile web must be a first-class experience, not an afterthought.
- General English needs plus a professional-context need specific to their job: classroom language, staff meetings, parent communication, feedback, lesson planning.
- Low tolerance for friction: no live scheduling, no external tools (Zoom/Meet), everything inside one product.

---

## 4. Learning Philosophy

**Personalization + Autonomy + Structure**, balanced deliberately:

- **Structure**: content is organized into a real curriculum (CEFR-anchored objectives, grammar/vocabulary progression, a content core reused across activity types) — not a random content pile.
- **Autonomy**: the learner can always go to *Explore* and pick a topic freely; nothing is gated behind forced linear sequences.
- **Personalization**: a transparent, rule-based recommendation layer (Section 11) surfaces "what makes sense next" on the dashboard, based on skill gaps, recent errors, declared interests, and history — visible and explainable, not a black box.

No linear "Unit 1 → Unit 2 → Unit 3" path is enforced. The Catalog/Explore surface is the primary navigation; recommendations are a layer on top of it, not a gate.

---

## 5. User Journey

```
Sign up (email/password)
  → Onboarding (name, goals, interests)
  → Placement Assessment (grammar, vocabulary, reading, listening, writing, speaking)
  → Result: Overall CEFR level + per-skill levels (diagnostic, not certification)
  → Dashboard (recommended practice, continue learning, explore, streak/progress)
  → Explore Catalog (browse by topic/category) OR click a recommendation
  → Unit page → Lesson
  → Lesson: warm-up / context / video / listening+transcript / reading / vocabulary / grammar → Activities
  → Activities: mixed types incl. Speaking (record→transcribe→AI feedback) and Writing (write→AI feedback)
  → Lesson completion → progress updates → skill levels recalculated (rule-based) → new recommendations
  → Repeat, at learner's pace, 5/10/15/20-minute sessions
Admin (parallel track): create/generate draft content → review → approve → publish → monitor analytics
```

This matches the end-to-end flow required for MVP acceptance in Section 22 (Final Product Test) of the brief.

---

## 6. Curriculum Architecture

- **Levels in scope for MVP:** A1, A2, B1, B2, C1 (C2 deferred — very few adult learners need it and content cost is high relative to value at this stage).
- Each level carries: learning objectives, can-do statements, grammar points, vocabulary sets, and functional language, per CEFR + CEFR Companion Volume guidance (used as *research reference*, not copied text).
- Content blends **General English** and **English for Teachers** tracks (Section 10 of the brief). Recommendation: don't pre-split these into separate "courses" the learner must choose between; instead tag every Unit/Lesson with a `track` (`general` | `teachers`) and let both appear in one Explore surface, filterable. Most working teachers want both in the same place.
- CEFR is the taxonomy for level, but **Units are topic-based, not level-based**: a Unit like "Staff Meetings" or "Travel" contains lessons spanning multiple levels (e.g., A2, B1, B2 variants of the same theme), so learners at different levels can explore the same topic. This is what makes "non-linear but structured" actually work — see Section 25 decision #2.

---

## 7. Content Architecture

**Content Core vs. Activity Variants** (brief Section 12) is the central content design decision:

- A Lesson owns a **Content Core**: video, audio, transcript, reading passage, vocabulary set, grammar focus, learning objective.
- Activities are generated *from* that core and tagged by skill + type (multiple_choice, true_false, fill_blank, matching, ordering, reading_comprehension, listening_comprehension, speaking, writing, role_play, grammar, vocabulary).
- An Activity can have multiple **Variants** (different question sets over the same core), so the system can rotate variety without new lesson production.
- This keeps content production cost bounded: one script/video/reading produces a whole lesson's worth of practice across skills.

**Provenance & rights** (brief Section 16): every sourced or reference-derived piece of content is logged in `content_sources` (source_name, source_url, author, license, attribution_required, commercial_use_allowed, modification_allowed, date_added, notes). Nothing is copied from Voxy/Duolingo/Cambridge/Oxford/British Council — those are used only as structural inspiration, cited in this table when a lesson's *idea* (not text) was informed by public pedagogical guidance (e.g., CEFR can-do statement wording).

**Status pipeline** (brief Section 17): every content entity (lesson, activity) carries `status ∈ {draft, review, approved, published}`. AI-generated drafts always enter at `draft`; only an admin action can move content to `published`. This is enforced at the data layer (RLS: learners can only `SELECT` where `status = 'published'`), not just in the UI.

---

## 8. Course / Unit / Lesson Structure

The brief's suggested "6–10 Units × 8–15 Lessons × 3–6 Activities" is too large to responsibly produce, review, and QA before validating the product with 30 real users. Recommendation for **initial launch content**:

| Level | Count |
|---|---|
| Units | **6** (broad, deep themes mixing general + teacher-specific) |
| Lessons per Unit | **8–10** |
| Activities per Lesson | **4–5** |

That's roughly **48–60 lessons** and **200–270 activities** at launch — enough for a 30-person cohort to have genuinely varied material across several weeks at 15–20 min/day, without a content backlog the admin (likely just you, initially) can't realistically review. This is deliberately smaller than the brief's suggested range; see Decision #1 in Section 25. More Units/Lessons are added post-launch as a content backlog, not blocked by engineering.

**Proposed initial 6 Units** (topic-based, spanning multiple CEFR levels each, mixing general + teacher-specific per Section 10):

1. **Everyday Communication** (small talk, daily life, opinions) — general
2. **Travel & Culture** — general
3. **Work & Collaboration** (meetings, feedback, presentations) — general/professional
4. **Classroom English** (instructions, talking to students, classroom management) — teacher-specific
5. **Teacher-to-Teacher & Parent Communication** (staff meetings, parent conferences, discussing student progress) — teacher-specific
6. **Technology, Education & the Future** (edtech, lesson planning, professional development) — mixed

`Course` remains a real entity above `Unit` (e.g., "Teacher Academy English Program") even though MVP effectively ships one course — this is cheap now and avoids a schema change when a second program (e.g., an exam-prep track) is added later.

---

## 9. Activity Architecture

An `Activity` has a `type`, and the frontend has one renderer component per type (`QuestionRenderer` dispatches by type). MVP types: `multiple_choice`, `true_false`, `fill_blank`, `matching`, `ordering`, `reading_comprehension`, `listening_comprehension`, `speaking`, `writing`, `grammar`, `vocabulary`. `role_play` is a speaking sub-mode (conversation with the AI Coach) rather than a fully separate renderer.

Storage approach (hybrid, deliberate trade-off):
- **Objective, gradable types** (multiple_choice, true_false, fill_blank, matching, ordering) use relational `questions` + `question_options` tables — enables deterministic, AI-free grading and clean analytics (item difficulty, common wrong answers).
- **Open-ended types** (speaking, writing) store prompts/config as JSONB on the activity/variant — grading requires AI evaluation, not a fixed answer key, so relational option tables don't apply.

Adding a new activity type later means adding a new renderer + (if gradable) reusing the existing `questions` schema, or (if open-ended) a new JSONB shape — no migration of existing content required.

---

## 10. Placement Architecture

Diagnostic, explicitly **not** a certification (brief Section 19). Structure:

- Objective sections (grammar, vocabulary, reading, listening): fixed-form multiple-choice/gap-fill items pre-tagged with a target CEFR band. Scored deterministically — no AI involved, no cost, fully reproducible. Per-skill level = highest band where the learner clears an accuracy threshold.
- Writing section: one prompt, AI-evaluated against a CEFR-indicator rubric (grammar, vocabulary range, coherence, task completion) → estimated band + written feedback.
- Speaking section: one recorded prompt, transcribed (OpenAI speech-to-text) then AI-evaluated (intelligibility, fluency, vocabulary, grammar) → estimated band.
- Overall level = a documented, simple aggregation (recommend: rounded average of the four core skills — reading/listening/grammar-vocabulary objective score and writing; speaking reported but weighted lower initially since it's the noisiest signal at MVP). Exact formula is a Section 25 decision.

This is intentionally **not** adaptive/IRT-based at MVP — that's flagged as HIGH complexity and explicitly deferred (Section 21). The schema (item-level responses stored) is designed so an adaptive engine can be layered on later without re-architecting.

---

## 11. Learning Engine (Recommendations)

Rule-based and transparent, per brief Section 13/47 — no ML at MVP. Implemented as a pure function in the domain layer, evaluated on dashboard load (no background job needed at this scale):

```
IF placement not completed        → recommend: take placement
IF placement just completed       → recommend: 2-3 starter lessons matching overall level
IF skill_level(speaking) < target → recommend: a speaking activity
IF listening_accuracy(recent) < 70% → recommend: a listening review activity
IF grammar_error_pattern recurring  → recommend: targeted grammar activity
IF user declared interest = X       → boost lessons tagged topic = X
IF lesson just completed            → recommend: next lesson in same unit, or a related-topic lesson
```

Rules live in versioned application code (testable, reviewable in PRs) rather than a database-editable rules table for MVP — see Decision #6. Every recommendation shown is logged (`recommendations` table) so click-through can be measured later without redesigning anything.

---

## 12. AI Architecture

Single internal abstraction, never called ad hoc from UI code:

```
AIProvider (interface)
  generateExercise()
  evaluateWriting()
  evaluateSpeaking()
  generateFeedback()
  chat()
  generateLessonVariant()

  ↑ implemented by

OpenAIProvider (uses OpenAI Chat/Responses API + speech-to-text)

  ↑ used only by

AIService (lib/ai)
  - owns prompt templates per use case
  - persists results (writing_submissions.ai_feedback, speaking_attempts.ai_feedback,
    ai_generation_jobs for admin content drafting, ai_messages for the coach)
  - enforces caching/reuse: never re-run a graded submission's evaluation twice
  - basic per-user rate limiting on the coach to bound cost

  ↑ used only by

Application layer (server actions / route handlers)
```

Cost discipline (brief Section 54): objective activities (multiple_choice, fill_blank, etc.) are graded by plain code — **zero AI calls**. AI is reserved for writing/speaking evaluation, the coach, and admin-side content drafting. All AI outputs are persisted so nothing is regenerated on re-render or re-visit.

The **AI Coach** (Section 22 of the brief) is scoped for MVP as a **lesson-anchored practice conversation** (e.g., "you're in a staff meeting, respond to this proposal"), not an open-ended general chatbot — bounded turns, known context (level, current lesson, vocab/grammar focus, recurring errors), ends in structured feedback. See Decision #4.

**Content generation tool** (Admin, Section 48): admin supplies topic + level + skill + objective; `AIService.generateLessonVariant()`/`generateExercise()` produces a full draft (title, objective, script, transcript, vocabulary, questions, answer key, speaking/writing prompts) written to the DB at `status = draft`, logged in `ai_generation_jobs`, and enters the same review pipeline as any other content — no separate "AI content" path that bypasses review.

---

## 13. Technical Architecture

**Modular monolith**, Next.js App Router + TypeScript + Tailwind, deployed on Vercel, backed by Supabase (Postgres + Auth + Storage). No microservices, no separate services to operate.

```
app/
  (public)/          marketing/landing, login, signup
  (learner)/          dashboard, explore, unit/[slug], lesson/[slug], activity, progress, coach
  (admin)/            content list/editor, review queue, users, analytics
lib/
  domain/            content.ts, assessment.ts, progress.ts, recommendation.ts  (business rules, framework-agnostic)
  data/              typed repository functions per entity, wrapping the Supabase client
  ai/                AIProvider interface + OpenAIProvider + AIService
components/          LessonCard, UnitCard, ActivityCard, AudioPlayer, VideoPlayer, Transcript,
                     ProgressBar, SkillProgress, QuestionRenderer, SpeakingRecorder, WritingEditor,
                     FeedbackCard, RecommendationCard, CourseCard
supabase/
  migrations/        versioned SQL migrations (Section 20 process)
```

- Server-side Supabase client (RLS-enforced) is the default path for all reads/writes. The Supabase **service-role key** is confined to a small number of explicitly server-only operations (e.g., admin bulk jobs) and is never sent to the client — enforced by only referencing it in server-only modules (`server-only` import guard) and env var naming discipline (`SUPABASE_SERVICE_ROLE_KEY`, never `NEXT_PUBLIC_*`).
- All secrets via environment variables; `.env.example` documents required vars with no real values; `.env.local` is git-ignored.

---

## 14. Database Architecture

PostgreSQL via Supabase. This is a proposal, not final DDL — actual migrations get written and reviewed in Phase 2 with explicit RLS/index/FK review per brief Section 42.

**Identity**
- `profiles` — 1:1 with `auth.users` (id = auth.users.id), `full_name`, `avatar_url`, `role` (`admin`|`learner`), `timezone`, `created_at`. (A single enum column, not a separate `roles` table, at this scale — see Decision #5.)

**Curriculum reference**
- `cefr_levels` — code (A1..C1), order_index, description
- (skills modeled as a Postgres enum, not a table: `reading|listening|writing|speaking|grammar|vocabulary`)

**Content hierarchy**
- `courses` — id, slug, title, description, status
- `units` — id, course_id FK, slug, title, description, track (`general`|`teachers`), order_index, cover_image, status
- `lessons` — id, unit_id FK, slug, title, objective, cefr_level, primary_skill, order_index, estimated_minutes, status, version, created_by, published_at
- `content_items` — id, lesson_id FK, type (`video`|`audio`|`transcript`|`reading_passage`|`image`), media_asset_id FK nullable, text_content, metadata JSONB
- `media_assets` — id, storage_path, type, duration_seconds, mime_type, uploaded_by, created_at
- `vocabulary_items` — id, lesson_id FK nullable, term, definition, example_sentence, cefr_level, part_of_speech
- `grammar_topics` — id, name, cefr_level, explanation, examples JSONB
- `lesson_vocabulary`, `lesson_grammar` — join tables

**Activities**
- `activities` — id, lesson_id FK, type, skill, order_index, instructions, config JSONB, status, estimated_minutes
- `activity_variants` — id, activity_id FK, variant_key, content JSONB, status
- `questions` — id, activity_id FK, variant_id FK nullable, prompt, type, order_index, metadata JSONB
- `question_options` — id, question_id FK, text, is_correct, order_index, feedback

**Provenance & review**
- `content_sources` — source_name, source_url, author, license, attribution_required, commercial_use_allowed, modification_allowed, date_added, notes
- `lesson_content_sources` — join table
- `content_reviews` — id, content_type, content_id, reviewer_id, from_status, to_status, comment, created_at

**Placement / assessment**
- `assessments` — id, type (`placement`), title, version, status
- `assessment_questions` — id, assessment_id FK, skill, target_cefr_level, payload JSONB
- `assessment_attempts` — id, user_id FK, assessment_id FK, started_at, completed_at, status
- `assessment_responses` — id, attempt_id FK, question_id FK, response, is_correct, score
- `assessment_results` — id, attempt_id FK, user_id FK, overall_level, reading_level, listening_level, writing_level, speaking_level, grammar_level, vocabulary_level, raw_scores JSONB, created_at

**Progress**
- `user_skill_levels` — id, user_id FK, skill, cefr_level, updated_at, source (`placement`|`ongoing`)
- `lesson_progress` — id, user_id FK, lesson_id FK, status, started_at, completed_at, time_spent_seconds
- `activity_attempts` — id, user_id FK, activity_id FK, variant_id FK nullable, started_at, completed_at, score, max_score, is_correct, responses JSONB, time_spent_seconds
- `writing_submissions` — id, user_id FK, activity_id FK, text, ai_feedback JSONB, scores JSONB, status, created_at
- `speaking_attempts` — id, user_id FK, activity_id FK, audio_storage_path, transcript, ai_feedback JSONB, scores JSONB, status, created_at

**AI**
- `ai_conversations` — id, user_id FK, context_type (`coach`|`lesson`), lesson_id FK nullable, started_at, status
- `ai_messages` — id, conversation_id FK, role, content, created_at, tokens_used
- `ai_generation_jobs` — id, requested_by FK, type, input_params JSONB, output JSONB, status, created_at

(AI feedback is stored inline on `writing_submissions`/`speaking_attempts` rather than a separate generic `ai_feedback` table — fewer joins, and feedback is always 1:1 with a submission. This is a deliberate simplification from the brief's suggested table list.)

**Recommendations & analytics**
- `recommendations` — id, user_id FK, item_type, item_id, reason_code, score, created_at, clicked_at, dismissed_at
- `events` — id, user_id FK, event_type, entity_type, entity_id, properties JSONB, created_at — single append-only table covering the full analytics event list in brief Section 33 (login, lesson_started/completed, activity_started/completed, answer_submitted, recommendation_clicked, speaking_attempt, writing_attempt, review_completed, etc.), indexed on (user_id, event_type, created_at). Avoids a proliferation of near-identical tables; aggregation views/materialized views can be added once real query patterns emerge.

**Gamification (light)**
- `user_streaks` — user_id FK, current_streak, longest_streak, last_activity_date
- `weekly_goals` — id, user_id FK, week_start, target_minutes, minutes_completed

All content tables get FKs with `ON DELETE RESTRICT` (or `SET NULL` where deletion should cascade gracefully, e.g. media), indexes on every FK and on `status`/`published_at` for catalog queries, and `updated_at` triggers where mutation history matters.

---

## 15. Authentication

Supabase Auth, **email/password only for MVP** (brief Section 27). A Postgres trigger on `auth.users` insert creates the matching `profiles` row (default `role = 'learner'`). OAuth providers (Google/Microsoft) and SSO are explicitly deferred — the schema doesn't need to change to add them later, only Supabase Auth config.

---

## 16. Authorization

Two roles for MVP: `ADMIN`, `LEARNER` (brief Section 28) — `MANAGER`/`CONTENT_EDITOR` deferred, no schema work needed to add them later (just new enum values + policy branches).

**Row Level Security**, enforced in Postgres (not just app code):

- `profiles`: user reads/updates own row; admin reads all.
- Content tables (`courses`, `units`, `lessons`, `activities`, `questions`, …): learners `SELECT` only where `status = 'published'`; admins have full CRUD via an `is_admin()` SQL helper function (checks `profiles.role` for `auth.uid()`).
- Progress/attempt/submission tables: user can `SELECT`/`INSERT`/`UPDATE` only rows where `user_id = auth.uid()`; admins get read-only access for analytics, not write access to learner data.
- `events`: insert-only for own `user_id`; select restricted to admin.
- Media: published lesson media (video/audio/images) in a public Supabase Storage bucket (not sensitive); user-recorded speaking audio in a private bucket, readable only by its owner + admin via signed URL.
- Service-role key bypasses RLS by design — confined to server-only admin batch operations, never reachable from the browser.

---

## 17. Admin CMS

Admin can: create/edit Course → Unit → Lesson → Activity → Question, attach audio/video/transcript, request AI-drafted content, move content through `draft → review → approved → published` (and unpublish), and view learner progress/analytics. This is the primary surface for content operations described in brief Sections 17, 25, 48.

---

## 18. Analytics

Single `events` table (Section 14) captures the full event list from brief Section 33. Admin analytics views (built on top, not separate ingestion pipelines) answer: engagement (logins, time spent, streaks), content performance (completion rates, accuracy by activity, common wrong answers), and skill trends (aggregate skill-level movement over time). No external analytics vendor needed at this scale — Postgres views/materialized views are sufficient and keep everything in one place, one bill, one security boundary.

---

## 19. UX / UI Structure

Learner-facing pages: Landing/Login/Signup → Onboarding → Placement flow → Dashboard → Explore/Catalog → Unit page → Lesson player (content core + activity sequence) → Activity screens (per-type renderer, including Speaking recorder and Writing editor with feedback cards) → Progress/Profile → AI Coach.

Admin-facing pages: Content list (filter by status/level/skill) → Content editor (per entity) → AI draft generator → Review queue → Publish controls → Users → Analytics dashboards.

Design direction: modern, clean, professional-educational (not gamified/childish), fully responsive — phone is a primary device, not a secondary breakpoint. Visual identity is original; only the *structural* ideas (catalog, recommendation rail, progress rings, micro-session cards) take inspiration from Voxy/Coursera/LinkedIn Learning/Duolingo, per brief Section 35.

---

## 20. MVP

In scope (brief Section 37, unchanged): Auth, Profile, Placement, Level, Catalog, Explore, Units, Lessons, Reading, Listening, Grammar, Vocabulary, Writing, Speaking, Progress, AI Feedback, basic rule-based Recommendations, Admin CMS, Content Review pipeline.

Explicitly **out of scope** for MVP (brief Section 38, unchanged): live classes, social/marketplace features, complex gamification, ML-based recommendations, advanced pronunciation scoring, native mobile apps, a custom video editor, multi-tenant/microservices infrastructure.

---

## 21. Future Roadmap (post-MVP, not now)

- Adaptive/IRT-based placement.
- OAuth/SSO login providers.
- `MANAGER` / `CONTENT_EDITOR` roles with finer-grained CMS permissions.
- DB-editable recommendation rules (admin-tunable without a deploy).
- Advanced pronunciation scoring.
- Richer gamification (weekly challenges, cohort leaderboards) — kept light by design at MVP.
- A second `course` (e.g., exam-prep track) exercising the `courses` entity that MVP under-uses.
- Content localization/multi-language UI shell (content itself stays English-only, that's the product).

---

## 22. Risks

1. **Content production bottleneck.** ~200–270 activities is still substantial for a small review team. AI drafting helps, but every piece needs human review before publish. Mitigation: launch with the smaller 6-Unit scope (Section 8), expand as a backlog.
2. **Speaking evaluation quality.** ASR + AI scoring for L2 speech is imperfect and can misjudge non-native patterns. Must be presented as formative feedback, not an authoritative score; advanced pronunciation scoring stays out of scope.
3. **Placement validity.** A fixed-form, rule-scored diagnostic is not Cambridge-grade psychometrics. Must be labeled clearly as a diagnostic estimate to users, with the door open to an adaptive engine later.
4. **AI cost creep.** Coach + writing/speaking evaluation are the only AI-cost surfaces; needs caching, persistence of results, and basic per-user rate limiting from day one, even at 30 users, to validate real cost before scaling.
5. **RLS misconfiguration.** A single wrong policy could leak learner data or let learners write to content tables. Every migration touching RLS gets an explicit policy review + a basic access test before merge (brief Section 42 process).
6. **Scope creep.** This brief spans ~60 sections; the temptation to build everything is real. MVP boundaries (Section 20) must be held firmly until 30 real users have validated the core loop.
7. **Single-admin bottleneck.** Content review realistically depends on one person initially. Not a blocker for MVP (roles for multi-editor collaboration are deferred by design), but worth naming as an operational risk, not just a technical one.

---

## 23. Complexity by Module

| Module | Complexity | Why |
|---|---|---|
| Auth | LOW | Supabase Auth handles the hard parts; only email/password at MVP |
| Profile / Dashboard | LOW–MEDIUM | Mostly display + simple aggregation |
| Content data model + Admin CMS | MEDIUM | Many related entities, explicit status workflow |
| Catalog / Explore | LOW–MEDIUM | Filtering/browsing over published content |
| Activity Engine | MEDIUM–HIGH | Multiple renderer types, must stay extensible without touching existing content |
| Placement Assessment | HIGH | Multi-skill scoring, blends deterministic + AI evaluation, must be defensible as "diagnostic" |
| Speaking | HIGH | Cross-device audio capture, storage, transcription, evaluation, retry UX — most moving parts of any module |
| Writing AI feedback | MEDIUM–HIGH | Prompt/rubric consistency, feedback UX (well vs. improve vs. retry) |
| AI Coach | HIGH | Context assembly (level, lesson, errors), conversation state, cost/latency control |
| Multimedia (video/audio/transcript) | MEDIUM | Bounded by deliberately *not* building custom streaming — Supabase Storage + plain players |
| Adaptive/Recommendation engine | LOW–MEDIUM | Deliberately rule-based, no ML, by design |
| AI content generation tool | MEDIUM–HIGH | Prompt templates per content type, must integrate cleanly into the review pipeline |
| Analytics | LOW–MEDIUM | Single events table + views; no external pipeline |
| RLS / Security | MEDIUM | Many tables, each needs a correct, tested policy |

---

## 24. Estimated Development Sequence

Following the brief's phase structure (Section 56), refined with dependency notes:

1. **Project foundation** — Next.js/TS/Tailwind scaffold, repo conventions, env var setup, CI basics.
2. **Supabase schema + migrations** — Section 14 entities, RLS policies, seed reference data (CEFR levels).
3. **Authentication** — signup/login, `profiles` trigger, session handling.
4. **Design system** — shared components (Section 44 list), tokens, layout shells for learner/admin.
5. **User dashboard** — shell + placeholders wired to real (empty) data, not mocked.
6. **Content CMS** — admin CRUD for course/unit/lesson/activity/question, draft→review→publish workflow.
7. **Catalog / Explore** — published-content browsing, topic filters.
8. **Lessons** — content core rendering (video/audio/transcript/reading).
9. **Activity Engine** — per-type renderers, grading for objective types.
10. **Placement** — assessment flow, scoring, results screen, feeds `user_skill_levels`.
11. **Writing AI** — editor, AIService.evaluateWriting, feedback UI.
12. **Speaking** — recorder, upload, transcription, AIService.evaluateSpeaking, feedback UI.
13. **AI Coach** — lesson-anchored conversation flow.
14. **Recommendations** — rule engine wired to dashboard.
15. **Analytics** — events instrumentation across all flows, admin views.
16. **QA** — critical-flow tests (Section 26 below), RLS access tests.
17. **Production deployment** — Vercel env config, go-live checklist.

Each phase should ship in a working, demo-able state end-to-end (brief Section 50: no dead buttons, no lorem ipsum) before moving to the next.

---

## 25. Decisions Requiring Your Approval

These are the calls that materially affect scope, cost, or architecture and should be confirmed before implementation starts:

1. **Launch content volume.** Recommend 6 Units × 8–10 Lessons × 4–5 Activities (~200–270 activities) instead of the brief's suggested 6–10 × 8–15 × 3–6 range, to keep the review workload realistic pre-launch. Confirm, or specify a different target.
2. **Unit structure.** Units are topic-based and span multiple CEFR levels internally (lessons within a unit are leveled, not the unit itself). Confirm this matches the "non-linear but structured" intent.
3. **Placement approach.** Fixed-form, rule-scored diagnostic for objective skills + single AI-evaluated writing/speaking prompt each; explicitly not adaptive/IRT at MVP. Confirm acceptable, and confirm the overall-level aggregation rule (recommend: average of reading/listening/grammar-vocabulary/writing, with speaking reported separately as it's the noisiest MVP signal).
4. **AI Coach scope.** Lesson-anchored, bounded practice conversations (not an open-ended general chatbot) for MVP, for cost and quality control. Confirm.
5. **Roles.** Only `ADMIN` and `LEARNER` for MVP, `role` as an enum column on `profiles` (no separate `roles` table yet). Confirm, and confirm who besides you (if anyone) needs `ADMIN` at launch.
6. **Recommendation rules in code, not DB.** Rules are versioned in the application layer (not an admin-editable rules table) for MVP simplicity. Confirm, or request a DB-driven rules table from day one.
7. **Media hosting.** Supabase Storage for all video/audio/images at MVP — no dedicated video CDN/streaming service. Confirm this is acceptable given short-form (a few minutes) video content.
8. **Speaking capture.** Browser `MediaRecorder` → upload to Supabase Storage → OpenAI transcription → AI evaluation, entirely in-browser (no native app). Confirm this satisfies the record→upload→transcribe→analyze→feedback→retry flow for MVP.
9. **English variety.** Confirm whether content should be authored in a consistent US or UK English variety (spelling, vocabulary) — needs to be fixed before content production starts.
10. **`courses` entity.** Kept as a wrapper above `units` even though MVP effectively ships a single program, to avoid a future migration when a second program is added. Confirm no objection to the extra (currently under-used) layer.

---

*End of Blueprint. Per the brief, implementation does not begin until these decisions are confirmed. Nothing beyond this document has been created — no app code, no migrations, no dependencies installed.*
