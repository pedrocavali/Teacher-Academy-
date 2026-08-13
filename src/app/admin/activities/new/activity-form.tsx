"use client";

import { useActionState, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormMessage } from "@/components/ui/form-message";
import { SubmitButton } from "@/components/auth/submit-button";
import { ACTIVITY_TYPES, SKILLS } from "@/lib/curriculum/constants";
import { createActivity, type ActivityFormState } from "../actions";

const initialState: ActivityFormState = null;

const PROMPT_TYPES = {
  writing: {
    label: "Writing prompt",
    placeholder: "Write a short email to a colleague explaining...",
  },
  speaking: {
    label: "Speaking prompt",
    placeholder: "Describe a challenge you faced in the classroom this week and how you handled it.",
  },
  role_play: {
    label: "Scenario",
    placeholder: "You're a teacher discussing a student's progress with their parent at a conference.",
  },
} as const;

export function NewActivityForm({ lessonId }: { lessonId: string }) {
  const [state, formAction] = useActionState(createActivity, initialState);
  const [type, setType] = useState<(typeof ACTIVITY_TYPES)[number]>("multiple_choice");
  const promptType = PROMPT_TYPES[type as keyof typeof PROMPT_TYPES];

  return (
    <form action={formAction} className="flex w-full max-w-lg flex-col gap-4">
      <input type="hidden" name="lessonId" value={lessonId} />

      <div className="flex gap-4">
        <div className="flex flex-1 flex-col gap-1">
          <Label htmlFor="type">Type</Label>
          <select
            id="type"
            name="type"
            required
            value={type}
            onChange={(e) => setType(e.target.value as (typeof ACTIVITY_TYPES)[number])}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm capitalize focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {ACTIVITY_TYPES.map((activityType) => (
              <option key={activityType} value={activityType} className="capitalize">
                {activityType.replace("_", " ")}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-1 flex-col gap-1">
          <Label htmlFor="skill">Skill</Label>
          <select
            id="skill"
            name="skill"
            required
            defaultValue="grammar"
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

      <div className="flex flex-col gap-1">
        <Label htmlFor="instructions">{promptType?.label ?? "Instructions"}</Label>
        <textarea
          id="instructions"
          name="instructions"
          rows={2}
          placeholder={promptType?.placeholder ?? "Choose the best answer for each question."}
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
        {promptType && (
          <p className="text-xs text-muted-foreground">
            {type === "role_play"
              ? "The AI coach plays whichever role this scenario implies and has a short practice conversation with the learner."
              : `Shown to the learner as the task. AI feedback (Gemini) grades their ${type} against this prompt.`}
          </p>
        )}
      </div>

      <div className="flex gap-4">
        <div className="flex flex-1 flex-col gap-1">
          <Label htmlFor="estimatedMinutes">Estimated minutes</Label>
          <Input
            id="estimatedMinutes"
            name="estimatedMinutes"
            type="number"
            min={1}
            defaultValue={5}
          />
        </div>
        <div className="flex flex-1 flex-col gap-1">
          <Label htmlFor="orderIndex">Order</Label>
          <Input id="orderIndex" name="orderIndex" type="number" defaultValue={0} />
        </div>
      </div>

      {state?.error && <FormMessage variant="error">{state.error}</FormMessage>}

      <SubmitButton pendingLabel="Creating...">Create activity</SubmitButton>
    </form>
  );
}
