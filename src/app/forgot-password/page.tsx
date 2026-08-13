import type { Metadata } from "next";
import { AuthPageShell } from "@/components/auth/auth-page-shell";
import { ForgotPasswordForm } from "./forgot-password-form";

export const metadata: Metadata = {
  title: "Reset your password — Teacher Academy",
};

export default function ForgotPasswordPage() {
  return (
    <AuthPageShell title="Reset your password">
      <ForgotPasswordForm />
    </AuthPageShell>
  );
}
