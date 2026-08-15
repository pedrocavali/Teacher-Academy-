"use client";

import Image from "next/image";
import Link from "next/link";
import { LevelBadge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { unitCoverSrc } from "@/lib/curriculum/unit-cover";
import { markRecommendationClicked } from "@/lib/recommendations/actions";
import type { Recommendation } from "@/lib/recommendations/engine";

const CTA_BY_REASON: Record<string, string> = {
  continue_lesson: "Continue",
  next_in_unit: "Continue",
};

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
          className="group flex h-full flex-col overflow-hidden rounded-lg border border-border bg-background shadow-[var(--card-shadow)] transition-transform hover:-translate-y-0.5 hover:border-primary"
        >
          <div className="relative h-24 w-full bg-muted">
            <Image
              src={unitCoverSrc(rec.unitSlug ?? "")}
              alt=""
              fill
              className="object-cover"
            />
          </div>
          <div className="flex flex-1 flex-col gap-2 p-4">
            <LevelBadge level={rec.cefrLevel} />
            <p className="text-sm font-medium">{rec.title}</p>
            <p className="text-xs text-muted-foreground">{rec.reasonText}</p>
            <span
              className={buttonVariants({ size: "sm", className: "mt-auto w-fit" })}
            >
              {CTA_BY_REASON[rec.reasonCode] ?? "Start"}
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
