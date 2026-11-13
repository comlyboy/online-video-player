"use client";

import { useEffect, useState } from "react";

import { formatDuration, formatFileSize, loadVideoMetadata } from "@/lib/video-metadata";
import { VideoMetadata } from "@/types/video-metadata";

interface VideoMetadataComponentProps {
  videoUrl: string;
}

interface MetadataRow {
  label: string;
  value: string;
}

function buildMetadataRows(metadata: VideoMetadata): MetadataRow[] {
  const rows: MetadataRow[] = [
    { label: "File", value: metadata.fileName },
    { label: "Source", value: metadata.hostName },
  ];

  if (metadata.durationSeconds !== null) {
    rows.push({ label: "Duration", value: formatDuration(metadata.durationSeconds) });
  }
  if (metadata.widthPixels !== null && metadata.heightPixels !== null) {
    rows.push({ label: "Resolution", value: `${metadata.widthPixels} × ${metadata.heightPixels}` });
  }
  if (metadata.contentType) {
    rows.push({ label: "Type", value: metadata.contentType });
  }
  if (metadata.sizeBytes !== null) {
    rows.push({ label: "Size", value: formatFileSize(metadata.sizeBytes) });
  }

  return rows;
}

export function VideoMetadataComponent({ videoUrl }: VideoMetadataComponentProps) {
  const [loadedMetadata, setLoadedMetadata] = useState<{ videoUrl: string; metadata: VideoMetadata | null } | null>(null);

  useEffect(() => {
    if (!videoUrl) {
      return;
    }

    let isCancelled = false;

    loadVideoMetadata(videoUrl)
      .then((metadata) => {
        if (!isCancelled) {
          setLoadedMetadata({ videoUrl, metadata });
        }
      })
      .catch((error: unknown) => {
        console.debug("Could not read video metadata:", error);
        if (!isCancelled) {
          setLoadedMetadata({ videoUrl, metadata: null });
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [videoUrl]);

  if (!videoUrl) {
    return null;
  }

  const isLoading = loadedMetadata?.videoUrl !== videoUrl;
  const metadata = isLoading ? null : loadedMetadata.metadata;

  return (
    <section aria-label="Video details" aria-busy={isLoading} className="mb-4 flex flex-col gap-2">
      <h3 className="text-xs font-semibold uppercase tracking-wide text-foreground-muted">Video details</h3>

      {isLoading ? (
        <p className="text-xs text-foreground-muted">Looking up video details…</p>
      ) : metadata ? (
        <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 rounded-lg border border-border-default px-3 py-2 text-xs">
          {buildMetadataRows(metadata).map((row) => (
            <div key={row.label} className="contents">
              <dt className="text-foreground-muted">{row.label}</dt>
              <dd className="min-w-0 break-words text-foreground">{row.value}</dd>
            </div>
          ))}
        </dl>
      ) : (
        <p className="text-xs text-foreground-muted">No details available for this video.</p>
      )}
    </section>
  );
}
