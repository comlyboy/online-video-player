"use client";

import { DrawerSectionComponent } from "@/components/DrawerSectionComponent";
import { VideoIdComponent } from "@/components/VideoIdComponent";
import { VideoMetadataComponent } from "@/components/VideoMetadataComponent";
import { useWatchHistoryStore } from "@/store/watch-history-store";

interface CurrentlyPlayingComponentProps {
  videoUrl: string;
  onStopWatching: () => void;
}

export function CurrentlyPlayingComponent({ videoUrl, onStopWatching }: CurrentlyPlayingComponentProps) {
  const entry = useWatchHistoryStore((state) => state.historyEntries.find((historyEntry) => historyEntry.videoUrl === videoUrl));
  const isLookingUp = useWatchHistoryStore((state) => state.metadataLookupUrls.includes(videoUrl));

  return (
    <DrawerSectionComponent title="Currently playing">
      {videoUrl ? (
        <div className="flex flex-col gap-3 rounded-xl border border-accent/40 bg-accent-soft p-3.5">
          <p className="truncate text-sm font-semibold text-foreground" title={videoUrl}>
            {entry?.metadata?.fileName ?? videoUrl}
          </p>
          <VideoIdComponent videoId={entry?.id} />
          <VideoMetadataComponent metadata={entry?.metadata} isLoading={isLookingUp || !entry} />
          <button
            type="button"
            onClick={onStopWatching}
            className="self-start rounded-lg border border-border-default px-3 py-1.5 text-xs font-semibold text-foreground transition hover:border-red-400 hover:text-red-400"
          >
            ■ Stop watching
          </button>
        </div>
      ) : (
        <p className="rounded-xl border border-dashed border-border-default p-3.5 text-xs text-foreground-muted">
          Nothing playing yet. Paste a video URL below to start.
        </p>
      )}
    </DrawerSectionComponent>
  );
}
