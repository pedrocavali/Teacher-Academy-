import type { Metadata } from "next";
import Link from "next/link";
import { NewAssessmentForm } from "./assessment-form";

export const metadata: Metadata = {
  title: "New assessment — Teacher Academy Admin",
};

export default function NewAssessmentPage() {
  return (
    <div className="flex flex-col gap-6">
      <Link href="/admin/assessments" className="text-sm text-muted-foreground hover:underline">
        ← Assessments
      </Link>
      <h1 className="text-2xl font-semibold tracking-tight">New assessment</h1>
      <NewAssessmentForm />
    </div>
  );
}
