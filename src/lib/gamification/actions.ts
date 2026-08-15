import type { SupabaseClient } from "@supabase/supabase-js";

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

function isoDateMinusDays(days: number): string {
  return new Date(Date.now() - days * 86400000).toISOString().slice(0, 10);
}

// Monday-based week start (UTC), matching how a "weekly" goal is normally
// understood. Shared with the dashboard so both sides agree on which week
// a given day belongs to.
export function weekStartISO(): string {
  const now = new Date();
  const day = now.getUTCDay(); // 0 = Sunday
  const diff = day === 0 ? 6 : day - 1; // days since Monday
  const monday = new Date(now);
  monday.setUTCDate(now.getUTCDate() - diff);
  return monday.toISOString().slice(0, 10);
}

// Best-effort, like logEvent — a streak/goal hiccup must never break the
// learner-facing action (completing a lesson) that triggered it.
export async function recordStudyActivity(
  supabase: SupabaseClient,
  userId: string,
  minutes: number,
) {
  try {
    const today = todayISO();

    const { data: streak } = await supabase
      .from("user_streaks")
      .select("current_streak, longest_streak, last_activity_date")
      .eq("user_id", userId)
      .maybeSingle();

    if (!streak) {
      await supabase.from("user_streaks").insert({
        user_id: userId,
        current_streak: 1,
        longest_streak: 1,
        last_activity_date: today,
      });
    } else if (streak.last_activity_date !== today) {
      const wasYesterday = streak.last_activity_date === isoDateMinusDays(1);
      const nextStreak = wasYesterday ? streak.current_streak + 1 : 1;
      await supabase
        .from("user_streaks")
        .update({
          current_streak: nextStreak,
          longest_streak: Math.max(nextStreak, streak.longest_streak),
          last_activity_date: today,
        })
        .eq("user_id", userId);
    }

    const weekStart = weekStartISO();
    const { data: goal } = await supabase
      .from("weekly_goals")
      .select("id, minutes_completed")
      .eq("user_id", userId)
      .eq("week_start", weekStart)
      .maybeSingle();

    if (!goal) {
      await supabase.from("weekly_goals").insert({
        user_id: userId,
        week_start: weekStart,
        minutes_completed: minutes,
      });
    } else {
      await supabase
        .from("weekly_goals")
        .update({ minutes_completed: goal.minutes_completed + minutes })
        .eq("id", goal.id);
    }
  } catch {
    // Swallowed intentionally — see comment above.
  }
}
