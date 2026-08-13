"use client";

import { useActionState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormMessage } from "@/components/ui/form-message";
import { SubmitButton } from "@/components/auth/submit-button";
import { createCourse, type CourseFormState } from "../actions";

const initialState: CourseFormState = null;

export function NewCourseForm() {
  const [state, formAction] = useActionState(createCourse, initialState);

  return (
    <form action={formAction} className="flex w-full max-w-lg flex-col gap-4">
      <div className="flex flex-col gap-1">
        <Label htmlFor="title">Title</Label>
        <Input id="title" name="title" type="text" required />
      </div>

      <div className="flex flex-col gap-1">
        <Label htmlFor="slug">Slug</Label>
        <Input
          id="slug"
          name="slug"
          type="text"
          required
          pattern="[a-z0-9]+(-[a-z0-9]+)*"
          title="Lowercase letters, numbers, and hyphens only"
          placeholder="teacher-academy-program"
        />
      </div>

      <div className="flex flex-col gap-1">
        <Label htmlFor="description">Description</Label>
        <textarea
          id="description"
          name="description"
          rows={3}
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {state?.error && <FormMessage variant="error">{state.error}</FormMessage>}

      <SubmitButton pendingLabel="Creating...">Create course</SubmitButton>
    </form>
  );
}
