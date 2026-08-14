import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { createServiceRoleClient } from "@/lib/supabase/service-role";
import { ensureLessonStarted } from "@/lib/lesson/progress";
import { ContentCore, type RenderableContentItem } from "@/components/lesson/content-core";
import { CompleteLessonButton } from "@/components/lesson/complete-lesson-button";
import {
  ActivityPlayer,
  type PlayableActivity,
  type PlayableQuestion,
} from "@/components/activity/activity-player";
import { WritingActivity } from "@/components/writing/writing-activity";
import { SpeakingActivity } from "@/components/speaking/speaking-activity";
import { CoachChat } from "@/components/coach/coach-chat";
import { LevelBadge } from "@/components/ui/badge";

const PLAYABLE_QUESTION_TYPES = new Set([
  "multiple_choice",
  "true_false",
  "fill_blank",
  "ordering",
]);

type RawContentItem = {
  id: string;
  type: string;
  text_content: string | null;
  media_assets: { storage_path: string } | { storage_path: string }[] | null;
};

function toRenderableItem(
  supabase: SupabaseClient,
  item: RawContentItem,
): RenderableContentItem | null {
  if (item.type === "transcript" || item.type === "reading_passage") {
    if (!item.text_content) return null;
    return { id: item.id, type: item.type, text: item.text_content };
  }

  const mediaAsset = Array.isArray(item.media_assets)
    ? item.media_assets[0]
    : item.media_assets;
  if (!mediaAsset) return null;

  if (item.type === "video" || item.type === "audio" || item.type === "image") {
    const { data: publicUrl } = supabase.storage
      .from("lesson-media")
      .getPublicUrl(mediaAsset.storage_path);
    return { id: item.id, type: item.type, mediaUrl: publicUrl.publicUrl };
  }

  return null;
}

export async function generateMetadata(
  props: PageProps<"/lesson/[lessonSlug]">,
): Promise<Metadata> {
  const { lessonSlug } = await props.params;
  return { title: `${lessonSlug} — Teacher Academy` };
}

export default async function LessonPage(
  props: PageProps<"/lesson/[lessonSlug]">,
) {
  const { lessonSlug } = await props.params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: lesson } = await supabase
    .from("lessons")
    .select(
      "id, title, objective, cefr_level, primary_skill, estimated_minutes, unit_id, units(slug, title)",
    )
    .eq("slug", lessonSlug)
    .eq("status", "published")
    .single();

  if (!lesson) {
    notFound();
  }

  await ensureLessonStarted(supabase, user.id, lesson.id);

  const { data: contentItems } = await supabase
    .from("content_items")
    .select("id, type, text_content, media_assets(storage_path, type)")
    .eq("lesson_id", lesson.id)
    .order("order_index", { ascending: true });

  const { data: progress } = await supabase
    .from("lesson_progress")
    .select("status")
    .eq("user_id", user.id)
    .eq("lesson_id", lesson.id)
    .maybeSingle();

  const renderableItems: RenderableContentItem[] = (contentItems ?? [])
    .map((item) => toRenderableItem(supabase, item))
    .filter((item): item is RenderableContentItem => item !== null);

  // question_options is admin-only under RLS (migration 15 — is_correct
  // can't be hidden per-column from a row a learner's own session can
  // otherwise read), so rendering the options at all requires the
  // service-role client here. Deliberately never selects is_correct or
  // feedback — those only get read server-side, inside
  // submitActivityAttempt, after the learner submits. See
  // src/lib/activity/submit-attempt.ts.
  const { data: activities } = await createServiceRoleClient()
    .from("activities")
    .select(
      "id, type, skill, instructions, order_index, questions(id, prompt, type, order_index, question_options(id, text, order_index))",
    )
    .eq("lesson_id", lesson.id)
    .eq("status", "published")
    .order("order_index", { ascending: true });

  const writingActivities = (activities ?? []).filter((a) => a.type === "writing");
  const speakingActivities = (activities ?? []).filter((a) => a.type === "speaking");
  const rolePlayActivities = (activities ?? []).filter((a) => a.type === "role_play");

  const playableActivities: PlayableActivity[] = (activities ?? [])
    .filter((a) => a.type !== "writing" && a.type !== "speaking" && a.type !== "role_play")
    .map((activity) => {
      const questions = (activity.questions ?? [])
        .filter((q) => PLAYABLE_QUESTION_TYPES.has(q.type))
        .sort((a, b) => a.order_index - b.order_index)
        .map((q): PlayableQuestion => ({
          id: q.id,
          prompt: q.prompt,
          type: q.type as PlayableQuestion["type"],
          options: (q.question_options ?? [])
            .slice()
            .sort((a, b) => a.order_index - b.order_index)
            .map((o) => ({ id: o.id, text: o.text })),
        }));

      return {
        id: activity.id,
        type: activity.type,
        skill: activity.skill,
        instructions: activity.instructions,
        questions,
      };
    });

  const unit = lesson.units as unknown as { slug: string; title: string } | null;
  const playableWithQuestions = playableActivities.filter((a) => a.questions.length > 0);

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-10 px-6 py-12">
      <div className="flex flex-col gap-2">
        {unit && (
          <Link
            href={`/explore/${unit.slug}`}
            className="text-sm text-muted-foreground hover:underline"
          >
            ← {unit.title}
          </Link>
        )}
        <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
          <LevelBadge level={lesson.cefr_level} />
          <span className="capitalize">{lesson.primary_skill}</span>
          <span>·</span>
          <span>{lesson.estimated_minutes} min</span>
        </div>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{lesson.title}</h1>
        <p className="text-sm text-muted-foreground">{lesson.objective}</p>
      </div>

      <ContentCore items={renderableItems} />

      {playableWithQuestions.length > 0 && (
        <section className="flex flex-col gap-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Practice
          </h2>
          <div className="flex flex-col gap-6">
            {playableWithQuestions.map((activity) => (
              <ActivityPlayer key={activity.id} activity={activity} />
            ))}
          </div>
        </section>
      )}

      {writingActivities.length > 0 && (
        <section className="flex flex-col gap-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Writing Practice
          </h2>
          <div className="flex flex-col gap-6">
            {writingActivities.map((activity) => (
              <WritingActivity
                key={activity.id}
                activityId={activity.id}
                prompt={activity.instructions}
              />
            ))}
          </div>
        </section>
      )}

      {speakingActivities.length > 0 && (
        <section className="flex flex-col gap-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Speaking Practice
          </h2>
          <div className="flex flex-col gap-6">
            {speakingActivities.map((activity) => (
              <SpeakingActivity
                key={activity.id}
                activityId={activity.id}
                userId={user.id}
                prompt={activity.instructions}
              />
            ))}
          </div>
        </section>
      )}

      {rolePlayActivities.length > 0 && (
        <section className="flex flex-col gap-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Role-Play with the AI Coach
          </h2>
          <div className="flex flex-col gap-6">
            {rolePlayActivities.map((activity) => (
              <CoachChat
                key={activity.id}
                activityId={activity.id}
                prompt={activity.instructions}
              />
            ))}
          </div>
        </section>
      )}

      <CompleteLessonButton
        lessonId={lesson.id}
        completed={progress?.status === "completed"}
      />
    </div>
  );
}
