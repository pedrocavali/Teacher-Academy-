"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FormMessage } from "@/components/ui/form-message";
import { useAudioRecorder } from "@/lib/speaking/use-audio-recorder";
import { uploadSpeakingRecording } from "@/lib/speaking/upload";
import { submitSpeaking } from "@/lib/speaking/actions";
import type { SpeakingFeedback } from "@/lib/ai/provider";
import { SpeakingFeedbackCard } from "@/components/speaking/speaking-feedback-card";

export function SpeakingActivity({
  activityId,
  userId,
  prompt,
}: {
  activityId: string;
  userId: string;
  prompt: string | null;
}) {
  const { status, audioBlob, error: recorderError, start, stop, reset } = useAudioRecorder();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<SpeakingFeedback | null>(null);
  const [pending, startTransition] = useTransition();

  const audioUrl = useMemo(
    () => (audioBlob ? URL.createObjectURL(audioBlob) : null),
    [audioBlob],
  );
  useEffect(() => {
    return () => {
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

  function handleSubmit() {
    if (!audioBlob) return;
    setSubmitError(null);
    startTransition(async () => {
      const uploaded = await uploadSpeakingRecording(userId, activityId, audioBlob);
      if ("error" in uploaded) {
        setSubmitError(uploaded.error);
        return;
      }
      const result = await submitSpeaking(activityId, uploaded.path);
      if ("error" in result) {
        setSubmitError(result.error);
        return;
      }
      setFeedback(result.feedback);
    });
  }

  function handleTryAgain() {
    setFeedback(null);
    setSubmitError(null);
    reset();
  }

  return (
    <Card className="flex flex-col gap-4">
      <div>
        <span className="text-xs font-medium uppercase tracking-wide text-primary">
          Speaking
        </span>
        {prompt && <p className="mt-1 text-sm font-medium">{prompt}</p>}
      </div>

      {feedback ? (
        <>
          <SpeakingFeedbackCard feedback={feedback} />
          <Button type="button" variant="secondary" onClick={handleTryAgain}>
            Try again
          </Button>
        </>
      ) : (
        <>
          {status === "idle" && (
            <Button type="button" onClick={start}>
              Record
            </Button>
          )}

          {status === "recording" && (
            <div className="flex items-center gap-3">
              <span className="h-2 w-2 animate-pulse rounded-full bg-destructive" />
              <span className="text-sm text-muted-foreground">Recording...</span>
              <Button type="button" variant="secondary" size="sm" onClick={stop}>
                Stop
              </Button>
            </div>
          )}

          {status === "recorded" && audioUrl && (
            <div className="flex flex-col gap-3">
              <audio controls src={audioUrl} className="w-full" />
              <div className="flex gap-2">
                <Button type="button" disabled={pending} onClick={handleSubmit}>
                  {pending ? "Getting feedback..." : "Submit"}
                </Button>
                <Button type="button" variant="secondary" disabled={pending} onClick={reset}>
                  Record again
                </Button>
              </div>
            </div>
          )}

          {(recorderError || submitError) && (
            <FormMessage variant="error">{recorderError ?? submitError}</FormMessage>
          )}
        </>
      )}
    </Card>
  );
}
