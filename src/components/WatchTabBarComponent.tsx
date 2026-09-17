"use client";

import { CUSTOM_URL_TAB_ID } from "@/lib/watch-tabs";
import { useCustomStreamingSitesStore } from "@/store/custom-streaming-sites-store";

interface WatchTabBarComponentProps {
  activeTabId: string;
  onSelectTab: (tabId: string) => void;
}

export function WatchTabBarComponent({ activeTabId, onSelectTab }: WatchTabBarComponentProps) {
  const customSites = useCustomStreamingSitesStore((state) => state.customSites);

  return (
    <div role="tablist" aria-label="Watch source" className="flex flex-col gap-1.5">
      {customSites.map((platform) => {
        const isActive = platform.id === activeTabId;

        return (
          <button
            key={platform.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onSelectTab(platform.id)}
            className={`flex items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-semibold transition ${
              isActive ? "bg-accent-soft text-accent" : "text-foreground-muted hover:text-foreground"
            }`}
          >
            <span
              className="h-2 w-2 shrink-0 rounded-full"
              style={{ backgroundColor: platform.accentColor }}
              aria-hidden="true"
            />
            <span className="truncate">{platform.name}</span>
          </button>
        );
      })}

      <button
        type="button"
        role="tab"
        aria-selected={activeTabId === CUSTOM_URL_TAB_ID}
        onClick={() => onSelectTab(CUSTOM_URL_TAB_ID)}
        className={`flex items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-semibold transition ${
          activeTabId === CUSTOM_URL_TAB_ID ? "bg-accent-soft text-accent" : "text-foreground-muted hover:text-foreground"
        }`}
      >
        <span aria-hidden="true">🔗</span>
        Custom URL
      </button>
    </div>
  );
}
