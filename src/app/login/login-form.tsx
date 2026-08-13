"use client";

import Link from "next/link";
import { useActionState } from "react";
import { SubmitButton } from "@/components/auth/submit-button";
import { login, type LoginState } from "./actions";

const initialState: LoginState = null;

export function LoginForm() {
  const [state, formAction] = useActionState(login, initialState);

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

      <div className="flex flex-col gap-1">
        <label htmlFor="password" className="text-sm font-medium">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="rounded-md border border-foreground/20 bg-background px-3 py-2 text-sm"
        />
      </div>

      {state?.error && (
        <p className="text-sm text-red-600" role="alert">
          {state.error}
        </p>
      )}

      <SubmitButton pendingLabel="Signing in...">Sign in</SubmitButton>

      <p className="text-center text-sm text-foreground/70">
        <Link href="/forgot-password" className="underline">
          Forgot your password?
        </Link>
      </p>

      <p className="text-center text-sm text-foreground/70">
        No account yet?{" "}
        <Link href="/signup" className="underline">
          Sign up
        </Link>
      </p>
    </form>
  );
}
