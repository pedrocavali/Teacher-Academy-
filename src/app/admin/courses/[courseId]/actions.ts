"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/require-admin";

export type CourseFormState = { error: string } | { success: true } | null;

export async function updateCourse(
  courseId: string,
  _prevState: CourseFormState,
  formData: FormData,
): Promise<CourseFormState> {
  const { supabase } = await requireAdmin();

  const slug = formData.get("slug") as string;
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;

  const { error } = await supabase
    .from("courses")
    .update({ slug, title, description: description || null })
    .eq("id", courseId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/admin/courses/${courseId}`);
  return { success: true };
}
