interface VideoIdComponentProps {
  videoId: string | undefined;
}

export function VideoIdComponent({ videoId }: VideoIdComponentProps) {
  if (!videoId) {
    return null;
  }

  return (
    <p className="font-mono text-[10px] leading-snug tracking-wide text-accent">
      <span className="text-foreground-muted">ID </span>
      {videoId}
    </p>
  );
}
