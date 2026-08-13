import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Your level — Teacher Academy",
};

const SKILL_ROWS: { key: "reading_level" | "listening_level" | "grammar_level" | "vocabulary_level"; label: string }[] = [
  { key: "reading_level", label: "Reading" },
  { key: "listening_level", label: "Listening" },
  { key: "grammar_level", label: "Grammar" },
  { key: "vocabulary_level", label: "Vocabulary" },
];

export default async function PlacementResultsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: result } = await supabase
    .from("assessment_results")
    .select("overall_level, reading_level, listening_level, grammar_level, vocabulary_level, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!result) {
    redirect("/placement");
  }

  return (
    <div className="mx-auto flex w-full max-w-lg flex-1 flex-col gap-8 px-6 py-12">
      <div className="flex flex-col gap-2 text-center">
        <span className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
          Your level
        </span>
        <h1 className="text-4xl font-semibold tracking-tight">{result.overall_level}</h1>
        <p className="text-sm text-muted-foreground">
          A diagnostic estimate, not a certification — it&apos;ll keep
          refining as you practice.
        </p>
      </div>

      <Card className="flex flex-col divide-y divide-border p-0">
        {SKILL_ROWS.map(({ key, label }) => (
          <div key={key} className="flex items-center justify-between px-4 py-3 text-sm">
            <span className="text-muted-foreground">{label}</span>
            <span className="font-medium">{result[key] ?? "—"}</span>
          </div>
        ))}
      </Card>

      <Link href="/explore" className={buttonVariants({ size: "lg" })}>
        Start exploring
      </Link>
    </div>
  );
}
