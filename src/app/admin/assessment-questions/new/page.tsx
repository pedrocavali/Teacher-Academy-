import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAssessmentQuestion } from "../actions";
import { QuestionPayloadForm } from "../question-payload-form";

export const metadata: Metadata = {
  title: "New assessment question — Teacher Academy Admin",
};

export default async function NewAssessmentQuestionPage(
  props: PageProps<"/admin/assessment-questions/new">,
) {
  const { assessmentId } = await props.searchParams;

  if (typeof assessmentId !== "string") {
    notFound();
  }

  const supabase = await createClient();
  const { data: assessment } = await supabase
    .from("assessments")
    .select("id, title")
    .eq("id", assessmentId)
    .single();

  if (!assessment) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-6">
      <Link
        href={`/admin/assessments/${assessment.id}`}
        className="text-sm text-muted-foreground hover:underline"
      >
        ← {assessment.title}
      </Link>
      <h1 className="text-2xl font-semibold tracking-tight">New question</h1>
      <QuestionPayloadForm
        action={createAssessmentQuestion}
        hiddenFields={{ assessmentId: assessment.id }}
        submitLabel="Create question"
      />
    </div>
  );
}
