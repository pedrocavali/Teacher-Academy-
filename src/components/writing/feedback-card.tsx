import { Card } from "@/components/ui/card";
import type { WritingFeedback } from "@/lib/ai/provider";

const TASK_COMPLETION_LABEL: Record<WritingFeedback["taskCompletion"], string> = {
  met: "Task completed",
  partially_met: "Partially completed the task",
  not_met: "Didn't fully address the task",
};

// Blueprint Section 21: feedback is always "what you did well / what to
// improve / try again" — never just "wrong".
export function FeedbackCard({ feedback }: { feedback: WritingFeedback }) {
  return (
    <Card className="flex flex-col gap-4 border-primary/30">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wide text-primary">
          AI feedback
        </span>
        <span className="text-xs text-muted-foreground">
          {TASK_COMPLETION_LABEL[feedback.taskCompletion]}
        </span>
      </div>

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
