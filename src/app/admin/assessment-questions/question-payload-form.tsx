"use client";

import { useActionState, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { FormMessage } from "@/components/ui/form-message";
import { SubmitButton } from "@/components/auth/submit-button";
import { CEFR_LEVELS, SKILLS } from "@/lib/curriculum/constants";
import type { AssessmentQuestionPayload } from "@/lib/placement/payload";

type FormState = { error: string } | null;
type FormAction = (
  prevState: FormState,
  formData: FormData,
) => Promise<FormState>;

export function QuestionPayloadForm({
  action,
  hiddenFields,
  defaultValues,
  submitLabel,
}: {
  action: FormAction;
  hiddenFields?: Record<string, string>;
  defaultValues?: {
    skill: string;
    targetCefrLevel: string;
    orderIndex: number;
    payload: AssessmentQuestionPayload;
  };
  submitLabel: string;
}) {
  const [state, formAction] = useActionState<FormState, FormData>(action, null);

  const [type, setType] = useState<AssessmentQuestionPayload["type"]>(
    defaultValues?.payload.type ?? "multiple_choice",
  );
  const [prompt, setPrompt] = useState(defaultValues?.payload.prompt ?? "");
  const [context, setContext] = useState(defaultValues?.payload.context ?? "");
  const [options, setOptions] = useState<{ text: string; isCorrect: boolean }[]>(
    defaultValues?.payload.type === "multiple_choice"
      ? defaultValues.payload.options
      : [
          { text: "", isCorrect: true },
          { text: "", isCorrect: false },
        ],
  );
  const [acceptedAnswers, setAcceptedAnswers] = useState<string[]>(
    defaultValues?.payload.type === "fill_blank"
      ? defaultValues.payload.acceptedAnswers
      : [""],
  );

  const payload: AssessmentQuestionPayload =
    type === "multiple_choice"
      ? {
          type,
          prompt,
          context: context || undefined,
          options: options.filter((o) => o.text.trim()),
        }
      : {
          type,
          prompt,
          context: context || undefined,
          acceptedAnswers: acceptedAnswers.filter((a) => a.trim()),
        };

  return (
    <form action={formAction} className="flex w-full max-w-lg flex-col gap-4">
      {hiddenFields &&
        Object.entries(hiddenFields).map(([name, value]) => (
          <input key={name} type="hidden" name={name} value={value} />
        ))}
      <input type="hidden" name="payload" value={JSON.stringify(payload)} />

      <div className="flex gap-4">
        <div className="flex flex-1 flex-col gap-1">
          <Label htmlFor="skill">Skill</Label>
          <select
            id="skill"
            name="skill"
            required
            defaultValue={defaultValues?.skill ?? "grammar"}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm capitalize focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {SKILLS.map((skill) => (
              <option key={skill} value={skill} className="capitalize">
                {skill}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-1 flex-col gap-1">
          <Label htmlFor="targetCefrLevel">Target level</Label>
          <select
            id="targetCefrLevel"
            name="targetCefrLevel"
            required
            defaultValue={defaultValues?.targetCefrLevel ?? "A1"}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {CEFR_LEVELS.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-1 flex-col gap-1">
          <Label htmlFor="orderIndex">Order</Label>
          <Input
            id="orderIndex"
            name="orderIndex"
            type="number"
            defaultValue={defaultValues?.orderIndex ?? 0}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <Label htmlFor="type">Question type</Label>
        <select
          id="type"
          value={type}
          onChange={(e) => setType(e.target.value as AssessmentQuestionPayload["type"])}
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm capitalize focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="multiple_choice">Multiple choice</option>
          <option value="fill_blank">Fill in the blank</option>
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <Label htmlFor="context">Context (optional passage or transcript)</Label>
        <textarea
          id="context"
          rows={2}
          value={context}
          onChange={(e) => setContext(e.target.value)}
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <div className="flex flex-col gap-1">
        <Label htmlFor="prompt">Prompt</Label>
        <textarea
          id="prompt"
          rows={2}
          required
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {type === "multiple_choice" ? (
        <div className="flex flex-col gap-2">
          <Label>Options</Label>
          {options.map((option, index) => (
            <div key={index} className="flex items-center gap-2">
              <Input
                type="text"
                value={option.text}
                onChange={(e) =>
                  setOptions((prev) =>
                    prev.map((o, i) => (i === index ? { ...o, text: e.target.value } : o)),
                  )
                }
                placeholder={`Option ${index + 1}`}
              />
              <label className="flex items-center gap-1 text-xs whitespace-nowrap">
                <input
                  type="checkbox"
                  checked={option.isCorrect}
                  onChange={(e) =>
                    setOptions((prev) =>
                      prev.map((o, i) =>
                        i === index ? { ...o, isCorrect: e.target.checked } : o,
                      ),
                    )
                  }
                />
                Correct
              </label>
              <button
                type="button"
                className="text-destructive hover:underline"
                onClick={() => setOptions((prev) => prev.filter((_, i) => i !== index))}
              >
                Remove
              </button>
            </div>
          ))}
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => setOptions((prev) => [...prev, { text: "", isCorrect: false }])}
          >
            Add option
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <Label>Accepted answers</Label>
          {acceptedAnswers.map((answer, index) => (
            <div key={index} className="flex items-center gap-2">
              <Input
                type="text"
                value={answer}
                onChange={(e) =>
                  setAcceptedAnswers((prev) =>
                    prev.map((a, i) => (i === index ? e.target.value : a)),
                  )
                }
                placeholder={`Accepted answer ${index + 1}`}
              />
              <button
                type="button"
                className="text-destructive hover:underline"
                onClick={() =>
                  setAcceptedAnswers((prev) => prev.filter((_, i) => i !== index))
                }
              >
                Remove
              </button>
            </div>
          ))}
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => setAcceptedAnswers((prev) => [...prev, ""])}
          >
            Add accepted answer
          </Button>
        </div>
      )}

      {state?.error && <FormMessage variant="error">{state.error}</FormMessage>}

      <SubmitButton pendingLabel="Saving...">{submitLabel}</SubmitButton>
    </form>
  );
}
