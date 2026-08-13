"use client";

import Link from "next/link";
import { useActionState } from "react";
import { SubmitButton } from "@/components/auth/submit-button";
import { requestPasswordReset, type ForgotPasswordState } from "./actions";

const initialState: ForgotPasswordState = null;

export function ForgotPasswordForm() {
  const [state, formAction] = useActionState(
    requestPasswordReset,
    initialState,
  );

  if (state?.message) {
    return (
      <p className="text-center text-sm text-foreground/80" role="status">
        {state.message}
      </p>
    );
  }

  return (
    <form action={formAction} className="flex w-full flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label htmlFor="email" className="text-sm font-medium">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className="rounded-md border border-foreground/20 bg-background px-3 py-2 text-sm"
        />
      </div>

      <SubmitButton pendingLabel="Sending...">Send reset link</SubmitButton>

      <p className="text-center text-sm text-foreground/70">
        <Link href="/login" className="underline">
          Back to sign in
        </Link>
      </p>
    </form>
  );
}
