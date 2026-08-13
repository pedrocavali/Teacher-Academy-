"use client";

import Link from "next/link";
import { useActionState } from "react";
import { SubmitButton } from "@/components/auth/submit-button";
import { signup, type SignupState } from "./actions";

const initialState: SignupState = null;

export function SignupForm() {
  const [state, formAction] = useActionState(signup, initialState);

  if (state && "message" in state) {
    return (
      <p className="text-center text-sm text-foreground/80" role="status">
        {state.message}
      </p>
    );
  }

  return (
    <form action={formAction} className="flex w-full flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label htmlFor="fullName" className="text-sm font-medium">
          Full name
        </label>
        <input
          id="fullName"
          name="fullName"
          type="text"
          required
          autoComplete="name"
          className="rounded-md border border-foreground/20 bg-background px-3 py-2 text-sm"
        />
      </div>

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

      <div className="flex flex-col gap-1">
        <label htmlFor="password" className="text-sm font-medium">
          Password
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

      {state && "error" in state && (
        <p className="text-sm text-red-600" role="alert">
          {state.error}
        </p>
      )}

      <SubmitButton pendingLabel="Creating account...">
        Create account
      </SubmitButton>

      <p className="text-center text-sm text-foreground/70">
        Already have an account?{" "}
        <Link href="/login" className="underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}
