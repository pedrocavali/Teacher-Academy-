"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormMessage } from "@/components/ui/form-message";
import { SubmitButton } from "@/components/auth/submit-button";
import { signup, type SignupState } from "./actions";

const initialState: SignupState = null;

export function SignupForm() {
  const [state, formAction] = useActionState(signup, initialState);

  if (state && "message" in state) {
    return <FormMessage variant="status">{state.message}</FormMessage>;
  }

  return (
    <form action={formAction} className="flex w-full flex-col gap-4">
      <div className="flex flex-col gap-1">
        <Label htmlFor="fullName">Full name</Label>
        <Input id="fullName" name="fullName" type="text" required autoComplete="name" />
      </div>

      <div className="flex flex-col gap-1">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" required autoComplete="email" />
      </div>

      <div className="flex flex-col gap-1">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          required
          minLength={6}
          autoComplete="new-password"
        />
      </div>

      {state && "error" in state && (
        <FormMessage variant="error">{state.error}</FormMessage>
      )}

      <SubmitButton pendingLabel="Creating account...">
        Create account
      </SubmitButton>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}
