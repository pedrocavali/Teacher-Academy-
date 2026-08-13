"use client";

import { useActionState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormMessage } from "@/components/ui/form-message";
import { SubmitButton } from "@/components/auth/submit-button";
import { createAssessment, type AssessmentFormState } from "../actions";

const initialState: AssessmentFormState = null;

export function NewAssessmentForm() {
  const [state, formAction] = useActionState(createAssessment, initialState);

  return (
    <form action={formAction} className="flex w-full max-w-lg flex-col gap-4">
      <div className="flex flex-col gap-1">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          name="title"
          type="text"
          required
          defaultValue="Placement Test"
        />
      </div>

      <div className="flex flex-col gap-1">
        <Label htmlFor="version">Version</Label>
        <Input id="version" name="version" type="number" defaultValue={1} />
      </div>

      {state?.error && <FormMessage variant="error">{state.error}</FormMessage>}

      <SubmitButton pendingLabel="Creating...">Create assessment</SubmitButton>
    </form>
  );
}
