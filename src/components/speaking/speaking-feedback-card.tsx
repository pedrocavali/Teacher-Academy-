import { Card } from "@/components/ui/card";
import type { SkillRating, SpeakingFeedback } from "@/lib/ai/provider";

const RATING_STYLES: Record<SkillRating, string> = {
  low: "bg-destructive/10 text-destructive",
  medium: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
  high: "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
};

const RATING_DIMENSIONS: { key: keyof SpeakingFeedback & string; label: string }[] = [
  { key: "intelligibility", label: "Intelligibility" },
  { key: "fluency", label: "Fluency" },
  { key: "vocabulary", label: "Vocabulary" },
  { key: "grammar", label: "Grammar" },
];

// Same "what you did well / what to improve, never just wrong" framing as
// writing's FeedbackCard (Blueprint Section 21), plus the transcript so the
// learner can see exactly what the AI understood, and the four rating
// dimensions from Blueprint Section 20.
export function SpeakingFeedbackCard({ feedback }: { feedback: SpeakingFeedback }) {
  return (
    <Card className="flex flex-col gap-4 border-primary/30">
      <span className="text-xs font-medium uppercase tracking-wide text-primary">
        AI feedback
      </span>

      <div className="flex flex-wrap gap-2">
        {RATING_DIMENSIONS.map(({ key, label }) => (
          <span
            key={key}
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${RATING_STYLES[feedback[key] as SkillRating]}`}
          >
            {label}: {feedback[key] as string}
          </span>
        ))}
      </div>

      {feedback.transcript ? (
        <div className="flex flex-col gap-1">
          <span className="text-xs font-semibold text-muted-foreground">What you said</span>
          <p className="rounded-md border border-border bg-muted/30 p-3 text-sm italic">
            &ldquo;{feedback.transcript}&rdquo;
          </p>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">
          No speech was detected in the recording.
        </p>
      )}

      <p className="text-sm">{feedback.overallComment}</p>

      {feedback.strengths.length > 0 && (
        <div className="flex flex-col gap-1">
          <span className="text-xs font-semibold text-success">What you did well</span>
          <ul className="list-inside list-disc text-sm text-muted-foreground">
            {feedback.strengths.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </div>
      )}

      {feedback.improvements.length > 0 && (
        <div className="flex flex-col gap-1">
          <span className="text-xs font-semibold">What to improve</span>
          <ul className="list-inside list-disc text-sm text-muted-foreground">
            {feedback.improvements.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  );
}
