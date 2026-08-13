import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { buttonVariants } from "@/components/ui/button";
import { StatusControls } from "@/components/admin/status-controls";
import { TypeChip } from "@/components/admin/type-chip";
import { ActivityEditForm } from "./activity-edit-form";

export const metadata: Metadata = {
  title: "Edit activity — Teacher Academy Admin",
};

export default async function AdminActivityDetailPage(
  props: PageProps<"/admin/activities/[activityId]">,
) {
  const { activityId } = await props.params;
  const supabase = await createClient();

  const { data: activity } = await supabase
    .from("activities")
    .select(
      "id, type, skill, instructions, estimated_minutes, order_index, status, lesson_id, lessons(id, title)",
    )
    .eq("id", activityId)
    .single();

  if (!activity) {
    notFound();
  }

  const { data: questions } = await supabase
    .from("questions")
    .select("id, prompt, type")
    .eq("activity_id", activityId)
    .order("order_index", { ascending: true });

  const lesson = activity.lessons as unknown as { id: string; title: string } | null;

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-4">
        {lesson && (
          <Link
            href={`/admin/lessons/${lesson.id}`}
            className="text-sm text-muted-foreground hover:underline"
          >
            ← {lesson.title}
          </Link>
        )}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold tracking-tight capitalize">
            {activity.type.replace("_", " ")}
          </h1>
          <StatusControls contentType="activity" id={activity.id} status={activity.status} />
        </div>
        <ActivityEditForm activityId={activity.id} activity={activity} />
      </div>

      {activity.type === "writing" || activity.type === "speaking" ? (
        <p className="text-sm text-muted-foreground">
          {activity.type === "writing" ? "Writing" : "Speaking"} activities
          don&apos;t use questions — the prompt above is shown directly to
          the learner, and Gemini grades their {activity.type} against it.
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold tracking-tight">Questions</h2>
            <Link
              href={`/admin/questions/new?activityId=${activity.id}`}
              className={buttonVariants({ size: "sm" })}
            >
              New question
            </Link>
          </div>

          {!questions || questions.length === 0 ? (
            <p className="text-sm text-muted-foreground">No questions yet.</p>
          ) : (
            <div className="flex flex-col divide-y divide-border rounded-lg border border-border">
              {questions.map((question) => (
                <Link
                  key={question.id}
                  href={`/admin/questions/${question.id}`}
                  className="flex items-center justify-between px-4 py-3 text-sm hover:bg-muted/50"
                >
                  <span className="truncate">{question.prompt}</span>
                  <TypeChip>{question.type.replace("_", " ")}</TypeChip>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
