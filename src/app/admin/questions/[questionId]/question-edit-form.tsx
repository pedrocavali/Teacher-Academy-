"use client";

import { useActionState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormMessage } from "@/components/ui/form-message";
import { SubmitButton } from "@/components/auth/submit-button";
import { QUESTION_TYPES } from "@/lib/curriculum/constants";
import { updateQuestion, type QuestionFormState } from "./actions";

const initialState: QuestionFormState = null;

export function QuestionEditForm({
  questionId,
  question,
}: {
  questionId: string;
  question: { prompt: string; type: string; order_index: number };
}) {
  const [state, formAction] = useActionState(
    updateQuestion.bind(null, questionId),
    initialState,
  );

  return (
    <form action={formAction} className="flex w-full max-w-lg flex-col gap-4">
      <div className="flex flex-col gap-1">
        <Label htmlFor="prompt">Prompt</Label>
        <textarea
          id="prompt"
          name="prompt"
          rows={2}
          required
          defaultValue={question.prompt}
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <div className="flex gap-4">
        <div className="flex flex-1 flex-col gap-1">
          <Label htmlFor="type">Type</Label>
          <select
            id="type"
            name="type"
            required
            defaultValue={question.type}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm capitalize focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {QUESTION_TYPES.map((type) => (
              <option key={type} value={type} className="capitalize">
                {type.replace("_", " ")}
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
            defaultValue={question.order_index}
          />
        </div>
      </div>

      {state && "error" in state && (
        <FormMessage variant="error">{state.error}</FormMessage>
      )}
      {state && "success" in state && (
        <FormMessage variant="status">Saved.</FormMessage>
      )}

      <SubmitButton pendingLabel="Saving...">Save changes</SubmitButton>
    </form>
  );
}
