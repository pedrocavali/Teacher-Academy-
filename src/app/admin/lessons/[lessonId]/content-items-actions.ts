"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/require-admin";

export type ContentItemFormState = { error: string } | null;

const TEXT_TYPES = new Set(["transcript", "reading_passage"]);
const MEDIA_TYPES = new Set(["video", "audio", "image"]);

export async function addContentItem(
  lessonId: string,
  _prevState: ContentItemFormState,
  formData: FormData,
): Promise<ContentItemFormState> {
  const { supabase, user } = await requireAdmin();

  const type = formData.get("type") as string;

  if (TEXT_TYPES.has(type)) {
    const textContent = formData.get("textContent") as string;
    if (!textContent?.trim()) {
      return { error: "Text content is required." };
    }

    const { error } = await supabase
      .from("content_items")
      .insert({ lesson_id: lessonId, type, text_content: textContent });

    if (error) return { error: error.message };
    revalidatePath(`/admin/lessons/${lessonId}`);
    return null;
  }

  if (MEDIA_TYPES.has(type)) {
    const file = formData.get("file") as File | null;
    if (!file || file.size === 0) {
      return { error: "A file is required." };
    }

    const extension = file.name.split(".").pop();
    const path = `${lessonId}/${crypto.randomUUID()}${extension ? `.${extension}` : ""}`;

    const { error: uploadError } = await supabase.storage
      .from("lesson-media")
      .upload(path, file, { contentType: file.type });

    if (uploadError) {
      return { error: uploadError.message };
    }

    const { data: mediaAsset, error: mediaError } = await supabase
      .from("media_assets")
      .insert({
        storage_path: path,
        type,
        mime_type: file.type,
        uploaded_by: user.id,
      })
      .select("id")
      .single();

    if (mediaError) {
      return { error: mediaError.message };
    }

    const { error: contentItemError } = await supabase
      .from("content_items")
      .insert({ lesson_id: lessonId, type, media_asset_id: mediaAsset.id });

    if (contentItemError) {
      return { error: contentItemError.message };
    }

    revalidatePath(`/admin/lessons/${lessonId}`);
    return null;
  }

  return { error: "Unknown content item type." };
}

export async function deleteContentItem(lessonId: string, contentItemId: string) {
  const { supabase } = await requireAdmin();
  await supabase.from("content_items").delete().eq("id", contentItemId);
  revalidatePath(`/admin/lessons/${lessonId}`);
}
