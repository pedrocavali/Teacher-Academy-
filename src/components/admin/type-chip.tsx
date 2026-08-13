// Plain neutral chip for showing a type/category label (question type,
// activity type) — distinct from StatusBadge, which specifically colors the
// draft/review/approved/published pipeline states.
export function TypeChip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium capitalize text-muted-foreground">
      {children}
    </span>
  );
}
