import { LessonCard } from "@/components/catalog/lesson-card";
import { PathNode, type LessonPathStatus } from "@/components/catalog/path-node";

export type PathLesson = {
  id: string;
  slug: string;
  title: string;
  objective: string;
  cefr_level: string;
  primary_skill: string;
  estimated_minutes: number;
  status: LessonPathStatus;
  otherSkills: string[];
};

export function LessonPath({ lessons }: { lessons: PathLesson[] }) {
  return (
    <div className="relative flex flex-col">
      <div
        className="absolute top-6 bottom-6 left-1/2 w-0.5 -translate-x-1/2 bg-border"
        aria-hidden
      />
      {lessons.map((lesson, index) => {
        const onRight = index % 2 === 1;
        return (
          <div
            key={lesson.id}
            className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 py-4 sm:gap-6"
          >
            <div className={onRight ? "" : "flex justify-end"}>
              {!onRight && (
                <div className="w-full max-w-sm">
                  <LessonCard lesson={lesson} otherSkills={lesson.otherSkills} />
                </div>
              )}
            </div>

            <PathNode index={index + 1} level={lesson.cefr_level} status={lesson.status} />

            <div className={onRight ? "flex justify-start" : ""}>
              {onRight && (
                <div className="w-full max-w-sm">
                  <LessonCard lesson={lesson} otherSkills={lesson.otherSkills} />
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
