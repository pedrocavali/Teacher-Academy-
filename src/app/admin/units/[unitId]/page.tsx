import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { buttonVariants } from "@/components/ui/button";
import { StatusBadge } from "@/components/admin/status-badge";
import { StatusControls } from "@/components/admin/status-controls";
import { UnitEditForm } from "./unit-edit-form";

export const metadata: Metadata = {
  title: "Edit unit — Teacher Academy Admin",
};

export default async function AdminUnitDetailPage(
  props: PageProps<"/admin/units/[unitId]">,
) {
  const { unitId } = await props.params;
  const supabase = await createClient();

  const { data: unit } = await supabase
    .from("units")
    .select("id, title, slug, description, track, order_index, status, course_id, courses(id, title)")
    .eq("id", unitId)
    .single();

  if (!unit) {
    notFound();
  }

  const { data: lessons } = await supabase
    .from("lessons")
    .select("id, title, cefr_level, primary_skill, status")
    .eq("unit_id", unitId)
    .order("order_index", { ascending: true });

  const course = unit.courses as unknown as { id: string; title: string } | null;

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-4">
        {course && (
          <Link
            href={`/admin/courses/${course.id}`}
            className="text-sm text-muted-foreground hover:underline"
          >
            ← {course.title}
          </Link>
        )}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold tracking-tight">{unit.title}</h1>
          <StatusControls contentType="unit" id={unit.id} status={unit.status} />
        </div>
        <UnitEditForm unitId={unit.id} unit={unit} />
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold tracking-tight">Lessons</h2>
          <Link
            href={`/admin/lessons/new?unitId=${unit.id}`}
            className={buttonVariants({ size: "sm" })}
          >
            New lesson
          </Link>
        </div>

        {!lessons || lessons.length === 0 ? (
          <p className="text-sm text-muted-foreground">No lessons yet.</p>
        ) : (
          <div className="flex flex-col divide-y divide-border rounded-lg border border-border">
            {lessons.map((lesson) => (
              <Link
                key={lesson.id}
                href={`/admin/lessons/${lesson.id}`}
                className="flex items-center justify-between px-4 py-3 text-sm hover:bg-muted/50"
              >
                <div className="flex flex-col">
                  <span className="font-medium">{lesson.title}</span>
                  <span className="text-muted-foreground">
                    {lesson.cefr_level} · {lesson.primary_skill}
                  </span>
                </div>
                <StatusBadge status={lesson.status} />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
