import Link from "next/link";
import { Card } from "@/components/ui/card";

const TRACK_LABELS: Record<string, string> = {
  general: "General English",
  teachers: "English for Teachers",
};

export function UnitCard({
  unit,
}: {
  unit: {
    slug: string;
    title: string;
    description: string | null;
    track: string;
  };
}) {
  return (
    <Link href={`/explore/${unit.slug}`}>
      <Card className="flex h-full flex-col gap-2 transition-colors hover:border-primary">
        <span className="text-xs font-medium uppercase tracking-wide text-primary">
          {TRACK_LABELS[unit.track] ?? unit.track}
        </span>
        <h3 className="text-lg font-semibold tracking-tight">{unit.title}</h3>
        {unit.description && (
          <p className="text-sm text-muted-foreground">{unit.description}</p>
        )}
      </Card>
    </Link>
  );
}
