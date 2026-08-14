import Image from "next/image";
import Link from "next/link";
import { Badge, LevelBadge } from "@/components/ui/badge";
import { unitCoverSrc } from "@/lib/curriculum/unit-cover";

const TRACK_LABELS: Record<string, string> = {
  general: "General English",
  teachers: "English for Teachers",
};

export function UnitCard({
  unit,
  levelRange,
}: {
  unit: {
    slug: string;
    title: string;
    description: string | null;
    track: string;
  };
  levelRange?: { min: string; max: string } | null;
}) {
  return (
    <Link href={`/explore/${unit.slug}`}>
      <div className="flex h-full flex-col overflow-hidden rounded-lg border border-border bg-background shadow-[var(--card-shadow)] transition-transform hover:-translate-y-0.5 hover:border-primary">
        <div className="relative h-36 w-full bg-muted">
          <Image
            src={unitCoverSrc(unit.slug)}
            alt=""
            fill
            className="object-cover"
          />
        </div>
        <div className="flex flex-1 flex-col gap-2 p-5">
          <div className="flex items-center gap-2">
            <Badge className="bg-primary-soft text-primary">
              {TRACK_LABELS[unit.track] ?? unit.track}
            </Badge>
            {levelRange && (
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                {levelRange.min === levelRange.max ? (
                  <LevelBadge level={levelRange.min} />
                ) : (
                  <>
                    <LevelBadge level={levelRange.min} />
                    <span>–</span>
                    <LevelBadge level={levelRange.max} />
                  </>
                )}
              </span>
            )}
          </div>
          <h3 className="text-lg font-semibold tracking-tight">{unit.title}</h3>
          {unit.description && (
            <p className="text-sm text-muted-foreground">{unit.description}</p>
          )}
        </div>
      </div>
    </Link>
  );
}
