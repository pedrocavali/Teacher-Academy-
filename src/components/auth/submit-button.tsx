"use client";

import { useFormStatus } from "react-dom";
import { buttonVariants } from "@/components/ui/button";

export function SubmitButton({
  children,
  pendingLabel,
}: {
  children: React.ReactNode;
  pendingLabel: string;
}) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={buttonVariants({ size: "lg", className: "w-full" })}
    >
      {pending ? pendingLabel : children}
    </button>
  );
}
