import Image from "next/image";
import { VideoPlayer } from "@/components/lesson/video-player";
import { AudioPlayer } from "@/components/lesson/audio-player";
import { ContentTextBlock } from "@/components/lesson/content-text-block";

export type RenderableContentItem =
  | { id: string; type: "transcript" | "reading_passage"; text: string }
  | { id: string; type: "video" | "audio" | "image"; mediaUrl: string };

export function ContentCore({ items }: { items: RenderableContentItem[] }) {
  if (items.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No content added to this lesson yet.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {items.map((item) => {
        switch (item.type) {
          case "video":
            return <VideoPlayer key={item.id} src={item.mediaUrl} />;
          case "audio":
            return <AudioPlayer key={item.id} src={item.mediaUrl} />;
          case "image":
            return (
              <div
                key={item.id}
                className="relative h-80 w-full overflow-hidden rounded-lg border border-border"
              >
                <Image
                  src={item.mediaUrl}
                  alt=""
                  fill
                  className="object-contain"
                />
              </div>
            );
          case "transcript":
          case "reading_passage":
            return (
              <ContentTextBlock key={item.id} type={item.type} text={item.text} />
            );
        }
      })}
    </div>
  );
}
