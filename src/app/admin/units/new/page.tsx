import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { NewUnitForm } from "./unit-form";

export const metadata: Metadata = {
  title: "New unit — Teacher Academy Admin",
};

export default async function NewUnitPage(
  props: PageProps<"/admin/units/new">,
) {
  const { courseId } = await props.searchParams;

  if (typeof courseId !== "string") {
    notFound();
  }

  const supabase = await createClient();
  const { data: course } = await supabase
    .from("courses")
    .select("id, title")
    .eq("id", courseId)
    .single();

  if (!course) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-6">
      <Link
        href={`/admin/courses/${course.id}`}
        className="text-sm text-muted-foreground hover:underline"
      >
        ← {course.title}
      </Link>
      <h1 className="text-2xl font-semibold tracking-tight">New unit</h1>
      <NewUnitForm courseId={course.id} />
    </div>
  );
}
