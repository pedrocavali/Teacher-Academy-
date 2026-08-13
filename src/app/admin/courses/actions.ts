"use server";

import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/require-admin";

export type CourseFormState = { error: string } | null;

export async function createCourse(
  _prevState: CourseFormState,
  formData: FormData,
): Promise<CourseFormState> {
  const { supabase } = await requireAdmin();

  const slug = formData.get("slug") as string;
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;

  const { data, error } = await supabase
    .from("courses")
    .insert({ slug, title, description: description || null })
    .select("id")
    .single();

  if (error) {
    return { error: error.message };
  }

  redirect(`/admin/courses/${data.id}`);
}
