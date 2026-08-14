import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { LessonCard } from "@/components/catalog/lesson-card";
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

      {!lessons || lessons.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No published lessons in this unit yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {lessons.map((lesson) => (
            <LessonCard key={lesson.id} lesson={lesson} />
          ))}
        </div>
      )}
    </div>
  );
}
