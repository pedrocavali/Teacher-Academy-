import { Card } from "@/components/ui/card";

// Not a link yet: lesson playback is Phase 8. This shows what's in the
// unit without pointing at a route that doesn't exist.
export function LessonCard({
  lesson,
}: {
  lesson: {
    title: string;
    objective: string;
    cefr_level: string;
    primary_skill: string;
    estimated_minutes: number;
  };
}) {
  return (
    <Card className="flex flex-col gap-2">
      <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
        <span className="rounded-full bg-muted px-2 py-0.5">{lesson.cefr_level}</span>
        <span className="capitalize">{lesson.primary_skill}</span>
        <span>·</span>
        <span>{lesson.estimated_minutes} min</span>
      </div>
      <h4 className="font-semibold tracking-tight">{lesson.title}</h4>
      <p className="text-sm text-muted-foreground">{lesson.objective}</p>
    </Card>
  );
}
