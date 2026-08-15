import Link from "next/link";
import { Card } from "@/components/ui/card";
import { LevelBadge, Badge } from "@/components/ui/badge";

export function LessonCard({
  lesson,
  otherSkills = [],
}: {
  lesson: {
    slug: string;
    title: string;
    objective: string;
    cefr_level: string;
    primary_skill: string;
    estimated_minutes: number;
  };
  otherSkills?: string[];
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
        {otherSkills.length > 0 && (
          <div className="mt-1 flex flex-wrap gap-1.5">
            {otherSkills.map((skill) => (
              <Badge key={skill} className="bg-muted capitalize text-muted-foreground">
                {skill}
              </Badge>
            ))}
          </div>
        )}
      </Card>
    </Link>
  );
}
