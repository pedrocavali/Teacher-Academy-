"use client";

import { useActionState } from "react";
import { SubmitButton } from "@/components/auth/submit-button";
import { resetPassword, type ResetPasswordState } from "./actions";

const initialState: ResetPasswordState = null;

export function ResetPasswordForm() {
  const [state, formAction] = useActionState(resetPassword, initialState);

  return (
    <form action={formAction} className="flex w-full flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label htmlFor="password" className="text-sm font-medium">
          New password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={6}
          autoComplete="new-password"
          className="rounded-md border border-foreground/20 bg-background px-3 py-2 text-sm"
        />
      </div>

      {state?.error && (
        <p className="text-sm text-red-600" role="alert">
          {state.error}
        </p>
      )}

      <SubmitButton pendingLabel="Updating...">Update password</SubmitButton>
    </form>
  );
}
