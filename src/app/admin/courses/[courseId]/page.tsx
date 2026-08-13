import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { buttonVariants } from "@/components/ui/button";
import { StatusBadge } from "@/components/admin/status-badge";
import { StatusControls } from "@/components/admin/status-controls";
import { CourseEditForm } from "./course-edit-form";

export const metadata: Metadata = {
  title: "Edit course — Teacher Academy Admin",
};

export default async function AdminCourseDetailPage(
  props: PageProps<"/admin/courses/[courseId]">,
) {
  const { courseId } = await props.params;
  const supabase = await createClient();

  const { data: course } = await supabase
    .from("courses")
    .select("id, title, slug, description, status")
    .eq("id", courseId)
    .single();

  if (!course) {
    notFound();
  }

  const { data: units } = await supabase
    .from("units")
    .select("id, title, track, status")
    .eq("course_id", courseId)
    .order("order_index", { ascending: true });

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-4">
        <Link href="/admin/courses" className="text-sm text-muted-foreground hover:underline">
          ← Courses
        </Link>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold tracking-tight">{course.title}</h1>
          <StatusControls contentType="course" id={course.id} status={course.status} />
        </div>
        <CourseEditForm courseId={course.id} course={course} />
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold tracking-tight">Units</h2>
          <Link
            href={`/admin/units/new?courseId=${course.id}`}
            className={buttonVariants({ size: "sm" })}
          >
            New unit
          </Link>
        </div>

        {!units || units.length === 0 ? (
          <p className="text-sm text-muted-foreground">No units yet.</p>
        ) : (
          <div className="flex flex-col divide-y divide-border rounded-lg border border-border">
            {units.map((unit) => (
              <Link
                key={unit.id}
                href={`/admin/units/${unit.id}`}
                className="flex items-center justify-between px-4 py-3 text-sm hover:bg-muted/50"
              >
                <div className="flex flex-col">
                  <span className="font-medium">{unit.title}</span>
                  <span className="text-muted-foreground capitalize">{unit.track}</span>
                </div>
                <StatusBadge status={unit.status} />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
