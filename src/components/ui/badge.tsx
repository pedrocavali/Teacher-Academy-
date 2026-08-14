import { type ComponentProps } from "react";
import { levelBadgeClasses } from "@/lib/curriculum/level-style";

export function Badge({ className = "", ...props }: ComponentProps<"span">) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${className}`}
      {...props}
    />
  );
}

export function LevelBadge({ level }: { level: string }) {
  return <Badge className={levelBadgeClasses(level)}>{level}</Badge>;
}
