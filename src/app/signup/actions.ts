"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getOrigin } from "@/lib/auth/origin";

export type SignupState = { error: string } | { message: string } | null;

export async function signup(
  _prevState: SignupState,
  formData: FormData,
): Promise<SignupState> {
  const fullName = formData.get("fullName") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const origin = await getOrigin();
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName },
      emailRedirectTo: `${origin}/auth/confirm`,
    },
  });

  if (error) {
    return { error: error.message };
  }

  // No session back means the project requires email confirmation before
  // sign-in — the account exists but isn't usable yet.
  if (!data.session) {
    return {
      message: "Check your email to confirm your account before signing in.",
    };
  }

  redirect("/dashboard");
}
