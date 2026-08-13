export function VideoPlayer({ src }: { src: string }) {
  return (
    <video controls className="w-full rounded-lg border border-border" src={src} />
  );
}
