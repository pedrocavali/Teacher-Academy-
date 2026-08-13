"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { FormMessage } from "@/components/ui/form-message";
import { submitPlacementAttempt } from "@/lib/placement/actions";
import type { PlacementResponse } from "@/lib/placement/grading";

export type PlayablePlacementQuestion = {
  id: string;
  skill: string;
  type: "multiple_choice" | "fill_blank";
  prompt: string;
  context?: string;
  options?: string[];
};

export function PlacementForm({ questions }: { questions: PlayablePlacementQuestion[] }) {
  const [choiceAnswers, setChoiceAnswers] = useState<Record<string, number>>({});
  const [textAnswers, setTextAnswers] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleSubmit() {
    setError(null);
    const responses: Record<string, PlacementResponse> = {};

    for (const question of questions) {
      if (question.type === "multiple_choice") {
        const optionIndex = choiceAnswers[question.id];
        if (optionIndex !== undefined) {
          responses[question.id] = { type: "choice", optionIndex };
        }
      } else {
        const value = textAnswers[question.id];
        if (value) {
          responses[question.id] = { type: "text", value };
        }
      }
    }

    startTransition(async () => {
      const result = await submitPlacementAttempt(responses);
      if (result && "error" in result) {
        setError(result.error);
      }
      // On success submitPlacementAttempt redirects — nothing else to do here.
    });
  }

  return (
    <Card className="flex flex-col gap-8">
      {questions.map((question, index) => (
        <div key={question.id} className="flex flex-col gap-2">
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {question.skill}
          </span>
          {question.context && (
            <p className="whitespace-pre-wrap text-sm text-muted-foreground">
              {question.context}
            </p>
          )}
          <p className="text-sm font-medium">
            {index + 1}. {question.prompt}
          </p>

          {question.type === "multiple_choice" ? (
            <div className="flex flex-col gap-1">
              {(question.options ?? []).map((optionText, optionIndex) => (
                <label key={optionIndex} className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name={question.id}
                    checked={choiceAnswers[question.id] === optionIndex}
                    onChange={() =>
                      setChoiceAnswers((prev) => ({ ...prev, [question.id]: optionIndex }))
                    }
                  />
                  {optionText}
                </label>
              ))}
            </div>
          ) : (
            <Input
              type="text"
              value={textAnswers[question.id] ?? ""}
              onChange={(e) =>
                setTextAnswers((prev) => ({ ...prev, [question.id]: e.target.value }))
              }
              className="max-w-xs"
            />
          )}
        </div>
      ))}

      {error && <FormMessage variant="error">{error}</FormMessage>}

      <Button type="button" disabled={pending} onClick={handleSubmit}>
        {pending ? "Submitting..." : "Submit"}
      </Button>
    </Card>
  );
}
