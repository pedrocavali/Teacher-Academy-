export function AudioPlayer({ src }: { src: string }) {
  return <audio controls className="w-full" src={src} />;
}
