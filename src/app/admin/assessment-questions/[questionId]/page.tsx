import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { QuestionPayloadForm } from "../question-payload-form";
import type { AssessmentQuestionPayload } from "@/lib/placement/payload";
import { updateAssessmentQuestion, deleteAssessmentQuestion } from "./actions";

export const metadata: Metadata = {
  title: "Edit assessment question — Teacher Academy Admin",
};

export default async function AdminAssessmentQuestionDetailPage(
  props: PageProps<"/admin/assessment-questions/[questionId]">,
) {
  const { questionId } = await props.params;
  const supabase = await createClient();

  const { data: question } = await supabase
    .from("assessment_questions")
    .select("id, skill, target_cefr_level, order_index, payload, assessment_id, assessments(id, title)")
    .eq("id", questionId)
    .single();

  if (!question) {
    notFound();
  }

  const assessment = question.assessments as unknown as { id: string; title: string } | null;

  return (
    <div className="flex flex-col gap-6">
      {assessment && (
        <Link
          href={`/admin/assessments/${assessment.id}`}
          className="text-sm text-muted-foreground hover:underline"
        >
          ← {assessment.title}
        </Link>
      )}
      <h1 className="text-2xl font-semibold tracking-tight">Edit question</h1>
      <QuestionPayloadForm
        action={updateAssessmentQuestion.bind(null, questionId)}
        defaultValues={{
          skill: question.skill,
          targetCefrLevel: question.target_cefr_level,
          orderIndex: question.order_index,
          payload: question.payload as unknown as AssessmentQuestionPayload,
        }}
        submitLabel="Save changes"
      />
      <form action={deleteAssessmentQuestion.bind(null, question.assessment_id, question.id)}>
        <button type="submit" className="text-sm text-destructive hover:underline">
          Delete question
        </button>
      </form>
    </div>
  );
}
