"use client";

import { useActionState, useState } from "react";
import { Label } from "@/components/ui/label";
import { FormMessage } from "@/components/ui/form-message";
import { SubmitButton } from "@/components/auth/submit-button";
import { addContentItem, type ContentItemFormState } from "./content-items-actions";

const initialState: ContentItemFormState = null;

const TEXT_TYPES = new Set(["transcript", "reading_passage"]);

export function ContentItemForm({ lessonId }: { lessonId: string }) {
  const [state, formAction] = useActionState(
    addContentItem.bind(null, lessonId),
    initialState,
  );
  const [type, setType] = useState("transcript");

  return (
    <form action={formAction} className="flex w-full max-w-lg flex-col gap-4">
      <div className="flex flex-col gap-1">
        <Label htmlFor="type">Type</Label>
        <select
          id="type"
          name="type"
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="transcript">Transcript</option>
          <option value="reading_passage">Reading passage</option>
          <option value="video">Video</option>
          <option value="audio">Audio</option>
          <option value="image">Image</option>
        </select>
      </div>

      {TEXT_TYPES.has(type) ? (
        <div className="flex flex-col gap-1">
          <Label htmlFor="textContent">Text</Label>
          <textarea
            id="textContent"
            name="textContent"
            rows={5}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      ) : (
        <div className="flex flex-col gap-1">
          <Label htmlFor="file">File</Label>
          <input
            id="file"
            name="file"
            type="file"
            accept={
              type === "video" ? "video/*" : type === "audio" ? "audio/*" : "image/*"
            }
            className="w-full text-sm"
          />
        </div>
      )}

      {state?.error && <FormMessage variant="error">{state.error}</FormMessage>}

      <SubmitButton pendingLabel="Adding...">Add content item</SubmitButton>
    </form>
  );
}
