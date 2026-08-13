import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { NewActivityForm } from "./activity-form";

export const metadata: Metadata = {
  title: "New activity — Teacher Academy Admin",
};

export default async function NewActivityPage(
  props: PageProps<"/admin/activities/new">,
) {
  const { lessonId } = await props.searchParams;

  if (typeof lessonId !== "string") {
    notFound();
  }

  const supabase = await createClient();
  const { data: lesson } = await supabase
    .from("lessons")
    .select("id, title")
    .eq("id", lessonId)
    .single();

  if (!lesson) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-6">
      <Link
        href={`/admin/lessons/${lesson.id}`}
        className="text-sm text-muted-foreground hover:underline"
      >
        ← {lesson.title}
      </Link>
      <h1 className="text-2xl font-semibold tracking-tight">New activity</h1>
      <NewActivityForm lessonId={lesson.id} />
    </div>
  );
}
