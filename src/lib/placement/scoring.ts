import type { CEFR_LEVELS } from "@/lib/curriculum/constants";

export type CefrLevel = (typeof CEFR_LEVELS)[number];

// Rule-based, transparent, deliberately simple scoring (Blueprint Section
// 10/54: no ML, no black box). Harder questions answered correctly count
// for more, so a learner who gets B2 items right scores higher than one who
// only gets A1 items right, even at the same raw correct-count.
const LEVEL_WEIGHT: Record<CefrLevel, number> = {
  A1: 1,
  A2: 2,
  B1: 3,
  B2: 4,
  C1: 5,
  C2: 6,
};

// Cutoffs are on the 0-1 ratio of (weighted correct) / (weighted possible).
// Tune these here if placement runs too easy/hard in practice — nothing
// else needs to change.
const LEVEL_CUTOFFS: { level: CefrLevel; min: number }[] = [
  { level: "C2", min: 0.85 },
  { level: "C1", min: 0.7 },
  { level: "B2", min: 0.55 },
  { level: "B1", min: 0.4 },
  { level: "A2", min: 0.2 },
  { level: "A1", min: 0 },
];

export function levelFromRatio(ratio: number): CefrLevel {
  const match = LEVEL_CUTOFFS.find((c) => ratio >= c.min);
  return match?.level ?? "A1";
}

export function scoreSkill(
  questions: { targetLevel: CefrLevel; correct: boolean }[],
): { level: CefrLevel; ratio: number } {
  if (questions.length === 0) {
    return { level: "A1", ratio: 0 };
  }

  const max = questions.reduce((sum, q) => sum + LEVEL_WEIGHT[q.targetLevel], 0);
  const achieved = questions.reduce(
    (sum, q) => sum + (q.correct ? LEVEL_WEIGHT[q.targetLevel] : 0),
    0,
  );
  const ratio = max === 0 ? 0 : achieved / max;

  return { level: levelFromRatio(ratio), ratio };
}

// Overall = average of whichever skill levels are available. Writing and
// speaking placement don't exist yet (they need the AI layer from Phases
// 11-12), so this only ever sees reading/listening/grammar/vocabulary for
// now; it isn't hardcoded to 4, so it keeps working once those are added.
export function overallLevel(skillLevels: CefrLevel[]): CefrLevel {
  if (skillLevels.length === 0) return "A1";
  const avgWeight =
    skillLevels.reduce((sum, level) => sum + LEVEL_WEIGHT[level], 0) / skillLevels.length;
  const rounded = Math.round(avgWeight) as 1 | 2 | 3 | 4 | 5 | 6;
  const entry = Object.entries(LEVEL_WEIGHT).find(([, w]) => w === rounded);
  return (entry?.[0] as CefrLevel) ?? "A1";
}
