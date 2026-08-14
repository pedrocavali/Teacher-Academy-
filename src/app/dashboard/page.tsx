import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/lib/auth/actions";
import { SubmitButton } from "@/components/auth/submit-button";
import { Card } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { getRecommendations } from "@/lib/recommendations/engine";
import { RecommendationList } from "@/components/recommendations/recommendation-list";

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

  const { data: placement } = await supabase
    .from("assessment_results")
    .select("overall_level")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const recommendations = await getRecommendations(supabase, user.id);

  return (
    <div className="flex flex-1 flex-col items-center gap-6 px-6 py-24">
      <Card className="flex w-full max-w-sm flex-col gap-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Welcome{profile?.full_name ? `, ${profile.full_name}` : ""}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">{user.email}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Role: {profile?.role ?? "learner"}
          </p>
        </div>

        {placement ? (
          <p className="text-sm text-muted-foreground">
            Your level: <span className="font-medium text-foreground">{placement.overall_level}</span>
          </p>
        ) : (
          <p className="text-sm text-muted-foreground">
            Take the placement diagnostic to get a starting estimate of your
            level.
          </p>
        )}

        <div className="flex flex-col gap-2">
          {!placement && (
            <Link href="/placement" className={buttonVariants({ size: "lg" })}>
              Take placement
            </Link>
          )}
          <Link
            href="/explore"
            className={buttonVariants({
              size: "lg",
              variant: placement ? "primary" : "secondary",
            })}
          >
            Explore
          </Link>
        </div>

        <form action={signOut}>
          <SubmitButton pendingLabel="Signing out...">Sign out</SubmitButton>
        </form>
      </Card>

      <RecommendationList recommendations={recommendations} />
    </div>
  );
}
