"use client";

import { useState } from "react";

import { CloseIconComponent } from "@/components/icons/CloseIconComponent";
import { HomeIconComponent } from "@/components/icons/HomeIconComponent";
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
  onVideosRemoved: (removedVideoUrls: string[]) => void;
}

export function ControlDrawerComponent({
  activeVideoUrl,
  onSubmitVideoUrl,
  onReplayVideoUrl,
  onSelectChannel,
  onGoToWelcome,
  onStopWatching,
  onVideosRemoved,
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
        className={`fixed inset-0 z-2147483646 bg-black/60 transition-opacity ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <aside
        id="control-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Controls"
        className={`fixed right-0 top-0 z-2147483647 flex h-full w-full max-w-md flex-col border-l border-border-default bg-background-elevated shadow-2xl transition-transform duration-300 ${
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
              <HomeIconComponent />
            </button>
            <h2 className="text-lg font-semibold text-foreground">Controls</h2>
          </div>

          <div className="flex items-center gap-2">
            <QuickSettingsButtonsComponent openPanel={openQuickSettingsPanel} onTogglePanel={toggleQuickSettingsPanel} />
            <button
              type="button"
              onClick={close}
              aria-label="Close controls"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border-default text-foreground-muted transition hover:border-accent hover:text-accent"
            >
              <CloseIconComponent />
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
                  onVideosRemoved={onVideosRemoved}
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
                <PlaylistBrowserComponent
                  isTabActive={activeSourceTab === SourceTab.PLAYLIST}
                  activeVideoUrl={activeVideoUrl} onSelectChannel={onSelectChannel} />

                <WatchHistoryListComponent
                  source={WatchSource.PLAYLIST}
                  title="Recently played"
                  emptyMessage="Channels you play from a playlist will show up here."
                  activeVideoUrl={activeVideoUrl}
                  onSelectVideoUrl={onReplayVideoUrl}
                  onVideosRemoved={onVideosRemoved}
                />
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
