"use client";

import { useActionState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormMessage } from "@/components/ui/form-message";
import { SubmitButton } from "@/components/auth/submit-button";
import { CEFR_LEVELS, SKILLS } from "@/lib/curriculum/constants";
import { updateLesson, type LessonFormState } from "./actions";

const initialState: LessonFormState = null;

export function LessonEditForm({
  lessonId,
  lesson,
}: {
  lessonId: string;
  lesson: {
    title: string;
    slug: string;
    objective: string;
    cefr_level: string;
    primary_skill: string;
    estimated_minutes: number;
    order_index: number;
  };
}) {
  const [state, formAction] = useActionState(
    updateLesson.bind(null, lessonId),
    initialState,
  );

  return (
    <form action={formAction} className="flex w-full max-w-lg flex-col gap-4">
      <div className="flex flex-col gap-1">
        <Label htmlFor="title">Title</Label>
        <Input id="title" name="title" type="text" required defaultValue={lesson.title} />
      </div>

      <div className="flex flex-col gap-1">
        <Label htmlFor="slug">Slug</Label>
        <Input
          id="slug"
          name="slug"
          type="text"
          required
          pattern="[a-z0-9]+(-[a-z0-9]+)*"
          defaultValue={lesson.slug}
        />
      </div>

      <div className="flex flex-col gap-1">
        <Label htmlFor="objective">Learning objective</Label>
        <textarea
          id="objective"
          name="objective"
          rows={2}
          required
          defaultValue={lesson.objective}
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <div className="flex gap-4">
        <div className="flex flex-1 flex-col gap-1">
          <Label htmlFor="cefrLevel">CEFR level</Label>
          <select
            id="cefrLevel"
            name="cefrLevel"
            required
            defaultValue={lesson.cefr_level}
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
          <Label htmlFor="primarySkill">Primary skill</Label>
          <select
            id="primarySkill"
            name="primarySkill"
            required
            defaultValue={lesson.primary_skill}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm capitalize focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {SKILLS.map((skill) => (
              <option key={skill} value={skill} className="capitalize">
                {skill}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex gap-4">
        <div className="flex flex-1 flex-col gap-1">
          <Label htmlFor="estimatedMinutes">Estimated minutes</Label>
          <Input
            id="estimatedMinutes"
            name="estimatedMinutes"
            type="number"
            min={1}
            defaultValue={lesson.estimated_minutes}
          />
        </div>
        <div className="flex flex-1 flex-col gap-1">
          <Label htmlFor="orderIndex">Order</Label>
          <Input
            id="orderIndex"
            name="orderIndex"
            type="number"
            defaultValue={lesson.order_index}
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
