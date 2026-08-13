"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { FormMessage } from "@/components/ui/form-message";
import {
  submitActivityAttempt,
  type SubmittedResponse,
  type QuestionResult,
} from "@/lib/activity/submit-attempt";

export type PlayableOption = { id: string; text: string };

export type PlayableQuestion = {
  id: string;
  prompt: string;
  type: "multiple_choice" | "true_false" | "fill_blank" | "ordering";
  options: PlayableOption[];
};

export type PlayableActivity = {
  id: string;
  type: string;
  skill: string;
  instructions: string | null;
  questions: PlayableQuestion[];
};

function initialOrder(question: PlayableQuestion): string[] {
  // A fixed shuffle (reverse) rather than random, so the order doesn't
  // reshuffle on every re-render — good enough for MVP without adding a
  // seeded-random dependency.
  return [...question.options].reverse().map((o) => o.id);
}

export function ActivityPlayer({ activity }: { activity: PlayableActivity }) {
  const [choiceAnswers, setChoiceAnswers] = useState<Record<string, string>>({});
  const [textAnswers, setTextAnswers] = useState<Record<string, string>>({});
  const [orderAnswers, setOrderAnswers] = useState<Record<string, string[]>>(() =>
    Object.fromEntries(
      activity.questions
        .filter((q) => q.type === "ordering")
        .map((q) => [q.id, initialOrder(q)]),
    ),
  );
  const [results, setResults] = useState<Record<string, QuestionResult> | null>(null);
  const [score, setScore] = useState<{ score: number; maxScore: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function moveOption(questionId: string, index: number, direction: -1 | 1) {
    setOrderAnswers((prev) => {
      const current = [...(prev[questionId] ?? [])];
      const target = index + direction;
      if (target < 0 || target >= current.length) return prev;
      [current[index], current[target]] = [current[target], current[index]];
      return { ...prev, [questionId]: current };
    });
  }

  function handleSubmit() {
    setError(null);
    const responses: Record<string, SubmittedResponse> = {};

    for (const question of activity.questions) {
      if (question.type === "multiple_choice" || question.type === "true_false") {
        const optionId = choiceAnswers[question.id];
        if (optionId) responses[question.id] = { type: "choice", optionId };
      } else if (question.type === "fill_blank") {
        const value = textAnswers[question.id];
        if (value) responses[question.id] = { type: "text", value };
      } else if (question.type === "ordering") {
        const optionIds = orderAnswers[question.id];
        if (optionIds) responses[question.id] = { type: "order", optionIds };
      }
    }

    startTransition(async () => {
      const result = await submitActivityAttempt(activity.id, responses);
      if ("error" in result) {
        setError(result.error);
        return;
      }
      setScore({ score: result.score, maxScore: result.maxScore });
      setResults(Object.fromEntries(result.results.map((r) => [r.questionId, r])));
    });
  }

  return (
    <Card className="flex flex-col gap-6">
      <div>
        <span className="text-xs font-medium uppercase tracking-wide text-primary">
          {activity.type.replace("_", " ")}
        </span>
        {activity.instructions && (
          <p className="mt-1 text-sm text-muted-foreground">{activity.instructions}</p>
        )}
      </div>

      <div className="flex flex-col gap-6">
        {activity.questions.map((question, qIndex) => {
          const result = results?.[question.id];

          return (
            <div key={question.id} className="flex flex-col gap-2">
              <p className="text-sm font-medium">
                {qIndex + 1}. {question.prompt}
              </p>

              {(question.type === "multiple_choice" || question.type === "true_false") && (
                <div className="flex flex-col gap-1">
                  {question.options.map((option) => (
                    <label key={option.id} className="flex items-center gap-2 text-sm">
                      <input
                        type="radio"
                        name={question.id}
                        value={option.id}
                        disabled={!!results}
                        checked={choiceAnswers[question.id] === option.id}
                        onChange={() =>
                          setChoiceAnswers((prev) => ({ ...prev, [question.id]: option.id }))
                        }
                      />
                      <span
                        className={
                          result && result.correctOptionIds?.includes(option.id)
                            ? "font-medium text-success"
                            : result && choiceAnswers[question.id] === option.id
                              ? "text-destructive"
                              : undefined
                        }
                      >
                        {option.text}
                      </span>
                    </label>
                  ))}
                </div>
              )}

              {question.type === "fill_blank" && (
                <div className="flex flex-col gap-1">
                  <Input
                    type="text"
                    disabled={!!results}
                    value={textAnswers[question.id] ?? ""}
                    onChange={(e) =>
                      setTextAnswers((prev) => ({ ...prev, [question.id]: e.target.value }))
                    }
                    className="max-w-xs"
                  />
                  {result && !result.correct && (
                    <span className="text-xs text-muted-foreground">
                      Correct answer: {result.correctText}
                    </span>
                  )}
                </div>
              )}

              {question.type === "ordering" && (
                <div className="flex flex-col gap-1">
                  {(orderAnswers[question.id] ?? []).map((optionId, index) => {
                    const option = question.options.find((o) => o.id === optionId);
                    return (
                      <div
                        key={optionId}
                        className="flex items-center justify-between rounded-md border border-border px-3 py-1.5 text-sm"
                      >
                        <span>{option?.text}</span>
                        {!results && (
                          <div className="flex gap-1">
                            <button
                              type="button"
                              className="text-muted-foreground hover:text-foreground disabled:opacity-30"
                              disabled={index === 0}
                              onClick={() => moveOption(question.id, index, -1)}
                              aria-label="Move up"
                            >
                              ↑
                            </button>
                            <button
                              type="button"
                              className="text-muted-foreground hover:text-foreground disabled:opacity-30"
                              disabled={index === (orderAnswers[question.id]?.length ?? 0) - 1}
                              onClick={() => moveOption(question.id, index, 1)}
                              aria-label="Move down"
                            >
                              ↓
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {result && (
                <span className={result.correct ? "text-xs text-success" : "text-xs text-destructive"}>
                  {result.correct ? "Correct" : "Incorrect"}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {error && <FormMessage variant="error">{error}</FormMessage>}

      {score ? (
        <p className="text-sm font-medium">
          Score: {score.score} / {score.maxScore}
        </p>
      ) : (
        <Button type="button" disabled={pending} onClick={handleSubmit}>
          {pending ? "Checking..." : "Check answers"}
        </Button>
      )}
    </Card>
  );
}
