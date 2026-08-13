import Link from "next/link";
import { requireAdmin } from "@/lib/auth/require-admin";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();

  return (
    <div className="flex flex-1 flex-col">
      <div className="border-b border-border bg-muted/40 px-6 py-3">
        <nav className="flex items-center gap-4 text-sm">
          <span className="font-medium text-muted-foreground">Admin</span>
          <Link href="/admin/courses" className="hover:underline">
            Courses
          </Link>
          <Link href="/admin/assessments" className="hover:underline">
            Assessments
          </Link>
          <Link href="/dashboard" className="ml-auto text-muted-foreground hover:underline">
            Back to app
          </Link>
        </nav>
      </div>
      <div className="flex flex-1 flex-col px-6 py-8">{children}</div>
    </div>
  );
}
