import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/card";
import {
  getAnalyticsSummary,
  getTopLessons,
  getRecentEvents,
} from "@/lib/analytics/queries";

export const metadata: Metadata = {
  title: "Analytics — Teacher Academy Admin",
};

function formatPercent(value: number | null) {
  return value === null ? "—" : `${Math.round(value * 100)}%`;
}

export default async function AdminAnalyticsPage() {
  const supabase = await createClient();
  const [summary, topLessons, recentEvents] = await Promise.all([
    getAnalyticsSummary(supabase),
    getTopLessons(supabase),
    getRecentEvents(supabase),
  ]);

  const stats = [
    { label: "Total learners", value: summary.totalLearners },
    { label: "Active in last 7 days", value: summary.activeLearners7d },
    { label: "Lessons started", value: summary.lessonsStarted },
    { label: "Lessons completed", value: summary.lessonsCompleted },
    { label: "Placement completion", value: formatPercent(summary.placementCompletionRate) },
    { label: "Average activity score", value: formatPercent(summary.averageActivityScore) },
    { label: "Recommendation click-through", value: formatPercent(summary.recommendationClickRate) },
  ];

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-2xl font-semibold tracking-tight">Analytics</h1>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="gap-1">
            <p className="text-xs text-muted-foreground">{stat.label}</p>
            <p className="text-2xl font-semibold tracking-tight">{stat.value}</p>
          </Card>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="flex flex-col gap-3">
          <h2 className="text-lg font-semibold tracking-tight">Most-started lessons</h2>
          {topLessons.length === 0 ? (
            <p className="text-sm text-muted-foreground">No lesson activity yet.</p>
          ) : (
            <div className="flex flex-col divide-y divide-border rounded-lg border border-border">
              {topLessons.map((lesson) => (
                <div
                  key={lesson.lessonId}
                  className="flex items-center justify-between px-4 py-3 text-sm"
                >
                  <span className="truncate">{lesson.title}</span>
                  <span className="text-muted-foreground">{lesson.startCount}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3">
          <h2 className="text-lg font-semibold tracking-tight">Recent activity</h2>
          {recentEvents.length === 0 ? (
            <p className="text-sm text-muted-foreground">No events logged yet.</p>
          ) : (
            <div className="flex flex-col divide-y divide-border rounded-lg border border-border">
              {recentEvents.map((event) => (
                <div key={event.id} className="flex items-center justify-between px-4 py-3 text-sm">
                  <div className="flex flex-col">
                    <span className="capitalize">{event.eventType.replace(/_/g, " ")}</span>
                    <span className="text-xs text-muted-foreground">
                      {event.userName ?? "Unknown learner"}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {new Date(event.createdAt).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
