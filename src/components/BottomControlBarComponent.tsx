import { ColorSchemeSwitcherComponent } from "@/components/ColorSchemeSwitcherComponent";
import { PlayFormComponent } from "@/components/PlayFormComponent";
import { WatchTabBarComponent } from "@/components/WatchTabBarComponent";
import { CUSTOM_URL_TAB_ID } from "@/lib/watch-tabs";
import { StreamingPlatform } from "@/types/streaming-platform";

interface BottomControlBarComponentProps {
  activeTabId: string;
  onSelectTab: (tabId: string) => void;
  activePlatform: StreamingPlatform | undefined;
  activeVideoUrl: string;
  onSubmitVideoUrl: (videoUrl: string) => void;
}

export function BottomControlBarComponent({
  activeTabId,
  onSelectTab,
  activePlatform,
  activeVideoUrl,
  onSubmitVideoUrl,
}: BottomControlBarComponentProps) {
  return (
    <div className="flex shrink-0 flex-wrap items-center gap-3 border-t border-border-default bg-background-elevated px-4 py-3">
      <WatchTabBarComponent activeTabId={activeTabId} onSelectTab={onSelectTab} />

      {activeTabId === CUSTOM_URL_TAB_ID ? (
        <PlayFormComponent initialVideoUrl={activeVideoUrl} onSubmitVideoUrl={onSubmitVideoUrl} />
      ) : null}

      <div className="ml-auto flex shrink-0 items-center gap-3">
        {activePlatform ? (
          <a
            href={activePlatform.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg border border-border-default px-3 py-2 text-sm font-semibold text-foreground transition hover:border-accent hover:text-accent"
          >
            Open in new tab
            <span aria-hidden="true">↗</span>
          </a>
        ) : null}

        <ColorSchemeSwitcherComponent />
      </div>
    </div>
  );
}
