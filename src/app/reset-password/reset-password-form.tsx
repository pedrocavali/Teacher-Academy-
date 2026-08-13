"use client";

import { useActionState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormMessage } from "@/components/ui/form-message";
import { SubmitButton } from "@/components/auth/submit-button";
import { resetPassword, type ResetPasswordState } from "./actions";

const initialState: ResetPasswordState = null;

export function ResetPasswordForm() {
  const [state, formAction] = useActionState(resetPassword, initialState);

  return (
    <form action={formAction} className="flex w-full flex-col gap-4">
      <div className="flex flex-col gap-1">
        <Label htmlFor="password">New password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          required
          minLength={6}
          autoComplete="new-password"
        />
      </div>

      {state?.error && <FormMessage variant="error">{state.error}</FormMessage>}

      <SubmitButton pendingLabel="Updating...">Update password</SubmitButton>
    </form>
  );
}
