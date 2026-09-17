import { streamingPlatforms } from "@/data/streaming-platforms";
import { CUSTOM_URL_TAB_ID } from "@/lib/watch-tabs";

interface WatchTabBarComponentProps {
  activeTabId: string;
  onSelectTab: (tabId: string) => void;
}

export function WatchTabBarComponent({ activeTabId, onSelectTab }: WatchTabBarComponentProps) {
  return (
    <div
      role="tablist"
      aria-label="Watch source"
      className="flex flex-wrap gap-2 rounded-2xl border border-border-default bg-background-elevated p-2"
    >
      {streamingPlatforms.map((platform) => {
        const isActive = platform.id === activeTabId;

        return (
          <button
            key={platform.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onSelectTab(platform.id)}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
              isActive ? "bg-accent-soft text-accent" : "text-foreground-muted hover:text-foreground"
            }`}
          >
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: platform.accentColor }}
              aria-hidden="true"
            />
            {platform.name}
          </button>
        );
      })}

      <button
        type="button"
        role="tab"
        aria-selected={activeTabId === CUSTOM_URL_TAB_ID}
        onClick={() => onSelectTab(CUSTOM_URL_TAB_ID)}
        className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
          activeTabId === CUSTOM_URL_TAB_ID ? "bg-accent-soft text-accent" : "text-foreground-muted hover:text-foreground"
        }`}
      >
        <span aria-hidden="true">🔗</span>
        Custom URL
      </button>
    </div>
  );
}
