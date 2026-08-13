import { deleteContentItem } from "./content-items-actions";

type ContentItem = {
  id: string;
  type: string;
  text_content: string | null;
  media_assets: { storage_path: string; mime_type: string | null } | null;
};

export function ContentItemsList({
  lessonId,
  items,
}: {
  lessonId: string;
  items: ContentItem[];
}) {
  if (items.length === 0) {
    return <p className="text-sm text-muted-foreground">No content items yet.</p>;
  }

  return (
    <div className="flex flex-col divide-y divide-border rounded-lg border border-border">
      {items.map((item) => (
        <div key={item.id} className="flex items-center justify-between gap-4 px-4 py-3 text-sm">
          <div className="flex min-w-0 flex-col">
            <span className="font-medium capitalize">{item.type.replace("_", " ")}</span>
            <span className="truncate text-muted-foreground">
              {item.text_content
                ? item.text_content.slice(0, 80)
                : (item.media_assets?.storage_path ?? "—")}
            </span>
          </div>
          <form action={deleteContentItem.bind(null, lessonId, item.id)}>
            <button type="submit" className="text-destructive hover:underline">
              Delete
            </button>
          </form>
        </div>
      ))}
    </div>
  );
}
