"use server";

import { createClient } from "@/lib/supabase/server";
import { getOrigin } from "@/lib/auth/origin";

export type ForgotPasswordState = { message: string } | null;

export async function requestPasswordReset(
  _prevState: ForgotPasswordState,
  formData: FormData,
): Promise<ForgotPasswordState> {
  const email = formData.get("email") as string;
  const origin = await getOrigin();
  const supabase = await createClient();

  await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/confirm?next=/reset-password`,
  });

  // Always the same message, whether or not the email is registered —
  // confirming/denying an account's existence here would leak who has one.
  return {
    message:
      "If an account exists for that email, we've sent a link to reset your password.",
  };
}
