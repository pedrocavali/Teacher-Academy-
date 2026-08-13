export function FormMessage({
  variant = "error",
  children,
}: {
  variant?: "error" | "status";
  children: React.ReactNode;
}) {
  return (
    <p
      className={`text-sm ${variant === "error" ? "text-destructive" : "text-foreground/80"}`}
      role={variant === "error" ? "alert" : "status"}
    >
      {children}
    </p>
  );
}
