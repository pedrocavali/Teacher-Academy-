import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { QuestionEditForm } from "./question-edit-form";
import { OptionsList } from "./options-list";
import { OptionForm } from "./option-form";

export const metadata: Metadata = {
  title: "Edit question — Teacher Academy Admin",
};

export default async function AdminQuestionDetailPage(
  props: PageProps<"/admin/questions/[questionId]">,
) {
  const { questionId } = await props.params;
  const supabase = await createClient();

  const { data: question } = await supabase
    .from("questions")
    .select("id, prompt, type, order_index, activity_id, activities(id, type)")
    .eq("id", questionId)
    .single();

  if (!question) {
    notFound();
  }

  const { data: options } = await supabase
    .from("question_options")
    .select("id, text, is_correct, order_index")
    .eq("question_id", questionId)
    .order("order_index", { ascending: true });

  const activity = question.activities as unknown as { id: string; type: string } | null;
  const nextOrderIndex = options && options.length > 0
    ? Math.max(...options.map((o) => o.order_index)) + 1
    : 0;

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-4">
        {activity && (
          <Link
            href={`/admin/activities/${activity.id}`}
            className="text-sm text-muted-foreground hover:underline"
          >
            ← {activity.type.replace("_", " ")}
          </Link>
        )}
        <h1 className="text-2xl font-semibold tracking-tight">Edit question</h1>
        <QuestionEditForm questionId={question.id} question={question} />
      </div>

      <div className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold tracking-tight">
          {question.type === "fill_blank"
            ? "Accepted answers"
            : question.type === "ordering"
              ? "Items"
              : "Options"}
        </h2>
        <OptionsList
          questionId={question.id}
          questionType={question.type}
          options={options ?? []}
        />
        <OptionForm
          questionId={question.id}
          questionType={question.type}
          nextOrderIndex={nextOrderIndex}
        />
      </div>
    </div>
  );
}
