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
    <div className="flex flex-col gap-2 rounded-lg border border-border p-4">
      <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {LABELS[type] ?? type}
      </span>
      <p className="whitespace-pre-wrap text-sm leading-relaxed">{text}</p>
    </div>
  );
}
