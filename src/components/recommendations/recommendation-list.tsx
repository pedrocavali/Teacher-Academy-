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
    <div className="flex w-full max-w-sm flex-col gap-3">
      <h2 className="text-sm font-medium text-muted-foreground">
        Recommended for you
      </h2>
      {recommendations.map((rec) => (
        <Link
          key={rec.recommendationId}
          href={rec.href}
          onClick={() => {
            markRecommendationClicked(rec.recommendationId);
          }}
        >
          <Card className="gap-1 transition hover:border-primary">
            <p className="text-sm font-medium">{rec.title}</p>
            <p className="text-xs text-muted-foreground">{rec.reasonText}</p>
          </Card>
        </Link>
      ))}
    </div>
  );
}
