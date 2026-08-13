import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/lib/auth/actions";
import { buttonVariants } from "@/components/ui/button";

export async function Header() {
  // Same reasoning as src/lib/supabase/middleware.ts: don't take down every
  // page (including the public landing page) just because Supabase hasn't
  // been configured yet in this environment.
  const isSupabaseConfigured =
    !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const user = isSupabaseConfigured
    ? (await (await createClient()).auth.getUser()).data.user
    : null;

  return (
    <header className="flex items-center justify-between border-b border-border px-6 py-4">
      <Link href="/" className="text-sm font-semibold tracking-tight">
        Teacher Academy
      </Link>

      {user ? (
        <div className="flex items-center gap-4 text-sm">
          <Link href="/dashboard" className="hover:underline">
            Dashboard
          </Link>
          <form action={signOut}>
            <button type="submit" className="hover:underline">
              Sign out
            </button>
          </form>
        </div>
      ) : (
        <div className="flex items-center gap-4 text-sm">
          <Link href="/login" className="hover:underline">
            Sign in
          </Link>
          <Link href="/signup" className={buttonVariants({ size: "sm" })}>
            Sign up
          </Link>
        </div>
      )}
    </header>
  );
}
