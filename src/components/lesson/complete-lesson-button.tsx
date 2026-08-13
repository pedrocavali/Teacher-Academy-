"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { completeLesson } from "@/lib/lesson/actions";

export function CompleteLessonButton({
  lessonId,
  completed,
}: {
  lessonId: string;
  completed: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  if (completed) {
    return (
      <span className="text-sm font-medium text-success">
        ✓ Completed
      </span>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        type="button"
        disabled={pending}
        onClick={() => {
          setError(null);
          startTransition(async () => {
            const result = await completeLesson(lessonId);
            if ("error" in result) {
              setError(result.error);
            } else {
              router.refresh();
            }
          });
        }}
      >
        {pending ? "Saving..." : "Mark as complete"}
      </Button>
      {error && <span className="text-sm text-destructive">{error}</span>}
    </div>
  );
}
