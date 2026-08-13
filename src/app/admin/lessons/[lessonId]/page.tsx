import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { buttonVariants } from "@/components/ui/button";
import { StatusBadge } from "@/components/admin/status-badge";
import { StatusControls } from "@/components/admin/status-controls";
import { TypeChip } from "@/components/admin/type-chip";
import { LessonEditForm } from "./lesson-edit-form";
import { ContentItemForm } from "./content-item-form";
import { ContentItemsList } from "./content-items-list";

export const metadata: Metadata = {
  title: "Edit lesson — Teacher Academy Admin",
};

export default async function AdminLessonDetailPage(
  props: PageProps<"/admin/lessons/[lessonId]">,
) {
  const { lessonId } = await props.params;
  const supabase = await createClient();

  const { data: lesson } = await supabase
    .from("lessons")
    .select(
      "id, title, slug, objective, cefr_level, primary_skill, estimated_minutes, order_index, status, unit_id, units(id, title)",
    )
    .eq("id", lessonId)
    .single();

  if (!lesson) {
    notFound();
  }

  const { data: contentItems } = await supabase
    .from("content_items")
    .select("id, type, text_content, media_assets(storage_path, mime_type)")
    .eq("lesson_id", lessonId)
    .order("order_index", { ascending: true });

  const { data: activities } = await supabase
    .from("activities")
    .select("id, type, skill, status")
    .eq("lesson_id", lessonId)
    .order("order_index", { ascending: true });

  const unit = lesson.units as unknown as { id: string; title: string } | null;

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-4">
        {unit && (
          <Link
            href={`/admin/units/${unit.id}`}
            className="text-sm text-muted-foreground hover:underline"
          >
            ← {unit.title}
          </Link>
        )}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold tracking-tight">{lesson.title}</h1>
          <StatusControls contentType="lesson" id={lesson.id} status={lesson.status} />
        </div>
        <LessonEditForm lessonId={lesson.id} lesson={lesson} />
      </div>

      <div className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold tracking-tight">Content core</h2>
        <ContentItemsList
          lessonId={lesson.id}
          items={
            (contentItems ?? []).map((item) => ({
              ...item,
              media_assets: item.media_assets as unknown as
                | { storage_path: string; mime_type: string | null }
                | null,
            }))
          }
        />
        <ContentItemForm lessonId={lesson.id} />
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold tracking-tight">Activities</h2>
          <Link
            href={`/admin/activities/new?lessonId=${lesson.id}`}
            className={buttonVariants({ size: "sm" })}
          >
            New activity
          </Link>
        </div>

        {!activities || activities.length === 0 ? (
          <p className="text-sm text-muted-foreground">No activities yet.</p>
        ) : (
          <div className="flex flex-col divide-y divide-border rounded-lg border border-border">
            {activities.map((activity) => (
              <Link
                key={activity.id}
                href={`/admin/activities/${activity.id}`}
                className="flex items-center justify-between px-4 py-3 text-sm hover:bg-muted/50"
              >
                <div className="flex items-center gap-2">
                  <TypeChip>{activity.type.replace("_", " ")}</TypeChip>
                  <span className="capitalize text-muted-foreground">{activity.skill}</span>
                </div>
                <StatusBadge status={activity.status} />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
