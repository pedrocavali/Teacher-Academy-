import type { Metadata } from "next";
import { AuthPageShell } from "@/components/auth/auth-page-shell";
import { ResetPasswordForm } from "./reset-password-form";

export const metadata: Metadata = {
  title: "Set a new password — Teacher Academy",
};

export default function ResetPasswordPage() {
  return (
    <AuthPageShell title="Set a new password">
      <ResetPasswordForm />
    </AuthPageShell>
  );
}
