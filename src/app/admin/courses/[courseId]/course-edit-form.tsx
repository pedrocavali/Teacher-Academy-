"use client";

import { useActionState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormMessage } from "@/components/ui/form-message";
import { SubmitButton } from "@/components/auth/submit-button";
import { updateCourse, type CourseFormState } from "./actions";

const initialState: CourseFormState = null;

export function CourseEditForm({
  courseId,
  course,
}: {
  courseId: string;
  course: { title: string; slug: string; description: string | null };
}) {
  const [state, formAction] = useActionState(
    updateCourse.bind(null, courseId),
    initialState,
  );

  return (
    <form action={formAction} className="flex w-full max-w-lg flex-col gap-4">
      <div className="flex flex-col gap-1">
        <Label htmlFor="title">Title</Label>
        <Input id="title" name="title" type="text" required defaultValue={course.title} />
      </div>

      <div className="flex flex-col gap-1">
        <Label htmlFor="slug">Slug</Label>
        <Input
          id="slug"
          name="slug"
          type="text"
          required
          pattern="[a-z0-9]+(-[a-z0-9]+)*"
          defaultValue={course.slug}
        />
      </div>

      <div className="flex flex-col gap-1">
        <Label htmlFor="description">Description</Label>
        <textarea
          id="description"
          name="description"
          rows={3}
          defaultValue={course.description ?? ""}
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
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
