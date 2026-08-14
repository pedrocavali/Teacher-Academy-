import Link from "next/link";
import { Card } from "@/components/ui/card";
import { LevelBadge } from "@/components/ui/badge";

export function LessonCard({
  lesson,
}: {
  lesson: {
    slug: string;
    title: string;
    objective: string;
    cefr_level: string;
    primary_skill: string;
    estimated_minutes: number;
  };
}) {
  return (
    <Link href={`/lesson/${lesson.slug}`}>
      <Card className="flex h-full flex-col gap-2 shadow-[var(--card-shadow)] transition-transform hover:-translate-y-0.5 hover:border-primary">
        <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
          <LevelBadge level={lesson.cefr_level} />
          <span className="capitalize">{lesson.primary_skill}</span>
          <span>·</span>
          <span>{lesson.estimated_minutes} min</span>
        </div>
        <h4 className="font-semibold tracking-tight">{lesson.title}</h4>
        <p className="text-sm text-muted-foreground">{lesson.objective}</p>
      </Card>
    </Link>
  );
}
