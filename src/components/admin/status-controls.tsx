"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/admin/status-badge";
import {
  changeContentStatus,
  type ContentType,
} from "@/lib/admin/content-status";

const NEXT_STATUSES: Record<string, { label: string; to: string }[]> = {
  draft: [{ label: "Submit for review", to: "review" }],
  review: [
    { label: "Approve", to: "approved" },
    { label: "Send back to draft", to: "draft" },
  ],
  approved: [
    { label: "Publish", to: "published" },
    { label: "Send back to review", to: "review" },
  ],
  published: [{ label: "Unpublish", to: "draft" }],
};

export function StatusControls({
  contentType,
  id,
  status,
}: {
  contentType: ContentType;
  id: string;
  status: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const actions = NEXT_STATUSES[status] ?? [];

  return (
    <div className="flex flex-wrap items-center gap-2">
      <StatusBadge status={status} />
      {actions.map((action) => (
        <Button
          key={action.to}
          type="button"
          variant="secondary"
          size="sm"
          disabled={pending}
          onClick={() => {
            setError(null);
            startTransition(async () => {
              const result = await changeContentStatus(
                contentType,
                id,
                status,
                action.to,
              );
              if ("error" in result) {
                setError(result.error);
              } else {
                router.refresh();
              }
            });
          }}
        >
          {action.label}
        </Button>
      ))}
      {error && <span className="text-sm text-destructive">{error}</span>}
    </div>
  );
}
