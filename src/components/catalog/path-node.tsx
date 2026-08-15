const LEVEL_SOLID: Record<string, string> = {
  A1: "bg-level-a1 border-level-a1",
  A2: "bg-level-a2 border-level-a2",
  B1: "bg-level-b1 border-level-b1",
  B2: "bg-level-b2 border-level-b2",
  C1: "bg-level-c1 border-level-c1",
  C2: "bg-level-c2 border-level-c2",
};

const LEVEL_OUTLINE: Record<string, string> = {
  A1: "text-level-a1 border-level-a1",
  A2: "text-level-a2 border-level-a2",
  B1: "text-level-b1 border-level-b1",
  B2: "text-level-b2 border-level-b2",
  C1: "text-level-c1 border-level-c1",
  C2: "text-level-c2 border-level-c2",
};

export type LessonPathStatus = "not_started" | "in_progress" | "completed";

export function PathNode({
  index,
  level,
  status,
}: {
  index: number;
  level: string;
  status: LessonPathStatus;
}) {
  if (status === "completed") {
    return (
      <div
        className={`z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 text-white shadow-[var(--card-shadow)] ${LEVEL_SOLID[level] ?? "bg-primary border-primary"}`}
        aria-label="Completed"
      >
        <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
          <path
            d="M5 12.5l4.5 4.5L19 7"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    );
  }

  if (status === "in_progress") {
    return (
      <div
        className={`z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 bg-background text-sm font-semibold shadow-[var(--card-shadow)] ${LEVEL_OUTLINE[level] ?? "text-primary border-primary"}`}
      >
        {index}
      </div>
    );
  }

  return (
    <div className="z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-border bg-background text-sm font-semibold text-muted-foreground">
      {index}
    </div>
  );
}
