"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { markRecommendationClicked } from "@/lib/recommendations/actions";
import type { Recommendation } from "@/lib/recommendations/engine";

export function RecommendationList({
  recommendations,
}: {
  recommendations: Recommendation[];
}) {
  if (recommendations.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {recommendations.map((rec) => (
        <Link
          key={rec.recommendationId}
          href={rec.href}
          onClick={() => {
            markRecommendationClicked(rec.recommendationId);
          }}
        >
          <Card className="flex h-full flex-col gap-1 shadow-[var(--card-shadow)] transition-transform hover:-translate-y-0.5 hover:border-primary">
            <p className="text-sm font-medium">{rec.title}</p>
            <p className="text-xs text-muted-foreground">{rec.reasonText}</p>
          </Card>
        </Link>
      ))}
    </div>
  );
}
