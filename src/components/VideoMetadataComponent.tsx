import { buildVideoMetadataRows } from "@/lib/video-metadata";
import { VideoMetadata } from "@/types/video-metadata";

interface VideoMetadataComponentProps {
  metadata: VideoMetadata | undefined;
  isLoading: boolean;
  // Two columns, one line per item, and no file name row (callers that show the name already can use this).
  isCompact?: boolean;
}

export function VideoMetadataComponent({ metadata, isLoading, isCompact = false }: VideoMetadataComponentProps) {
  if (isLoading) {
    return (
      <p role="status" className="text-xs text-foreground-muted">
        Looking up video details…
      </p>
    );
  }

  if (!metadata) {
    return <p className="text-xs text-foreground-muted">No details available for this video.</p>;
  }

  const metadataRows = buildVideoMetadataRows(metadata).filter((row) => !isCompact || row.label !== "File");

  if (isCompact) {
    return (
      <dl className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs">
        {metadataRows.map((row) => (
          <div key={row.label} className="flex min-w-0 gap-1.5">
            <dt className="shrink-0 text-foreground-muted">{row.label}</dt>
            <dd className="min-w-0 truncate text-foreground" title={row.value}>
              {row.value}
            </dd>
          </div>
        ))}
      </dl>
    );
  }

  return (
    <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1.5 text-xs">
      {metadataRows.map((row) => (
        <div key={row.label} className="contents">
          <dt className="text-foreground-muted">{row.label}</dt>
          <dd className="min-w-0 break-words text-foreground">{row.value}</dd>
        </div>
      ))}
    </dl>
  );
}
