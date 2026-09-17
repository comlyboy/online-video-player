"use client";

import { useWatchHistoryStore } from "@/store/watch-history-store";

interface WatchHistoryListComponentProps {
  onSelectVideoUrl: (videoUrl: string) => void;
}

export function WatchHistoryListComponent({ onSelectVideoUrl }: WatchHistoryListComponentProps) {
  const historyEntries = useWatchHistoryStore((state) => state.historyEntries);
  const removeVideo = useWatchHistoryStore((state) => state.removeVideo);
  const clearHistory = useWatchHistoryStore((state) => state.clearHistory);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-foreground-muted">Recently watched</h3>
        {historyEntries.length > 0 ? (
          <button
            type="button"
            onClick={() => clearHistory()}
            className="text-xs text-foreground-muted transition hover:text-accent"
          >
            Clear
          </button>
        ) : null}
      </div>

      {historyEntries.length === 0 ? (
        <p className="text-xs text-foreground-muted">Videos you play from a URL will show up here.</p>
      ) : (
        <ul className="flex flex-col gap-1.5">
          {historyEntries.map((entry) => (
            <li
              key={entry.videoUrl}
              className="flex items-center justify-between gap-2 rounded-lg border border-border-default px-3 py-2 text-sm"
            >
              <button
                type="button"
                onClick={() => onSelectVideoUrl(entry.videoUrl)}
                title={entry.videoUrl}
                className="min-w-0 flex-1 truncate text-left text-foreground transition hover:text-accent"
              >
                {entry.videoUrl}
              </button>

              <button
                type="button"
                onClick={() => removeVideo(entry.videoUrl)}
                aria-label="Remove from history"
                className="shrink-0 text-foreground-muted transition hover:text-red-400"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
