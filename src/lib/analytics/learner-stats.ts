import type { SupabaseClient } from "@supabase/supabase-js";

// Learner-facing "this month" snapshot (Desempenho page) — own rows only,
// unlike src/lib/analytics/queries.ts which is admin-only aggregation
// across all learners.

function monthStartISO(): string {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1)).toISOString();
}

export type MonthlyStats = {
  minutesStudied: number;
  lessonsCompleted: number;
  activitiesCompleted: number;
};

export async function getMonthlyStats(
  supabase: SupabaseClient,
  userId: string,
): Promise<MonthlyStats> {
  const monthStart = monthStartISO();

  const [{ data: completedLessons }, { count: activitiesCompleted }] = await Promise.all([
    supabase
      .from("lesson_progress")
      .select("lessons(estimated_minutes)")
      .eq("user_id", userId)
      .eq("status", "completed")
      .gte("completed_at", monthStart),
    supabase
      .from("activity_attempts")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .not("completed_at", "is", null)
      .gte("completed_at", monthStart),
  ]);

  const minutesStudied = (completedLessons ?? []).reduce((sum, row) => {
    const lesson = row.lessons as unknown as { estimated_minutes: number | null } | null;
    return sum + (lesson?.estimated_minutes ?? 0);
  }, 0);

  return {
    minutesStudied,
    lessonsCompleted: completedLessons?.length ?? 0,
    activitiesCompleted: activitiesCompleted ?? 0,
  };
}

export type RecentActivityItem = {
  id: string;
  eventType: string;
  createdAt: string;
};

export async function getRecentActivity(
  supabase: SupabaseClient,
  userId: string,
  limit = 8,
): Promise<RecentActivityItem[]> {
  const { data } = await supabase
    .from("events")
    .select("id, event_type, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);

  return (data ?? []).map((row) => ({
    id: row.id,
    eventType: row.event_type,
    createdAt: row.created_at,
  }));
}
