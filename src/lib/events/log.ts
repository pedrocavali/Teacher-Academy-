import type { SupabaseClient } from "@supabase/supabase-js";

// Analytics is best-effort (Blueprint Section 33/18) — a logging failure
// must never break the learner-facing action that triggered it, so errors
// are swallowed rather than surfaced or thrown.
export async function logEvent(
  supabase: SupabaseClient,
  input: {
    userId: string;
    eventType: string;
    entityType?: string;
    entityId?: string;
    properties?: Record<string, unknown>;
  },
) {
  try {
    await supabase.from("events").insert({
      user_id: input.userId,
      event_type: input.eventType,
      entity_type: input.entityType ?? null,
      entity_id: input.entityId ?? null,
      properties: input.properties ?? {},
    });
  } catch {
    // Swallowed intentionally — see comment above.
  }
}
