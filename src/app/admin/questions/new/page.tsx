import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { NewQuestionForm } from "./question-form";

export const metadata: Metadata = {
  title: "New question — Teacher Academy Admin",
};

export default async function NewQuestionPage(
  props: PageProps<"/admin/questions/new">,
) {
  const { activityId } = await props.searchParams;

  if (typeof activityId !== "string") {
    notFound();
  }

  const supabase = await createClient();
  const { data: activity } = await supabase
    .from("activities")
    .select("id, type")
    .eq("id", activityId)
    .single();

  if (!activity) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-6">
      <Link
        href={`/admin/activities/${activity.id}`}
        className="text-sm text-muted-foreground hover:underline"
      >
        ← {activity.type.replace("_", " ")}
      </Link>
      <h1 className="text-2xl font-semibold tracking-tight">New question</h1>
      <NewQuestionForm activityId={activity.id} />
    </div>
  );
}
