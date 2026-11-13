"use client";

import { useState } from "react";

import { CurrentlyPlayingComponent } from "@/components/CurrentlyPlayingComponent";
import { DrawerSectionComponent } from "@/components/DrawerSectionComponent";
import { PlayFormComponent } from "@/components/PlayFormComponent";
import { PlaylistBrowserComponent } from "@/components/PlaylistBrowserComponent";
import { QuickSettingsButtonsComponent } from "@/components/QuickSettingsButtonsComponent";
import { QuickSettingsPanelComponent } from "@/components/QuickSettingsPanelComponent";
import { SourceTabBarComponent } from "@/components/SourceTabBarComponent";
import { WatchHistoryListComponent } from "@/components/WatchHistoryListComponent";
import { usePlaylistStore } from "@/store/playlist-store";
import { QuickSettingsPanel } from "@/lib/quick-settings-panel";
import { buildSourcePanelId, buildSourceTabId, SourceTab } from "@/lib/source-tab";
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
  const addPlaylist = usePlaylistStore((state) => state.addPlaylist);
  const [openQuickSettingsPanel, setOpenQuickSettingsPanel] = useState<QuickSettingsPanel | null>(null);

  const [activeSourceTab, setActiveSourceTab] = useState<SourceTab>(SourceTab.VIDEOS);

  function handleSubmitPlaylistUrl(playlistUrl: string) {
    setActiveSourceTab(SourceTab.PLAYLIST);
    void addPlaylist(playlistUrl);
  }

  function toggleQuickSettingsPanel(panel: QuickSettingsPanel) {
    setOpenQuickSettingsPanel(openQuickSettingsPanel === panel ? null : panel);
  }

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
        className={`fixed right-0 top-0 z-[2147483647] flex h-full w-full max-w-md flex-col border-l border-border-default bg-background-elevated shadow-2xl transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex shrink-0 items-center justify-between border-b border-border-default px-4 py-2">
          <h2 className="text-sm font-semibold text-foreground">Controls</h2>

          <div className="flex items-center gap-2">
            <QuickSettingsButtonsComponent openPanel={openQuickSettingsPanel} onTogglePanel={toggleQuickSettingsPanel} />
            <button
              type="button"
              onClick={close}
              aria-label="Close controls"
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-border-default text-xs text-foreground-muted transition hover:border-accent hover:text-accent"
            >
              ✕
            </button>
          </div>
        </div>

        <QuickSettingsPanelComponent openPanel={openQuickSettingsPanel} />

        <div className="flex flex-1 flex-col gap-7 overflow-y-auto p-5">
          <CurrentlyPlayingComponent videoUrl={activeVideoUrl} onStopWatching={onStopWatching} />

          <div className="flex flex-col gap-5">
            <SourceTabBarComponent activeTab={activeSourceTab} onSelectTab={setActiveSourceTab} />

            <div
              id={buildSourcePanelId(SourceTab.VIDEOS)}
              role="tabpanel"
              aria-labelledby={buildSourceTabId(SourceTab.VIDEOS)}
              hidden={activeSourceTab !== SourceTab.VIDEOS}
            >
              <WatchHistoryListComponent activeVideoUrl={activeVideoUrl} onSelectVideoUrl={onSubmitVideoUrl} />
            </div>

            <div
              id={buildSourcePanelId(SourceTab.PLAYLIST)}
              role="tabpanel"
              aria-labelledby={buildSourceTabId(SourceTab.PLAYLIST)}
              hidden={activeSourceTab !== SourceTab.PLAYLIST}
            >
              <PlaylistBrowserComponent activeVideoUrl={activeVideoUrl} onSelectChannel={onSubmitVideoUrl} />
            </div>
          </div>

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
            <PlayFormComponent onSubmitVideoUrl={onSubmitVideoUrl} onSubmitPlaylistUrl={handleSubmitPlaylistUrl} />
          </DrawerSectionComponent>
        </div>
      </aside>
    </>
  );
}
