import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { UnitCard } from "@/components/catalog/unit-card";
import { CEFR_LEVELS } from "@/lib/curriculum/constants";

export const metadata: Metadata = {
  title: "Explore — Teacher Academy",
};

const CEFR_ORDER: Record<string, number> = Object.fromEntries(
  CEFR_LEVELS.map((level, i) => [level, i]),
);

const TRACKS = [
  { value: undefined, label: "All" },
  { value: "general", label: "General English" },
  { value: "teachers", label: "English for Teachers" },
] as const;

export default async function ExplorePage(props: PageProps<"/explore">) {
  const { track } = await props.searchParams;
  const activeTrack = typeof track === "string" ? track : undefined;

  const supabase = await createClient();
  let query = supabase
    .from("units")
    .select("id, slug, title, description, track")
    .eq("status", "published")
    .order("order_index", { ascending: true });

  if (activeTrack) {
    query = query.eq("track", activeTrack);
  }

  const { data: units } = await query;

  const { data: lessons } = units && units.length > 0
    ? await supabase
        .from("lessons")
        .select("unit_id, cefr_level")
        .eq("status", "published")
        .in("unit_id", units.map((u) => u.id))
    : { data: null };

  const levelRangeByUnit = new Map<string, { min: string; max: string }>();
  for (const lesson of lessons ?? []) {
    const order = CEFR_ORDER[lesson.cefr_level] ?? 0;
    const existing = levelRangeByUnit.get(lesson.unit_id);
    if (!existing) {
      levelRangeByUnit.set(lesson.unit_id, { min: lesson.cefr_level, max: lesson.cefr_level });
      continue;
    }
    if (order < (CEFR_ORDER[existing.min] ?? 0)) existing.min = lesson.cefr_level;
    if (order > (CEFR_ORDER[existing.max] ?? 0)) existing.max = lesson.cefr_level;
  }

  return (
    <div className="flex flex-1 flex-col gap-8 px-6 py-12">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Explore</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Browse by topic — pick whatever&apos;s useful right now.
        </p>
      </div>

      <div className="flex gap-2 border-b border-border pb-3 text-sm">
        {TRACKS.map((t) => (
          <Link
            key={t.label}
            href={t.value ? `/explore?track=${t.value}` : "/explore"}
            className={
              activeTrack === t.value
                ? "rounded-full bg-primary px-3 py-1.5 font-medium text-primary-foreground"
                : "rounded-full px-3 py-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
            }
          >
            {t.label}
          </Link>
        ))}
      </div>

      {!units || units.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No published units yet. Check back soon.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {units.map((unit) => (
            <UnitCard key={unit.id} unit={unit} levelRange={levelRangeByUnit.get(unit.id)} />
          ))}
        </div>
      )}
    </div>
  );
}
