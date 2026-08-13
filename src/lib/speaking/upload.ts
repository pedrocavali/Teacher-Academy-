import { createClient } from "@/lib/supabase/client";

function extensionFor(mimeType: string): string {
  if (mimeType.includes("webm")) return "webm";
  if (mimeType.includes("mp4")) return "m4a";
  return "webm";
}

// Uploads directly from the browser rather than proxying the blob through a
// Server Action — RLS (speaking_recordings_insert_own) already enforces
// that the path's first folder segment matches the caller's own
// auth.uid(), so this is exactly as safe as a server-side upload would be,
// without a body-size-limited round trip through our own server first.
export async function uploadSpeakingRecording(
  userId: string,
  activityId: string,
  blob: Blob,
): Promise<{ path: string } | { error: string }> {
  const supabase = createClient();
  const path = `${userId}/${activityId}/${crypto.randomUUID()}.${extensionFor(blob.type)}`;

  const { error } = await supabase.storage
    .from("speaking-recordings")
    .upload(path, blob, { contentType: blob.type });

  if (error) {
    return { error: error.message };
  }

  return { path };
}
