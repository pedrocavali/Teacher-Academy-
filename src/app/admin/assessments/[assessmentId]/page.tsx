import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { buttonVariants } from "@/components/ui/button";
import { StatusControls } from "@/components/admin/status-controls";
import { TypeChip } from "@/components/admin/type-chip";
import { AssessmentEditForm } from "./assessment-edit-form";
import type { AssessmentQuestionPayload } from "@/lib/placement/payload";

export const metadata: Metadata = {
  title: "Edit assessment — Teacher Academy Admin",
};

export default async function AdminAssessmentDetailPage(
  props: PageProps<"/admin/assessments/[assessmentId]">,
) {
  const { assessmentId } = await props.params;
  const supabase = await createClient();

  const { data: assessment } = await supabase
    .from("assessments")
    .select("id, title, version, status")
    .eq("id", assessmentId)
    .single();

  if (!assessment) {
    notFound();
  }

  const { data: questions } = await supabase
    .from("assessment_questions")
    .select("id, skill, target_cefr_level, payload")
    .eq("assessment_id", assessmentId)
    .order("order_index", { ascending: true });

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-4">
        <Link href="/admin/assessments" className="text-sm text-muted-foreground hover:underline">
          ← Assessments
        </Link>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold tracking-tight">{assessment.title}</h1>
          <StatusControls
            contentType="assessment"
            id={assessment.id}
            status={assessment.status}
          />
        </div>
        <AssessmentEditForm assessmentId={assessment.id} assessment={assessment} />
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold tracking-tight">Questions</h2>
          <Link
            href={`/admin/assessment-questions/new?assessmentId=${assessment.id}`}
            className={buttonVariants({ size: "sm" })}
          >
            New question
          </Link>
        </div>

        {!questions || questions.length === 0 ? (
          <p className="text-sm text-muted-foreground">No questions yet.</p>
        ) : (
          <div className="flex flex-col divide-y divide-border rounded-lg border border-border">
            {questions.map((question) => {
              const payload = question.payload as unknown as AssessmentQuestionPayload;
              return (
                <Link
                  key={question.id}
                  href={`/admin/assessment-questions/${question.id}`}
                  className="flex items-center justify-between gap-4 px-4 py-3 text-sm hover:bg-muted/50"
                >
                  <div className="flex min-w-0 flex-col">
                    <span className="truncate">{payload?.prompt ?? "(no prompt)"}</span>
                    <span className="text-muted-foreground capitalize">
                      {question.skill} · {question.target_cefr_level}
                    </span>
                  </div>
                  <TypeChip>{payload?.type?.replace("_", " ") ?? "?"}</TypeChip>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
