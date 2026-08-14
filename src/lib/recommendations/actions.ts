"use server";

import { createClient } from "@/lib/supabase/server";

export async function markRecommendationClicked(recommendationId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  await supabase
    .from("recommendations")
    .update({ clicked_at: new Date().toISOString() })
    .eq("id", recommendationId)
    .eq("user_id", user.id)
    .is("clicked_at", null);
}
