"use client";

import { useId, useState } from "react";

import { ChevronRightIconComponent } from "@/components/icons/ChevronRightIconComponent";
import { CloseIconComponent } from "@/components/icons/CloseIconComponent";
import { PlayIconComponent } from "@/components/icons/PlayIconComponent";
import { DrawerSectionComponent } from "@/components/DrawerSectionComponent";
import { VideoIdComponent } from "@/components/VideoIdComponent";
import { VideoMetadataComponent } from "@/components/VideoMetadataComponent";
import { readHostName } from "@/lib/video-url";
import { useWatchHistoryStore } from "@/store/watch-history-store";
import { WatchSource } from "@/types/watch-history-entry";

interface WatchHistoryListComponentProps {
  source: WatchSource;
  title: string;
  emptyMessage: string;
  activeVideoUrl: string;
  onSelectVideoUrl: (videoUrl: string) => void;
  onVideosRemoved: (removedVideoUrls: string[]) => void;
}

export function WatchHistoryListComponent({
  source,
  title,
  emptyMessage,
  activeVideoUrl,
  onSelectVideoUrl,
  onVideosRemoved,
}: WatchHistoryListComponentProps) {
  const allHistoryEntries = useWatchHistoryStore((state) => state.historyEntries);
  const historyEntries = allHistoryEntries.filter((entry) => (entry.source ?? WatchSource.VIDEO) === source);
  const listId = useId();
  const metadataLookupUrls = useWatchHistoryStore((state) => state.metadataLookupUrls);
  const removeVideo = useWatchHistoryStore((state) => state.removeVideo);
  const clearHistory = useWatchHistoryStore((state) => state.clearHistory);

  const [expandedVideoUrl, setExpandedVideoUrl] = useState<string | null>(null);

  async function removeEntry(videoUrl: string) {
    await removeVideo(videoUrl);
    onVideosRemoved([videoUrl]);
  }

  async function clearEntries() {
    const removedVideoUrls = historyEntries.map((entry) => entry.videoUrl);
    await clearHistory(source);
    onVideosRemoved(removedVideoUrls);
  }

  function toggleEntry(videoUrl: string) {
    setExpandedVideoUrl(expandedVideoUrl === videoUrl ? null : videoUrl);
  }

  const clearButton =
    historyEntries.length > 0 ? (
      <button
        type="button"
        onClick={() => void clearEntries()}
        className="text-xs text-foreground-muted transition hover:text-accent"
      >
        Clear
      </button>
    ) : null;

  return (
    <DrawerSectionComponent title={title} action={clearButton}>
      {historyEntries.length === 0 ? (
        <p className="text-xs text-foreground-muted">{emptyMessage}</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {historyEntries.map((entry, index) => {
            const isExpanded = expandedVideoUrl === entry.videoUrl;
            const isCurrentlyPlaying = entry.videoUrl === activeVideoUrl;
            const panelId = `${listId}-panel-${index}`;

            return (
              <li key={entry.videoUrl} className="overflow-hidden rounded-xl border border-border-default bg-background-card">
                <div className="flex items-center gap-1 pr-2">
                  <button
                    type="button"
                    onClick={() => toggleEntry(entry.videoUrl)}
                    aria-expanded={isExpanded}
                    aria-controls={panelId}
                    title={entry.videoUrl}
                    className="flex min-w-0 flex-1 items-center gap-2.5 px-3 py-2.5 text-left transition hover:text-accent"
                  >
                    <ChevronRightIconComponent
                      className={`h-3.5 w-3.5 shrink-0 text-foreground-muted transition-transform ${isExpanded ? "rotate-90" : ""}`}
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm text-foreground">{entry.title ?? entry.metadata?.fileName ?? entry.videoUrl}</span>
                      <span className="block truncate text-[11px] text-foreground-muted">
                        {entry.metadata?.hostName ?? readHostName(entry.videoUrl)}
                      </span>
                    </span>
                  </button>

                  {isCurrentlyPlaying ? (
                    <span className="shrink-0 rounded-full border border-accent/50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-accent">
                      Playing
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onSelectVideoUrl(entry.videoUrl)}
                      aria-label={`Play ${entry.title ?? entry.metadata?.fileName ?? entry.videoUrl}`}
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent-strong text-background transition hover:opacity-90"
                    >
                      <PlayIconComponent className="h-3.5 w-3.5" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => void removeEntry(entry.videoUrl)}
                    aria-label="Remove from history"
                    className="flex h-7 w-7 shrink-0 items-center justify-center text-foreground-muted transition hover:text-red-400"
                  >
                    <CloseIconComponent className="h-3.5 w-3.5" />
                  </button>
                </div>

                <div id={panelId} role="region" hidden={!isExpanded} className="border-t border-border-default px-3 py-3">
                  <div className="mb-2"><VideoIdComponent videoId={entry.id} /></div>
                  <VideoMetadataComponent
                    metadata={entry.metadata}
                    isLoading={metadataLookupUrls.includes(entry.videoUrl)}
                  />
                  <p className="mt-2 break-all text-[11px] text-foreground-muted">{entry.videoUrl}</p>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </DrawerSectionComponent>
  );
}
