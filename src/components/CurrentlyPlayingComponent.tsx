"use client";

import { DrawerSectionComponent } from "@/components/DrawerSectionComponent";
import { VideoMetadataComponent } from "@/components/VideoMetadataComponent";
import { useWatchHistoryStore } from "@/store/watch-history-store";

interface CurrentlyPlayingComponentProps {
  videoUrl: string;
}

export function CurrentlyPlayingComponent({ videoUrl }: CurrentlyPlayingComponentProps) {
  const entry = useWatchHistoryStore((state) => state.historyEntries.find((historyEntry) => historyEntry.videoUrl === videoUrl));
  const isLookingUp = useWatchHistoryStore((state) => state.metadataLookupUrls.includes(videoUrl));

  return (
    <DrawerSectionComponent title="Currently playing">
      {videoUrl ? (
        <div className="flex flex-col gap-3 rounded-xl border border-accent/40 bg-accent-soft p-3.5">
          <p className="truncate text-sm font-semibold text-foreground" title={videoUrl}>
            {entry?.metadata?.fileName ?? videoUrl}
          </p>
          <VideoMetadataComponent metadata={entry?.metadata} isLoading={isLookingUp || !entry} />
        </div>
      ) : (
        <p className="rounded-xl border border-dashed border-border-default p-3.5 text-xs text-foreground-muted">
          Nothing playing yet. Paste a video URL below to start.
        </p>
      )}
    </DrawerSectionComponent>
  );
}
