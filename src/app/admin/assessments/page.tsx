import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { buttonVariants } from "@/components/ui/button";
import { StatusBadge } from "@/components/admin/status-badge";

export const metadata: Metadata = {
  title: "Assessments — Teacher Academy Admin",
};

export default async function AdminAssessmentsPage() {
  const supabase = await createClient();
  const { data: assessments } = await supabase
    .from("assessments")
    .select("id, title, version, status")
    .order("version", { ascending: false });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Assessments</h1>
        <Link href="/admin/assessments/new" className={buttonVariants({ size: "sm" })}>
          New assessment
        </Link>
      </div>

      {!assessments || assessments.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No assessments yet. The placement diagnostic needs one published
          assessment to work.
        </p>
      ) : (
        <div className="flex flex-col divide-y divide-border rounded-lg border border-border">
          {assessments.map((assessment) => (
            <Link
              key={assessment.id}
              href={`/admin/assessments/${assessment.id}`}
              className="flex items-center justify-between px-4 py-3 text-sm hover:bg-muted/50"
            >
              <div className="flex flex-col">
                <span className="font-medium">{assessment.title}</span>
                <span className="text-muted-foreground">v{assessment.version}</span>
              </div>
              <StatusBadge status={assessment.status} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
