"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { scoreSkill, overallLevel, type CefrLevel } from "@/lib/placement/scoring";
import { isPlacementResponseCorrect, type PlacementResponse } from "@/lib/placement/grading";
import type { AssessmentQuestionPayload } from "@/lib/placement/payload";

export async function submitPlacementAttempt(
  responses: Record<string, PlacementResponse>,
): Promise<{ error: string } | undefined> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You need to be signed in." };
  }

  const { data: assessment } = await supabase
    .from("assessments")
    .select("id")
    .eq("type", "placement")
    .eq("status", "published")
    .order("version", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!assessment) {
    return { error: "Placement isn't available yet." };
  }

  const { data: questions } = await supabase
    .from("assessment_questions")
    .select("id, skill, target_cefr_level, payload")
    .eq("assessment_id", assessment.id);

  if (!questions || questions.length === 0) {
    return { error: "Placement isn't available yet." };
  }

  const { data: attempt, error: attemptError } = await supabase
    .from("assessment_attempts")
    .insert({
      user_id: user.id,
      assessment_id: assessment.id,
      status: "completed",
      completed_at: new Date().toISOString(),
    })
    .select("id")
    .single();

  if (attemptError || !attempt) {
    return { error: attemptError?.message ?? "Could not record your attempt." };
  }

  const bySkill: Record<string, { targetLevel: CefrLevel; correct: boolean }[]> = {};

  for (const question of questions) {
    const payload = question.payload as unknown as AssessmentQuestionPayload;
    const response = responses[question.id];
    const correct = isPlacementResponseCorrect(payload, response);

    await supabase.from("assessment_responses").insert({
      attempt_id: attempt.id,
      question_id: question.id,
      response: response ?? {},
      is_correct: correct,
      score: correct ? 1 : 0,
    });

    (bySkill[question.skill] ??= []).push({
      targetLevel: question.target_cefr_level as CefrLevel,
      correct,
    });
  }

  const skillLevels: Partial<Record<string, CefrLevel>> = {};
  for (const [skill, skillQuestions] of Object.entries(bySkill)) {
    skillLevels[skill] = scoreSkill(skillQuestions).level;
  }

  const overall = overallLevel(Object.values(skillLevels) as CefrLevel[]);

  await supabase.from("assessment_results").insert({
    attempt_id: attempt.id,
    user_id: user.id,
    overall_level: overall,
    reading_level: skillLevels.reading ?? null,
    listening_level: skillLevels.listening ?? null,
    grammar_level: skillLevels.grammar ?? null,
    vocabulary_level: skillLevels.vocabulary ?? null,
  });

  for (const [skill, level] of Object.entries(skillLevels)) {
    await supabase.from("user_skill_levels").upsert(
      {
        user_id: user.id,
        skill,
        cefr_level: level,
        source: "placement",
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id,skill" },
    );
  }

  redirect("/placement/results");
}
