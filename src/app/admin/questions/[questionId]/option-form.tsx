"use client";

import { useActionState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormMessage } from "@/components/ui/form-message";
import { SubmitButton } from "@/components/auth/submit-button";
import { addOption, type OptionFormState } from "./actions";

const initialState: OptionFormState = null;

export function OptionForm({
  questionId,
  questionType,
  nextOrderIndex,
}: {
  questionId: string;
  questionType: string;
  nextOrderIndex: number;
}) {
  const [state, formAction] = useActionState(
    addOption.bind(null, questionId),
    initialState,
  );

  const isChoiceType = questionType === "multiple_choice" || questionType === "true_false";
  const isFillBlank = questionType === "fill_blank";

  return (
    <form action={formAction} className="flex w-full max-w-lg flex-col gap-3">
      {isFillBlank && <input type="hidden" name="isCorrect" value="on" />}

      <div className="flex items-end gap-3">
        <div className="flex flex-1 flex-col gap-1">
          <Label htmlFor="text">
            {isFillBlank
              ? "Accepted answer"
              : questionType === "ordering"
                ? "Item (in correct order)"
                : "Option text"}
          </Label>
          <Input id="text" name="text" type="text" required />
        </div>

        {!isFillBlank && (
          <div className="flex flex-col gap-1">
            <Label htmlFor="orderIndex">Order</Label>
            <Input
              id="orderIndex"
              name="orderIndex"
              type="number"
              defaultValue={nextOrderIndex}
              className="w-20"
            />
          </div>
        )}

        {isChoiceType && (
          <label className="flex items-center gap-2 pb-2 text-sm">
            <input type="checkbox" name="isCorrect" />
            Correct
          </label>
        )}
      </div>

      {state?.error && <FormMessage variant="error">{state.error}</FormMessage>}

      <SubmitButton pendingLabel="Adding...">Add</SubmitButton>
    </form>
  );
}
