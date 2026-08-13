"use server";

import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/require-admin";

export type UnitFormState = { error: string } | null;

export async function createUnit(
  _prevState: UnitFormState,
  formData: FormData,
): Promise<UnitFormState> {
  const { supabase } = await requireAdmin();

  const courseId = formData.get("courseId") as string;
  const slug = formData.get("slug") as string;
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const track = formData.get("track") as string;
  const orderIndex = Number(formData.get("orderIndex") ?? 0);

  const { data, error } = await supabase
    .from("units")
    .insert({
      course_id: courseId,
      slug,
      title,
      description: description || null,
      track,
      order_index: orderIndex,
    })
    .select("id")
    .single();

  if (error) {
    return { error: error.message };
  }

  redirect(`/admin/units/${data.id}`);
}
