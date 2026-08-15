import type { SupabaseClient } from "@supabase/supabase-js";

// Rule-based Learning Engine (Blueprint Section 47) — no AI involved.
// Each rule below produces at most one candidate lesson with a fixed
// priority score; candidates are deduped by lesson, ranked, capped, and
// logged to `recommendations` so click-through can be measured later.

export type Recommendation = {
  recommendationId: string;
  itemType: "lesson";
  itemId: string;
  reasonCode: string;
  reasonText: string;
  title: string;
  href: string;
  cefrLevel: string;
  unitSlug: string | null;
};

type LessonRow = {
  id: string;
  slug: string;
  title: string;
  cefr_level: string;
  order_index: number;
  unit_id: string;
  units: { slug: string }[] | null;
};

type Candidate = {
  lesson: LessonRow;
  reasonCode: string;
  reasonText: string;
  score: number;
};

const MAX_RECOMMENDATIONS = 3;
const LESSON_COLUMNS = "id, slug, title, cefr_level, order_index, unit_id, units(slug)";

export async function getRecommendations(
  supabase: SupabaseClient,
  userId: string,
): Promise<Recommendation[]> {
  const candidates: Candidate[] = [];

  const { data: startedRows } = await supabase
    .from("lesson_progress")
    .select("lesson_id, status")
    .eq("user_id", userId);
  const startedLessonIds = new Set((startedRows ?? []).map((r) => r.lesson_id));

  // Rule 1: an in-progress lesson takes priority over anything new.
  const { data: inProgress } = await supabase
    .from("lesson_progress")
    .select("started_at, lessons!inner(id, slug, title, cefr_level, order_index, unit_id, status, units(slug))")
    .eq("user_id", userId)
    .eq("status", "in_progress")
    .eq("lessons.status", "published")
    .order("started_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const inProgressLesson = inProgress?.lessons as unknown as LessonRow | null;
  if (inProgressLesson) {
    candidates.push({
      lesson: inProgressLesson,
      reasonCode: "continue_lesson",
      reasonText: "Pick up where you left off.",
      score: 100,
    });
  }

  // Rule 2: the learner's weakest tracked skill gets a lesson at that level.
  const { data: skillLevels } = await supabase
    .from("user_skill_levels")
    .select("skill, cefr_level")
    .eq("user_id", userId);

  if (skillLevels && skillLevels.length > 0) {
    const { data: levels } = await supabase.from("cefr_levels").select("code, order_index");
    const orderByCode = new Map((levels ?? []).map((l) => [l.code, l.order_index]));
    const weakest = skillLevels.reduce((min, s) =>
      (orderByCode.get(s.cefr_level) ?? 0) < (orderByCode.get(min.cefr_level) ?? 0) ? s : min,
    );

    const { data: skillLessons } = await supabase
      .from("lessons")
      .select("id, slug, title, cefr_level, order_index, unit_id, primary_skill, units(slug)")
      .eq("status", "published")
      .eq("primary_skill", weakest.skill)
      .eq("cefr_level", weakest.cefr_level)
      .order("order_index", { ascending: true });

    const nextSkillLesson = (skillLessons ?? []).find((l) => !startedLessonIds.has(l.id));
    if (nextSkillLesson) {
      candidates.push({
        lesson: nextSkillLesson,
        reasonCode: "weak_skill",
        reasonText: `Strengthen your ${weakest.skill} (currently ${weakest.cefr_level}).`,
        score: 80,
      });
    }
  }

  // Rule 3: continue the unit the learner most recently finished a lesson in.
  const { data: lastCompleted } = await supabase
    .from("lesson_progress")
    .select("completed_at, lessons!inner(unit_id, order_index)")
    .eq("user_id", userId)
    .eq("status", "completed")
    .order("completed_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const lastCompletedLesson = lastCompleted?.lessons as unknown as {
    unit_id: string;
    order_index: number;
  } | null;

  if (lastCompletedLesson) {
    const { data: nextInUnit } = await supabase
      .from("lessons")
      .select(LESSON_COLUMNS)
      .eq("status", "published")
      .eq("unit_id", lastCompletedLesson.unit_id)
      .gt("order_index", lastCompletedLesson.order_index)
      .order("order_index", { ascending: true })
      .limit(1)
      .maybeSingle();

    if (nextInUnit && !startedLessonIds.has(nextInUnit.id)) {
      candidates.push({
        lesson: nextInUnit,
        reasonCode: "next_in_unit",
        reasonText: "Continue this unit.",
        score: 60,
      });
    }
  }

  // Rule 4: a fresh lesson matching the learner's placement level.
  const { data: placement } = await supabase
    .from("assessment_results")
    .select("overall_level")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (placement) {
    const { data: levelLessons } = await supabase
      .from("lessons")
      .select(LESSON_COLUMNS)
      .eq("status", "published")
      .eq("cefr_level", placement.overall_level)
      .order("order_index", { ascending: true });

    const levelMatch = (levelLessons ?? []).find((l) => !startedLessonIds.has(l.id));
    if (levelMatch) {
      candidates.push({
        lesson: levelMatch,
        reasonCode: "level_match",
        reasonText: `Matches your level (${placement.overall_level}).`,
        score: 40,
      });
    }
  }

  // Rule 5: fallback for a brand-new learner with no history at all.
  if (candidates.length === 0) {
    const { data: firstLesson } = await supabase
      .from("lessons")
      .select(LESSON_COLUMNS)
      .eq("status", "published")
      .eq("cefr_level", "A1")
      .order("order_index", { ascending: true })
      .limit(1)
      .maybeSingle();

    if (firstLesson) {
      candidates.push({
        lesson: firstLesson,
        reasonCode: "getting_started",
        reasonText: "Start here.",
        score: 20,
      });
    }
  }

  const byLesson = new Map<string, Candidate>();
  for (const candidate of candidates) {
    const existing = byLesson.get(candidate.lesson.id);
    if (!existing || candidate.score > existing.score) {
      byLesson.set(candidate.lesson.id, candidate);
    }
  }
  const ranked = [...byLesson.values()]
    .sort((a, b) => b.score - a.score)
    .slice(0, MAX_RECOMMENDATIONS);

  if (ranked.length === 0) {
    return [];
  }

  return logRecommendations(supabase, userId, ranked);
}

// Logs each surfaced candidate once (Blueprint Section 47: click-through
// measurement) — re-surfacing the same lesson for the same reason reuses
// its existing row instead of piling up duplicates.
async function logRecommendations(
  supabase: SupabaseClient,
  userId: string,
  ranked: Candidate[],
): Promise<Recommendation[]> {
  const { data: existingLogs } = await supabase
    .from("recommendations")
    .select("id, item_id, reason_code")
    .eq("user_id", userId)
    .in("item_id", ranked.map((r) => r.lesson.id))
    .is("dismissed_at", null);

  const existingByKey = new Map(
    (existingLogs ?? []).map((r) => [`${r.item_id}:${r.reason_code}`, r.id]),
  );

  const results: Recommendation[] = [];
  for (const candidate of ranked) {
    const key = `${candidate.lesson.id}:${candidate.reasonCode}`;
    let recommendationId = existingByKey.get(key);

    if (!recommendationId) {
      const { data: inserted } = await supabase
        .from("recommendations")
        .insert({
          user_id: userId,
          item_type: "lesson",
          item_id: candidate.lesson.id,
          reason_code: candidate.reasonCode,
          score: candidate.score,
        })
        .select("id")
        .single();
      recommendationId = inserted?.id;
    }

    if (!recommendationId) continue;

    results.push({
      recommendationId,
      itemType: "lesson",
      itemId: candidate.lesson.id,
      reasonCode: candidate.reasonCode,
      reasonText: candidate.reasonText,
      title: candidate.lesson.title,
      href: `/lesson/${candidate.lesson.slug}`,
      cefrLevel: candidate.lesson.cefr_level,
      unitSlug: candidate.lesson.units?.[0]?.slug ?? null,
    });
  }
  return results;
}
