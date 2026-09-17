"use client";

import { ColorSchemeSwitcherComponent } from "@/components/ColorSchemeSwitcherComponent";
import { ManageStreamingSitesComponent } from "@/components/ManageStreamingSitesComponent";
import { PlayFormComponent } from "@/components/PlayFormComponent";
import { WatchHistoryListComponent } from "@/components/WatchHistoryListComponent";
import { WatchTabBarComponent } from "@/components/WatchTabBarComponent";
import { useControlDrawerStore } from "@/store/control-drawer-store";

interface ControlDrawerComponentProps {
  activeTabId: string;
  onSelectTab: (tabId: string) => void;
  activeVideoUrl: string;
  onSubmitVideoUrl: (videoUrl: string) => void;
  onGoToWelcome: () => void;
}

export function ControlDrawerComponent({
  activeTabId,
  onSelectTab,
  activeVideoUrl,
  onSubmitVideoUrl,
  onGoToWelcome,
}: ControlDrawerComponentProps) {
  const isOpen = useControlDrawerStore((state) => state.isOpen);
  const close = useControlDrawerStore((state) => state.close);

  return (
    <>
      <div
        onClick={close}
        aria-hidden="true"
        className={`fixed inset-0 z-30 bg-black/60 transition-opacity ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <aside
        id="control-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Controls"
        className={`fixed right-0 top-0 z-40 flex h-full w-full max-w-sm flex-col border-l border-border-default bg-background-elevated shadow-2xl transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex shrink-0 items-center justify-between border-b border-border-default px-4 py-3">
          <h2 className="text-sm font-semibold text-foreground">Controls</h2>
          <button
            type="button"
            onClick={close}
            aria-label="Close controls"
            className="text-foreground-muted transition hover:text-foreground"
          >
            ✕
          </button>
        </div>

        <div className="flex flex-1 flex-col gap-6 overflow-y-auto p-4">
          <div>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-foreground-muted">Watch source</h3>
            <WatchTabBarComponent activeTabId={activeTabId} onSelectTab={onSelectTab} />
          </div>

          <div>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-foreground-muted">Play from URL</h3>
            <PlayFormComponent initialVideoUrl={activeVideoUrl} onSubmitVideoUrl={onSubmitVideoUrl} />
          </div>

          <ManageStreamingSitesComponent />

          <WatchHistoryListComponent onSelectVideoUrl={onSubmitVideoUrl} />

          <div>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-foreground-muted">Appearance</h3>
            <ColorSchemeSwitcherComponent />
          </div>

          <button
            type="button"
            onClick={onGoToWelcome}
            className="mt-auto rounded-lg border border-border-default px-3 py-2 text-sm text-foreground-muted transition hover:border-accent hover:text-accent"
          >
            Back to welcome screen
          </button>
        </div>
      </aside>
    </>
  );
}
