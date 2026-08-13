import type { Metadata } from "next";
import { AuthPageShell } from "@/components/auth/auth-page-shell";
import { SignupForm } from "./signup-form";

export const metadata: Metadata = {
  title: "Sign up — Teacher Academy",
};

export default function SignupPage() {
  return (
    <AuthPageShell title="Create your account">
      <SignupForm />
    </AuthPageShell>
  );
}
