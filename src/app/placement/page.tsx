import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { AssessmentQuestionPayload } from "@/lib/placement/payload";
import { PlacementForm, type PlayablePlacementQuestion } from "@/components/placement/placement-form";

export const metadata: Metadata = {
  title: "Placement — Teacher Academy",
};

export default async function PlacementPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: assessment } = await supabase
    .from("assessments")
    .select("id, title")
    .eq("type", "placement")
    .eq("status", "published")
    .order("version", { ascending: false })
    .limit(1)
    .maybeSingle();

  const { data: questions } = assessment
    ? await supabase
        .from("assessment_questions")
        .select("id, skill, payload")
        .eq("assessment_id", assessment.id)
        .order("order_index", { ascending: true })
    : { data: null };

  // Never forwarded to the client: payload.options[].isCorrect and
  // payload.acceptedAnswers. Grading only happens server-side in
  // submitPlacementAttempt, which re-fetches the real payload after the
  // learner submits — same pattern as the Phase 9 activity engine.
  const playableQuestions: PlayablePlacementQuestion[] = (questions ?? []).map((q) => {
    const payload = q.payload as unknown as AssessmentQuestionPayload;
    return {
      id: q.id,
      skill: q.skill,
      type: payload.type,
      prompt: payload.prompt,
      context: payload.context,
      options: payload.type === "multiple_choice" ? payload.options.map((o) => o.text) : undefined,
    };
  });

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-8 px-6 py-12">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight">Placement</h1>
        <p className="text-sm text-muted-foreground">
          This gives you a starting estimate of your level — it&apos;s a
          diagnostic, not a certification. You can revisit it later if your
          level changes.
        </p>
      </div>

      {playableQuestions.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Placement isn&apos;t available yet — check back soon.
        </p>
      ) : (
        <PlacementForm questions={playableQuestions} />
      )}
    </div>
  );
}
