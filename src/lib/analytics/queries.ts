import type { SupabaseClient } from "@supabase/supabase-js";

// Admin-only aggregate reads over `events` and the progress tables
// (Blueprint Section 33/18). Dataset is small (a few dozen teachers), so
// aggregation happens in JS after a handful of targeted queries rather
// than via database views.

export type AnalyticsSummary = {
  totalLearners: number;
  activeLearners7d: number;
  lessonsStarted: number;
  lessonsCompleted: number;
  placementCompletionRate: number | null;
  averageActivityScore: number | null;
  recommendationClickRate: number | null;
};

export async function getAnalyticsSummary(
  supabase: SupabaseClient,
): Promise<AnalyticsSummary> {
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  const [
    totalLearners,
    lessonsStarted,
    lessonsCompleted,
    placementCount,
    activityAttempts,
    recommendationsTotal,
    recommendationsClicked,
    recentLogins,
  ] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }).eq("role", "learner"),
    supabase.from("lesson_progress").select("*", { count: "exact", head: true }),
    supabase
      .from("lesson_progress")
      .select("*", { count: "exact", head: true })
      .eq("status", "completed"),
    supabase.from("assessment_results").select("*", { count: "exact", head: true }),
    supabase.from("activity_attempts").select("score, max_score"),
    supabase.from("recommendations").select("*", { count: "exact", head: true }),
    supabase
      .from("recommendations")
      .select("*", { count: "exact", head: true })
      .not("clicked_at", "is", null),
    supabase
      .from("events")
      .select("user_id")
      .eq("event_type", "login")
      .gte("created_at", sevenDaysAgo),
  ]);

  const scoredAttempts = (activityAttempts.data ?? []).filter(
    (a) => typeof a.score === "number" && typeof a.max_score === "number" && a.max_score > 0,
  );
  const averageActivityScore =
    scoredAttempts.length > 0
      ? scoredAttempts.reduce((sum, a) => sum + a.score / a.max_score, 0) / scoredAttempts.length
      : null;

  const activeLearners7d = new Set((recentLogins.data ?? []).map((e) => e.user_id)).size;

  const learners = totalLearners.count ?? 0;

  return {
    totalLearners: learners,
    activeLearners7d,
    lessonsStarted: lessonsStarted.count ?? 0,
    lessonsCompleted: lessonsCompleted.count ?? 0,
    placementCompletionRate: learners > 0 ? (placementCount.count ?? 0) / learners : null,
    averageActivityScore,
    recommendationClickRate:
      (recommendationsTotal.count ?? 0) > 0
        ? (recommendationsClicked.count ?? 0) / (recommendationsTotal.count ?? 1)
        : null,
  };
}

export type TopLesson = { lessonId: string; title: string; startCount: number };

export async function getTopLessons(
  supabase: SupabaseClient,
  limit = 5,
): Promise<TopLesson[]> {
  const { data } = await supabase
    .from("lesson_progress")
    .select("lesson_id, lessons(title)");

  const counts = new Map<string, { title: string; count: number }>();
  for (const row of data ?? []) {
    const lesson = row.lessons as unknown as { title: string } | null;
    if (!lesson) continue;
    const existing = counts.get(row.lesson_id);
    if (existing) {
      existing.count++;
    } else {
      counts.set(row.lesson_id, { title: lesson.title, count: 1 });
    }
  }

  return [...counts.entries()]
    .map(([lessonId, { title, count }]) => ({ lessonId, title, startCount: count }))
    .sort((a, b) => b.startCount - a.startCount)
    .slice(0, limit);
}

export type RecentEvent = {
  id: string;
  eventType: string;
  entityType: string | null;
  createdAt: string;
  userName: string | null;
};

export async function getRecentEvents(
  supabase: SupabaseClient,
  limit = 20,
): Promise<RecentEvent[]> {
  const { data } = await supabase
    .from("events")
    .select("id, event_type, entity_type, created_at, profiles(full_name)")
    .order("created_at", { ascending: false })
    .limit(limit);

  return (data ?? []).map((row) => {
    const profile = row.profiles as unknown as { full_name: string | null } | null;
    return {
      id: row.id,
      eventType: row.event_type,
      entityType: row.entity_type,
      createdAt: row.created_at,
      userName: profile?.full_name ?? null,
    };
  });
}
