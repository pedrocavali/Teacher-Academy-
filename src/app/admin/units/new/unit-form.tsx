"use client";

import { useActionState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormMessage } from "@/components/ui/form-message";
import { SubmitButton } from "@/components/auth/submit-button";
import { createUnit, type UnitFormState } from "../actions";

const initialState: UnitFormState = null;

export function NewUnitForm({ courseId }: { courseId: string }) {
  const [state, formAction] = useActionState(createUnit, initialState);

  return (
    <form action={formAction} className="flex w-full max-w-lg flex-col gap-4">
      <input type="hidden" name="courseId" value={courseId} />

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
          placeholder="staff-meetings"
        />
      </div>

      <div className="flex flex-col gap-1">
        <Label htmlFor="track">Track</Label>
        <select
          id="track"
          name="track"
          required
          defaultValue="general"
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="general">General</option>
          <option value="teachers">Teachers</option>
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <Label htmlFor="orderIndex">Order</Label>
        <Input id="orderIndex" name="orderIndex" type="number" defaultValue={0} />
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

      <SubmitButton pendingLabel="Creating...">Create unit</SubmitButton>
    </form>
  );
}
