"use client";

import { useActionState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormMessage } from "@/components/ui/form-message";
import { SubmitButton } from "@/components/auth/submit-button";
import { updateAssessment, type AssessmentFormState } from "./actions";

const initialState: AssessmentFormState = null;

export function AssessmentEditForm({
  assessmentId,
  assessment,
}: {
  assessmentId: string;
  assessment: { title: string; version: number };
}) {
  const [state, formAction] = useActionState(
    updateAssessment.bind(null, assessmentId),
    initialState,
  );

  return (
    <form action={formAction} className="flex w-full max-w-lg flex-col gap-4">
      <div className="flex flex-col gap-1">
        <Label htmlFor="title">Title</Label>
        <Input id="title" name="title" type="text" required defaultValue={assessment.title} />
      </div>

      <div className="flex flex-col gap-1">
        <Label htmlFor="version">Version</Label>
        <Input id="version" name="version" type="number" defaultValue={assessment.version} />
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
