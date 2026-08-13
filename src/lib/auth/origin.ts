import { headers } from "next/headers";

// Server Actions are invoked via a same-origin POST from the browser, so the
// incoming request carries the origin the user is actually on (localhost in
// dev, the real domain in prod) — no NEXT_PUBLIC_SITE_URL env var to keep in sync.
export async function getOrigin() {
  const headerList = await headers();
  return headerList.get("origin") ?? "http://localhost:3000";
}
