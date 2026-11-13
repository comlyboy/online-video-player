"use client";

import { DrawerSectionComponent } from "@/components/DrawerSectionComponent";
import { VideoIdComponent } from "@/components/VideoIdComponent";
import { buildVideoSummaryParts } from "@/lib/video-metadata";
import { readHostName } from "@/lib/video-url";
import { useWatchHistoryStore } from "@/store/watch-history-store";

interface CurrentlyPlayingComponentProps {
  videoUrl: string;
  onStopWatching: () => void;
}

const EQUALIZER_BARS = [
  { heightClass: "h-3", animationDelay: "0s" },
  { heightClass: "h-5", animationDelay: "0.25s" },
  { heightClass: "h-3.5", animationDelay: "0.5s" },
];

export function CurrentlyPlayingComponent({ videoUrl, onStopWatching }: CurrentlyPlayingComponentProps) {
  const entry = useWatchHistoryStore((state) => state.historyEntries.find((historyEntry) => historyEntry.videoUrl === videoUrl));
  const isLookingUp = useWatchHistoryStore((state) => state.metadataLookupUrls.includes(videoUrl));

  if (!videoUrl) {
    return (
      <DrawerSectionComponent title="Currently playing">
        <p className="rounded-xl border border-dashed border-border-default px-3 py-2 text-xs text-foreground-muted">
          Nothing playing yet.
        </p>
      </DrawerSectionComponent>
    );
  }

  const summaryText = entry?.metadata
    ? buildVideoSummaryParts(entry.metadata).join(" · ")
    : isLookingUp || !entry
      ? "Looking up details…"
      : readHostName(videoUrl);

  return (
    <DrawerSectionComponent title="Currently playing">
      <div className="flex items-center gap-3 rounded-xl border border-accent/40 bg-accent-soft p-2.5">
        <div
          className="flex h-10 w-10 shrink-0 items-end justify-center gap-1 rounded-lg bg-accent-strong/20 pb-2.5"
          aria-hidden="true"
        >
          {EQUALIZER_BARS.map((bar) => (
            <span
              key={bar.animationDelay}
              className={`w-1 origin-bottom animate-pulse rounded-full bg-accent motion-reduce:animate-none ${bar.heightClass}`}
              style={{ animationDelay: bar.animationDelay }}
            />
          ))}
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold leading-tight text-foreground" title={videoUrl}>
            {entry?.title ?? entry?.metadata?.fileName ?? videoUrl}
          </p>
          <p className="truncate text-[11px] leading-snug text-foreground-muted">{summaryText}</p>
          <VideoIdComponent videoId={entry?.id} />
        </div>

        <button
          type="button"
          onClick={onStopWatching}
          aria-label="Stop watching"
          title="Stop watching"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border-default text-xs text-foreground-muted transition hover:border-red-400 hover:text-red-400"
        >
          ■
        </button>
      </div>
    </DrawerSectionComponent>
  );
}
