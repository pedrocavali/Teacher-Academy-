import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/card";
import { LevelBadge } from "@/components/ui/badge";
import { weekStartISO } from "@/lib/gamification/actions";
import { getMonthlyStats, getRecentActivity } from "@/lib/analytics/learner-stats";

export const metadata: Metadata = {
  title: "Desempenho — Teacher Academy",
};

const EVENT_LABELS: Record<string, string> = {
  login: "Signed in",
  lesson_started: "Started a lesson",
  lesson_completed: "Completed a lesson",
  activity_completed: "Completed an activity",
  writing_submitted: "Submitted a writing task",
  speaking_submitted: "Submitted a speaking task",
  coach_conversation_completed: "Finished an AI coach conversation",
  placement_completed: "Completed the placement test",
};

function formatEventType(eventType: string): string {
  return EVENT_LABELS[eventType] ?? eventType.replace(/_/g, " ");
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function PerformancePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const [{ data: placement }, { data: streak }, { data: weeklyGoal }, monthlyStats, recentActivity, { count: lessonsCompletedTotal }] =
    await Promise.all([
      supabase
        .from("assessment_results")
        .select("overall_level")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle(),
      supabase
        .from("user_streaks")
        .select("current_streak, longest_streak")
        .eq("user_id", user.id)
        .maybeSingle(),
      supabase
        .from("weekly_goals")
        .select("target_minutes, minutes_completed")
        .eq("user_id", user.id)
        .eq("week_start", weekStartISO())
        .maybeSingle(),
      getMonthlyStats(supabase, user.id),
      getRecentActivity(supabase, user.id),
      supabase
        .from("lesson_progress")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("status", "completed"),
    ]);

  const targetMinutes = weeklyGoal?.target_minutes ?? 60;
  const minutesCompleted = weeklyGoal?.minutes_completed ?? 0;
  const goalPercent = Math.min(100, Math.round((minutesCompleted / targetMinutes) * 100));

  const stats = [
    { label: "Minutes studied this month", value: monthlyStats.minutesStudied },
    { label: "Lessons completed this month", value: monthlyStats.lessonsCompleted },
    { label: "Activities completed this month", value: monthlyStats.activitiesCompleted },
    { label: "Lessons completed (all time)", value: lessonsCompletedTotal ?? 0 },
  ];

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-8 px-6 py-12">
      <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Your performance</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            A snapshot of your progress and recent activity.
          </p>
        </div>
        {placement && (
          <div className="flex items-center gap-2 rounded-lg bg-muted px-4 py-3">
            <span className="text-xs text-muted-foreground">Your level</span>
            <LevelBadge level={placement.overall_level} />
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Card className="flex flex-col gap-1 shadow-[var(--card-shadow)]">
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Study streak
          </span>
          <p className="text-3xl font-semibold tracking-tight">
            {streak?.current_streak ?? 0}{" "}
            <span className="text-base font-normal text-muted-foreground">days</span>
          </p>
          <p className="text-xs text-muted-foreground">
            Longest streak: {streak?.longest_streak ?? 0} days
          </p>
        </Card>

        <Card className="flex flex-col gap-2 shadow-[var(--card-shadow)]">
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            This week&apos;s goal
          </span>
          <p className="text-sm font-medium">
            {minutesCompleted} / {targetMinutes} min
          </p>
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${goalPercent}%` }}
            />
          </div>
        </Card>
      </div>

      <div className="flex flex-col gap-3">
        <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
          This month
        </h2>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.label} className="gap-1 shadow-[var(--card-shadow)]">
              <p className="text-xs text-muted-foreground">{stat.label}</p>
              <p className="text-2xl font-semibold tracking-tight">{stat.value}</p>
            </Card>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
          Recent activity
        </h2>
        {recentActivity.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Nothing yet — complete a lesson to get started.
          </p>
        ) : (
          <div className="flex flex-col divide-y divide-border rounded-lg border border-border">
            {recentActivity.map((item) => (
              <div key={item.id} className="flex items-center justify-between px-4 py-3 text-sm">
                <span>{formatEventType(item.eventType)}</span>
                <span className="text-xs text-muted-foreground">{formatDate(item.createdAt)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
