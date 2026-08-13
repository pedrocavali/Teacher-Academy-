import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { StatusControls } from "@/components/admin/status-controls";
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
    </div>
  );
}
