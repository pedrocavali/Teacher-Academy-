import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { LessonPath, type PathLesson } from "@/components/catalog/lesson-path";
import { Badge } from "@/components/ui/badge";
import { unitCoverSrc } from "@/lib/curriculum/unit-cover";

const TRACK_LABELS: Record<string, string> = {
  general: "General English",
  teachers: "English for Teachers",
};

export async function generateMetadata(
  props: PageProps<"/explore/[unitSlug]">,
): Promise<Metadata> {
  const { unitSlug } = await props.params;
  return { title: `${unitSlug} — Teacher Academy` };
}

export default async function UnitDetailPage(
  props: PageProps<"/explore/[unitSlug]">,
) {
  const { unitSlug } = await props.params;
  const supabase = await createClient();

  const { data: unit } = await supabase
    .from("units")
    .select("id, slug, title, description, track")
    .eq("slug", unitSlug)
    .eq("status", "published")
    .single();

  if (!unit) {
    notFound();
  }

  const { data: lessons } = await supabase
    .from("lessons")
    .select("id, slug, title, objective, cefr_level, primary_skill, estimated_minutes")
    .eq("unit_id", unit.id)
    .eq("status", "published")
    .order("order_index", { ascending: true });

  const lessonIds = (lessons ?? []).map((l) => l.id);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [{ data: progressRows }, { data: activityRows }] = await Promise.all([
    user && lessonIds.length > 0
      ? supabase
          .from("lesson_progress")
          .select("lesson_id, status")
          .eq("user_id", user.id)
          .in("lesson_id", lessonIds)
      : Promise.resolve({ data: null }),
    lessonIds.length > 0
      ? supabase
          .from("activities")
          .select("lesson_id, skill")
          .eq("status", "published")
          .in("lesson_id", lessonIds)
      : Promise.resolve({ data: null }),
  ]);

  const progressByLesson = new Map(
    (progressRows ?? []).map((p) => [p.lesson_id, p.status as PathLesson["status"]]),
  );
  const skillsByLesson = new Map<string, Set<string>>();
  for (const row of activityRows ?? []) {
    const set = skillsByLesson.get(row.lesson_id) ?? new Set<string>();
    set.add(row.skill);
    skillsByLesson.set(row.lesson_id, set);
  }

  const pathLessons: PathLesson[] = (lessons ?? []).map((lesson) => ({
    ...lesson,
    status: progressByLesson.get(lesson.id) ?? "not_started",
    otherSkills: [...(skillsByLesson.get(lesson.id) ?? [])].filter(
      (skill) => skill !== lesson.primary_skill,
    ),
  }));

  return (
    <div className="flex flex-1 flex-col gap-8 px-6 py-12">
      <div className="flex flex-col gap-2">
        <Link href="/explore" className="text-sm text-muted-foreground hover:underline">
          ← Explore
        </Link>
      </div>

      <div className="overflow-hidden rounded-xl border border-border shadow-[var(--card-shadow)]">
        <div className="relative h-40 w-full bg-muted sm:h-56">
          <Image src={unitCoverSrc(unit.slug)} alt="" fill className="object-cover" />
        </div>
        <div className="flex flex-col gap-2 bg-background p-6">
          <Badge className="w-fit bg-primary-soft text-primary">
            {TRACK_LABELS[unit.track] ?? unit.track}
          </Badge>
          <h1 className="text-2xl font-semibold tracking-tight">{unit.title}</h1>
          {unit.description && (
            <p className="text-sm text-muted-foreground">{unit.description}</p>
          )}
        </div>
      </div>

      {pathLessons.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No published lessons in this unit yet.
        </p>
      ) : (
        <LessonPath lessons={pathLessons} />
      )}
    </div>
  );
}
