import { type ComponentProps } from "react";

export function Card({ className = "", ...props }: ComponentProps<"div">) {
  return (
    <div
      className={`rounded-lg border border-border bg-background p-6 ${className}`}
      {...props}
    />
  );
}
