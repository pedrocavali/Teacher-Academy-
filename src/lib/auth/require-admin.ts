import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

// Defense in depth: RLS is the real security boundary (admin-only write
// policies on every content table), but redirecting a non-admin out of the
// /admin UI entirely — and refusing their server actions up front — gives a
// clean UX instead of a raw Postgres error.
export async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    redirect("/dashboard");
  }

  return { supabase, user };
}
