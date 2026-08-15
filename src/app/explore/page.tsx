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

type UnitStatus = "not_started" | "in_progress" | "completed";

type LessonRow = { id: string; unit_id: string; title: string; cefr_level: string };

const STATUSES: { value: UnitStatus | undefined; label: string }[] = [
  { value: undefined, label: "All" },
  { value: "not_started", label: "Not started" },
  { value: "in_progress", label: "In progress" },
  { value: "completed", label: "Completed" },
];

function buildHref(params: {
  track?: string;
  status?: string;
  q?: string;
}): string {
  const search = new URLSearchParams();
  if (params.track) search.set("track", params.track);
  if (params.status) search.set("status", params.status);
  if (params.q) search.set("q", params.q);
  const qs = search.toString();
  return qs ? `/explore?${qs}` : "/explore";
}

export default async function ExplorePage(props: PageProps<"/explore">) {
  const params = await props.searchParams;
  const activeTrack = typeof params.track === "string" ? params.track : undefined;
  const activeStatus =
    typeof params.status === "string" ? (params.status as UnitStatus) : undefined;
  const query = typeof params.q === "string" ? params.q.trim() : "";

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let unitsQuery = supabase
    .from("units")
    .select("id, slug, title, description, track")
    .eq("status", "published")
    .order("order_index", { ascending: true });

  if (activeTrack) {
    unitsQuery = unitsQuery.eq("track", activeTrack);
  }

  const { data: units } = await unitsQuery;

  const { data: lessons } = units && units.length > 0
    ? await supabase
        .from("lessons")
        .select("id, unit_id, title, cefr_level")
        .eq("status", "published")
        .in("unit_id", units.map((u) => u.id))
    : { data: null };

  const { data: progressRows } = user && lessons && lessons.length > 0
    ? await supabase
        .from("lesson_progress")
        .select("lesson_id, status")
        .eq("user_id", user.id)
        .in("lesson_id", lessons.map((l) => l.id))
    : { data: null };

  const progressByLesson = new Map(
    (progressRows ?? []).map((row) => [row.lesson_id, row.status]),
  );

  const levelRangeByUnit = new Map<string, { min: string; max: string }>();
  const lessonsByUnit = new Map<string, LessonRow[]>();
  for (const lesson of lessons ?? []) {
    const order = CEFR_ORDER[lesson.cefr_level] ?? 0;
    const existing = levelRangeByUnit.get(lesson.unit_id);
    if (!existing) {
      levelRangeByUnit.set(lesson.unit_id, { min: lesson.cefr_level, max: lesson.cefr_level });
    } else {
      if (order < (CEFR_ORDER[existing.min] ?? 0)) existing.min = lesson.cefr_level;
      if (order > (CEFR_ORDER[existing.max] ?? 0)) existing.max = lesson.cefr_level;
    }
    const group = lessonsByUnit.get(lesson.unit_id) ?? [];
    group.push(lesson);
    lessonsByUnit.set(lesson.unit_id, group);
  }

  function unitStatus(unitId: string): UnitStatus {
    const unitLessons = lessonsByUnit.get(unitId) ?? [];
    if (unitLessons.length === 0) return "not_started";
    const statuses = unitLessons.map((l) => progressByLesson.get(l.id) ?? "not_started");
    if (statuses.every((s) => s === "completed")) return "completed";
    if (statuses.some((s) => s === "completed" || s === "in_progress")) return "in_progress";
    return "not_started";
  }

  const lowerQuery = query.toLowerCase();
  const filteredUnits = (units ?? []).filter((unit) => {
    if (activeStatus && unitStatus(unit.id) !== activeStatus) return false;
    if (!lowerQuery) return true;
    if (unit.title.toLowerCase().includes(lowerQuery)) return true;
    if (unit.description?.toLowerCase().includes(lowerQuery)) return true;
    const unitLessons = lessonsByUnit.get(unit.id) ?? [];
    return unitLessons.some((l) => l.title.toLowerCase().includes(lowerQuery));
  });

  return (
    <div className="flex flex-1 flex-col gap-8 px-6 py-12">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Explore</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Browse by topic — pick whatever&apos;s useful right now.
        </p>
      </div>

      <form action="/explore" method="get" className="flex max-w-sm gap-2">
        {activeTrack && <input type="hidden" name="track" value={activeTrack} />}
        {activeStatus && <input type="hidden" name="status" value={activeStatus} />}
        <input
          type="search"
          name="q"
          defaultValue={query}
          placeholder="Search units and lessons..."
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </form>

      <div className="flex flex-col gap-3">
        <div className="flex gap-2 border-b border-border pb-3 text-sm">
          {TRACKS.map((t) => (
            <Link
              key={t.label}
              href={buildHref({ track: t.value, status: activeStatus, q: query })}
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
        <div className="flex gap-2 text-sm">
          {STATUSES.map((s) => (
            <Link
              key={s.label}
              href={buildHref({ track: activeTrack, status: s.value, q: query })}
              className={
                activeStatus === s.value
                  ? "rounded-full bg-accent px-3 py-1.5 font-medium text-accent-foreground"
                  : "rounded-full px-3 py-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
              }
            >
              {s.label}
            </Link>
          ))}
        </div>
      </div>

      {filteredUnits.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          {units && units.length > 0
            ? "No units match your search or filters."
            : "No published units yet. Check back soon."}
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredUnits.map((unit) => (
            <UnitCard key={unit.id} unit={unit} levelRange={levelRangeByUnit.get(unit.id)} />
          ))}
        </div>
      )}
    </div>
  );
}
