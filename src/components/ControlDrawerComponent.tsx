"use client";

import { CurrentlyPlayingComponent } from "@/components/CurrentlyPlayingComponent";
import { DrawerSectionComponent } from "@/components/DrawerSectionComponent";
import { PlayFormComponent } from "@/components/PlayFormComponent";
import { PlaylistBrowserComponent } from "@/components/PlaylistBrowserComponent";
import { QuickSettingsComponent } from "@/components/QuickSettingsComponent";
import { WatchHistoryListComponent } from "@/components/WatchHistoryListComponent";
import { usePlaylistStore } from "@/store/playlist-store";
import { useControlDrawerStore } from "@/store/control-drawer-store";

interface ControlDrawerComponentProps {
  activeVideoUrl: string;
  onSubmitVideoUrl: (videoUrl: string, title?: string) => void;
  onGoToWelcome: () => void;
  onStopWatching: () => void;
}

export function ControlDrawerComponent({
  activeVideoUrl,
  onSubmitVideoUrl,
  onGoToWelcome,
  onStopWatching,
}: ControlDrawerComponentProps) {
  const isOpen = useControlDrawerStore((state) => state.isOpen);
  const close = useControlDrawerStore((state) => state.close);
  const loadPlaylist = usePlaylistStore((state) => state.loadPlaylist);

  return (
    <>
      <div
        onClick={close}
        aria-hidden="true"
        className={`fixed inset-0 z-[2147483646] bg-black/60 transition-opacity ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <aside
        id="control-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Controls"
        className={`fixed right-0 top-0 z-[2147483647] flex h-full w-full max-w-sm flex-col border-l border-border-default bg-background-elevated shadow-2xl transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex shrink-0 items-center justify-between border-b border-border-default px-4 py-2">
          <h2 className="text-sm font-semibold text-foreground">Controls</h2>
          <button
            type="button"
            onClick={close}
            aria-label="Close controls"
            className="flex h-6 w-6 items-center justify-center rounded-full border border-border-default text-xs text-foreground-muted transition hover:border-accent hover:text-accent"
          >
            ✕
          </button>
        </div>

        <div className="flex flex-1 flex-col gap-7 overflow-y-auto p-5">
          <QuickSettingsComponent />

          <CurrentlyPlayingComponent videoUrl={activeVideoUrl} onStopWatching={onStopWatching} />

          <PlaylistBrowserComponent activeVideoUrl={activeVideoUrl} onSelectChannel={onSubmitVideoUrl} />

          <WatchHistoryListComponent activeVideoUrl={activeVideoUrl} onSelectVideoUrl={onSubmitVideoUrl} />

          <button
            type="button"
            onClick={onGoToWelcome}
            className="mt-auto rounded-lg border border-border-default px-3 py-2 text-sm text-foreground-muted transition hover:border-accent hover:text-accent"
          >
            Back to welcome screen
          </button>
        </div>

        <div className="shrink-0 border-t border-border-default bg-background-card p-5">
          <DrawerSectionComponent title="Play from URL">
            <PlayFormComponent onSubmitVideoUrl={onSubmitVideoUrl} onSubmitPlaylistUrl={loadPlaylist} />
          </DrawerSectionComponent>
        </div>
      </aside>
    </>
  );
}
