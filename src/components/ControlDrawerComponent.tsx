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
import { WatchSource } from "@/types/watch-history-entry";
import { usePlaylistStore } from "@/store/playlist-store";
import { QuickSettingsPanel } from "@/lib/quick-settings-panel";
import { buildSourcePanelId, buildSourceTabId, SourceTab } from "@/lib/source-tab";
import { useControlDrawerStore } from "@/store/control-drawer-store";

interface ControlDrawerComponentProps {
  activeVideoUrl: string;
  onSubmitVideoUrl: (videoUrl: string) => void;
  onReplayVideoUrl: (videoUrl: string) => void;
  onSelectChannel: (channelUrl: string, channelName: string) => void;
  onGoToWelcome: () => void;
  onStopWatching: () => void;
}

export function ControlDrawerComponent({
  activeVideoUrl,
  onSubmitVideoUrl,
  onReplayVideoUrl,
  onSelectChannel,
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
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onGoToWelcome}
              aria-label="Back to welcome screen"
              title="Back to welcome screen"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border-default text-foreground-muted transition hover:border-accent hover:text-accent"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
                aria-hidden="true"
              >
                <path d="M3 11l9-8 9 8" />
                <path d="M5 10v10h5v-6h4v6h5V10" />
              </svg>
            </button>
            <h2 className="text-lg font-semibold text-foreground">Controls</h2>
          </div>

          <div className="flex items-center gap-2">
            <QuickSettingsButtonsComponent openPanel={openQuickSettingsPanel} onTogglePanel={toggleQuickSettingsPanel} />
            <button
              type="button"
              onClick={close}
              aria-label="Close controls"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border-default text-sm text-foreground-muted transition hover:border-accent hover:text-accent"
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
              <div className="flex flex-col gap-7">
                <DrawerSectionComponent title="Play from URL">
                  <PlayFormComponent onSubmitVideoUrl={onSubmitVideoUrl} onSubmitPlaylistUrl={handleSubmitPlaylistUrl} />
                </DrawerSectionComponent>

                <WatchHistoryListComponent
                  source={WatchSource.VIDEO}
                  title="Recently watched"
                  emptyMessage="Videos you play from a URL will show up here."
                  activeVideoUrl={activeVideoUrl}
                  onSelectVideoUrl={onReplayVideoUrl}
                />
              </div>
            </div>

            <div
              id={buildSourcePanelId(SourceTab.PLAYLIST)}
              role="tabpanel"
              aria-labelledby={buildSourceTabId(SourceTab.PLAYLIST)}
              hidden={activeSourceTab !== SourceTab.PLAYLIST}
            >
              <div className="flex flex-col gap-7">
                <PlaylistBrowserComponent activeVideoUrl={activeVideoUrl} onSelectChannel={onSelectChannel} />

                <WatchHistoryListComponent
                  source={WatchSource.PLAYLIST}
                  title="Recently played"
                  emptyMessage="Channels you play from a playlist will show up here."
                  activeVideoUrl={activeVideoUrl}
                  onSelectVideoUrl={onReplayVideoUrl}
                />
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
