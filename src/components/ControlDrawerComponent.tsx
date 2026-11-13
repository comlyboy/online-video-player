"use client";

import { CurrentlyPlayingComponent } from "@/components/CurrentlyPlayingComponent";
import { DrawerSectionComponent } from "@/components/DrawerSectionComponent";
import { ColorSchemeSwitcherComponent } from "@/components/ColorSchemeSwitcherComponent";
import { PlayFormComponent } from "@/components/PlayFormComponent";
import { WatchHistoryListComponent } from "@/components/WatchHistoryListComponent";
import { useControlDrawerStore } from "@/store/control-drawer-store";

interface ControlDrawerComponentProps {
  activeVideoUrl: string;
  onSubmitVideoUrl: (videoUrl: string) => void;
  onGoToWelcome: () => void;
}

export function ControlDrawerComponent({
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
        <div className="flex shrink-0 items-center justify-between border-b border-border-default px-5 py-4">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent">Now Screening</p>
            <h2 className="mt-0.5 text-base font-semibold text-foreground">Controls</h2>
          </div>
          <button
            type="button"
            onClick={close}
            aria-label="Close controls"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-border-default text-foreground-muted transition hover:border-accent hover:text-accent"
          >
            ✕
          </button>
        </div>

        <div className="flex flex-1 flex-col gap-7 overflow-y-auto p-5">
          <CurrentlyPlayingComponent videoUrl={activeVideoUrl} />

          <WatchHistoryListComponent onSelectVideoUrl={onSubmitVideoUrl} />

          <DrawerSectionComponent title="Appearance">
            <ColorSchemeSwitcherComponent />
          </DrawerSectionComponent>

          <DrawerSectionComponent title="Accessibility">
            <p className="text-xs leading-relaxed text-foreground-muted">
              For automatic captions on any video playing here, turn on your browser&apos;s built-in live
              captioning (e.g. Chrome or Edge: Settings → Accessibility → Live Caption). This app can&apos;t
              switch it on for you, it&apos;s a browser-level feature that works on whatever is playing.
            </p>
          </DrawerSectionComponent>

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
            <PlayFormComponent onSubmitVideoUrl={onSubmitVideoUrl} />
          </DrawerSectionComponent>
        </div>
      </aside>
    </>
  );
}
