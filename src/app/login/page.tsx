import type { Metadata } from "next";
import { AuthPageShell } from "@/components/auth/auth-page-shell";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Sign in — Teacher Academy",
};

export default function LoginPage() {
  return (
    <AuthPageShell title="Sign in">
      <LoginForm />
    </AuthPageShell>
  );
}
