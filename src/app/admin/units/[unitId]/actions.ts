"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/require-admin";

export type UnitFormState = { error: string } | { success: true } | null;

export async function updateUnit(
  unitId: string,
  _prevState: UnitFormState,
  formData: FormData,
): Promise<UnitFormState> {
  const { supabase } = await requireAdmin();

  const slug = formData.get("slug") as string;
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const track = formData.get("track") as string;
  const orderIndex = Number(formData.get("orderIndex") ?? 0);

  const { error } = await supabase
    .from("units")
    .update({
      slug,
      title,
      description: description || null,
      track,
      order_index: orderIndex,
    })
    .eq("id", unitId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/admin/units/${unitId}`);
  return { success: true };
}
