"use client";

import { useWatchHistoryStore } from "@/store/watch-history-store";
import { WatchSource } from "@/types/watch-history-entry";

interface PlayerHeaderComponentProps {
  videoUrl: string;
}

export function PlayerHeaderComponent({ videoUrl }: PlayerHeaderComponentProps) {
  const entry = useWatchHistoryStore((state) => state.historyEntries.find((historyEntry) => historyEntry.videoUrl === videoUrl));

  const sourceLabel = entry?.source === WatchSource.PLAYLIST ? "PLAYLIST" : "CUSTOM URL";
  const playingName = entry?.title ?? entry?.metadata?.fileName ?? videoUrl;

  return (
    <header className="flex h-8 shrink-0 items-center gap-3 border-b border-border-default bg-background-elevated px-3.5">
      <span className="flex shrink-0 items-center gap-1.5">
        <span
          className="h-[7px] w-[7px] animate-pulse rounded-full bg-accent shadow-[0_0_7px_1px_rgba(232,163,61,0.6)] motion-reduce:animate-none"
          aria-hidden="true"
        />
        <span className="font-mono text-[10px] tracking-wide text-foreground-muted">{sourceLabel}</span>
      </span>

      <span className="h-3.5 w-px shrink-0 bg-border-default" aria-hidden="true" />

      <h1 className="min-w-0 truncate text-xs font-semibold text-foreground" title={videoUrl}>
        {playingName}
      </h1>

      <span
        className="h-4 min-w-6 flex-1 bg-[radial-gradient(circle,var(--color-border)_2.4px,transparent_2.8px)] bg-size-[20px_16px] bg-position-[0_center]"
        aria-hidden="true"
      />
    </header>
  );
}
