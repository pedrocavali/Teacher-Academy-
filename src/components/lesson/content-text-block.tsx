const LABELS: Record<string, string> = {
  transcript: "Transcript",
  reading_passage: "Reading",
};

export function ContentTextBlock({
  type,
  text,
}: {
  type: string;
  text: string;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-primary-soft/40 p-6">
      <span className="text-xs font-semibold uppercase tracking-wide text-primary">
        {LABELS[type] ?? type}
      </span>
      <p className="whitespace-pre-wrap text-base leading-8 text-foreground">{text}</p>
    </div>
  );
}
