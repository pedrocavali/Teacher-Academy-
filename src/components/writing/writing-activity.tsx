"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FormMessage } from "@/components/ui/form-message";
import { submitWriting } from "@/lib/writing/actions";
import type { WritingFeedback } from "@/lib/ai/provider";
import { FeedbackCard } from "@/components/writing/feedback-card";

export function WritingActivity({
  activityId,
  prompt,
}: {
  activityId: string;
  prompt: string | null;
}) {
  const [text, setText] = useState("");
  const [feedback, setFeedback] = useState<WritingFeedback | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleSubmit() {
    setError(null);
    startTransition(async () => {
      const result = await submitWriting(activityId, text);
      if ("error" in result) {
        setError(result.error);
        return;
      }
      setFeedback(result.feedback);
    });
  }

  function handleTryAgain() {
    setFeedback(null);
    setText("");
  }

  return (
    <Card className="flex flex-col gap-4">
      <div>
        <span className="text-xs font-medium uppercase tracking-wide text-primary">
          Writing
        </span>
        {prompt && <p className="mt-1 text-sm font-medium">{prompt}</p>}
      </div>

      {feedback ? (
        <>
          <p className="whitespace-pre-wrap rounded-md border border-border bg-muted/30 p-3 text-sm">
            {text}
          </p>
          <FeedbackCard feedback={feedback} />
          <Button type="button" variant="secondary" onClick={handleTryAgain}>
            Try again
          </Button>
        </>
      ) : (
        <>
          <textarea
            rows={6}
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Write your response here..."
          />
          {error && <FormMessage variant="error">{error}</FormMessage>}
          <Button type="button" disabled={pending} onClick={handleSubmit}>
            {pending ? "Getting feedback..." : "Submit"}
          </Button>
        </>
      )}
    </Card>
  );
}
