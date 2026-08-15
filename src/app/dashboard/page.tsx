import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/lib/auth/actions";
import { SubmitButton } from "@/components/auth/submit-button";
import { Card } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { LevelBadge } from "@/components/ui/badge";
import { getRecommendations } from "@/lib/recommendations/engine";
import { RecommendationList } from "@/components/recommendations/recommendation-list";
import { weekStartISO } from "@/lib/gamification/actions";

export const metadata: Metadata = {
  title: "Dashboard — Teacher Academy",
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Belt and suspenders: the proxy already redirects unauthenticated
  // requests away from /dashboard (src/lib/supabase/middleware.ts).
  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, role")
    .eq("id", user.id)
    .single();

  const { data: placement } = await supabase
    .from("assessment_results")
    .select("overall_level")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const recommendations = await getRecommendations(supabase, user.id);

  const [{ data: streak }, { data: weeklyGoal }] = await Promise.all([
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
  ]);

  const currentStreak = streak?.current_streak ?? 0;
  const targetMinutes = weeklyGoal?.target_minutes ?? 60;
  const minutesCompleted = weeklyGoal?.minutes_completed ?? 0;
  const goalPercent = Math.min(100, Math.round((minutesCompleted / targetMinutes) * 100));

  const displayName = profile?.full_name || user.email?.split("@")[0] || "there";
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-8 px-6 py-12">
      <Card className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary text-xl font-semibold text-primary-foreground">
            {initial}
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              Welcome, {displayName}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">{user.email}</p>
          </div>
        </div>

        {placement ? (
          <div className="flex items-center gap-2 rounded-lg bg-muted px-4 py-3">
            <span className="text-xs text-muted-foreground">Your level</span>
            <LevelBadge level={placement.overall_level} />
          </div>
        ) : (
          <Link href="/placement" className={buttonVariants({ size: "md" })}>
            Take placement
          </Link>
        )}
      </Card>

      <div className="flex flex-col gap-3">
        <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
          Your progress
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Card className="flex flex-col gap-1 shadow-[var(--card-shadow)]">
            <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Study streak
            </span>
            <p className="text-3xl font-semibold tracking-tight">
              {currentStreak}{" "}
              <span className="text-base font-normal text-muted-foreground">
                day{currentStreak === 1 ? "" : "s"}
              </span>
            </p>
            {streak?.longest_streak ? (
              <p className="text-xs text-muted-foreground">
                Longest streak: {streak.longest_streak} days
              </p>
            ) : (
              <p className="text-xs text-muted-foreground">
                Complete a lesson today to start your streak.
              </p>
            )}
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
      </div>

      <div className="flex flex-col gap-3">
        <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
          Quick actions
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Link href="/explore" className="group">
            <Card className="flex h-full flex-col gap-1 shadow-[var(--card-shadow)] transition-transform group-hover:-translate-y-0.5 group-hover:border-primary">
              <span className="text-sm font-medium uppercase tracking-wide text-primary">
                Explore
              </span>
              <p className="text-sm text-muted-foreground">
                Browse the full catalog — grammar, vocabulary, reading, writing, and speaking, from A1 to C2.
              </p>
            </Card>
          </Link>
          {!placement && (
            <Link href="/placement" className="group">
              <Card className="flex h-full flex-col gap-1 shadow-[var(--card-shadow)] transition-transform group-hover:-translate-y-0.5 group-hover:border-primary">
                <span className="text-sm font-medium uppercase tracking-wide text-primary">
                  Placement
                </span>
                <p className="text-sm text-muted-foreground">
                  Take the diagnostic to get a starting estimate of your level.
                </p>
              </Card>
            </Link>
          )}
        </div>
      </div>

      {recommendations.length > 0 && (
        <div className="flex flex-col gap-3">
          <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
            Recommended for you
          </h2>
          <RecommendationList recommendations={recommendations} />
        </div>
      )}

      <form action={signOut} className="self-start">
        <SubmitButton pendingLabel="Signing out...">Sign out</SubmitButton>
      </form>
    </div>
  );
}
