import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { buttonVariants } from "@/components/ui/button";
import { StatusBadge } from "@/components/admin/status-badge";

export const metadata: Metadata = {
  title: "Courses — Teacher Academy Admin",
};

export default async function AdminCoursesPage() {
  const supabase = await createClient();
  const { data: courses } = await supabase
    .from("courses")
    .select("id, title, slug, status")
    .order("created_at", { ascending: false });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Courses</h1>
        <Link href="/admin/courses/new" className={buttonVariants({ size: "sm" })}>
          New course
        </Link>
      </div>

      {!courses || courses.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No courses yet. Create the first one to start building the
          catalog.
        </p>
      ) : (
        <div className="flex flex-col divide-y divide-border rounded-lg border border-border">
          {courses.map((course) => (
            <Link
              key={course.id}
              href={`/admin/courses/${course.id}`}
              className="flex items-center justify-between px-4 py-3 text-sm hover:bg-muted/50"
            >
              <div className="flex flex-col">
                <span className="font-medium">{course.title}</span>
                <span className="text-muted-foreground">{course.slug}</span>
              </div>
              <StatusBadge status={course.status} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
