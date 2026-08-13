import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { UnitCard } from "@/components/catalog/unit-card";

export const metadata: Metadata = {
  title: "Explore — Teacher Academy",
};

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

  return (
    <div className="flex flex-1 flex-col gap-8 px-6 py-12">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Explore</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Browse by topic — pick whatever&apos;s useful right now.
        </p>
      </div>

      <div className="flex gap-4 border-b border-border pb-2 text-sm">
        {TRACKS.map((t) => (
          <Link
            key={t.label}
            href={t.value ? `/explore?track=${t.value}` : "/explore"}
            className={
              activeTrack === t.value
                ? "font-medium text-foreground"
                : "text-muted-foreground hover:text-foreground"
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
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {units.map((unit) => (
            <UnitCard key={unit.id} unit={unit} />
          ))}
        </div>
      )}
    </div>
  );
}
