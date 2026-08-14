const LEVEL_CLASSES: Record<string, string> = {
  A1: "bg-level-a1-soft text-level-a1",
  A2: "bg-level-a2-soft text-level-a2",
  B1: "bg-level-b1-soft text-level-b1",
  B2: "bg-level-b2-soft text-level-b2",
  C1: "bg-level-c1-soft text-level-c1",
  C2: "bg-level-c2-soft text-level-c2",
};

// Tailwind utility classes for a CEFR level's soft background + matching
// text color — used for badges wherever a level is shown (cards, lesson
// headers, dashboards). Falls back to the neutral muted pair for anything
// unrecognized rather than guessing a color.
export function levelBadgeClasses(level: string): string {
  return LEVEL_CLASSES[level] ?? "bg-muted text-muted-foreground";
}
