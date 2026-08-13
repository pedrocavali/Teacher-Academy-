import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { NewLessonForm } from "./lesson-form";

export const metadata: Metadata = {
  title: "New lesson — Teacher Academy Admin",
};

export default async function NewLessonPage(
  props: PageProps<"/admin/lessons/new">,
) {
  const { unitId } = await props.searchParams;

  if (typeof unitId !== "string") {
    notFound();
  }

  const supabase = await createClient();
  const { data: unit } = await supabase
    .from("units")
    .select("id, title")
    .eq("id", unitId)
    .single();

  if (!unit) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-6">
      <Link
        href={`/admin/units/${unit.id}`}
        className="text-sm text-muted-foreground hover:underline"
      >
        ← {unit.title}
      </Link>
      <h1 className="text-2xl font-semibold tracking-tight">New lesson</h1>
      <NewLessonForm unitId={unit.id} />
    </div>
  );
}
