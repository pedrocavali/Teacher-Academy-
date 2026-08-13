import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/lib/auth/actions";
import { SubmitButton } from "@/components/auth/submit-button";

export const metadata: Metadata = {
  title: "Dashboard — Teacher Academy",
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Belt and suspenders: the proxy already redirects unauthenticated
  // requests away from /dashboard (src/lib/supabase/middleware.ts).
  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, role")
    .eq("id", user.id)
    .single();

  return (
    <div className="flex flex-1 flex-col items-center px-6 py-24">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Welcome{profile?.full_name ? `, ${profile.full_name}` : ""}
          </h1>
          <p className="mt-1 text-sm text-foreground/70">{user.email}</p>
          <p className="mt-1 text-sm text-foreground/70">
            Role: {profile?.role ?? "learner"}
          </p>
        </div>

        <p className="text-sm text-foreground/60">
          Placement, your catalog, and recommended practice land here in a
          later phase. For now this page just confirms you&apos;re signed in.
        </p>

        <form action={signOut}>
          <SubmitButton pendingLabel="Signing out...">Sign out</SubmitButton>
        </form>
      </div>
    </div>
  );
}
