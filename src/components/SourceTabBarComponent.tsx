"use client";

import { KeyboardEvent } from "react";

import { buildSourcePanelId, buildSourceTabId, SOURCE_TAB_OPTIONS, SourceTab } from "@/lib/source-tab";

interface SourceTabBarComponentProps {
  activeTab: SourceTab;
  onSelectTab: (tab: SourceTab) => void;
}

export function SourceTabBarComponent({ activeTab, onSelectTab }: SourceTabBarComponentProps) {
  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") {
      return;
    }

    event.preventDefault();
    const activeIndex = SOURCE_TAB_OPTIONS.findIndex((option) => option.tab === activeTab);
    const step = event.key === "ArrowRight" ? 1 : -1;
    const nextOption = SOURCE_TAB_OPTIONS[(activeIndex + step + SOURCE_TAB_OPTIONS.length) % SOURCE_TAB_OPTIONS.length];

    onSelectTab(nextOption.tab);
    document.getElementById(buildSourceTabId(nextOption.tab))?.focus();
  }

  return (
    <div
      role="tablist"
      aria-label="Video source"
      onKeyDown={handleKeyDown}
      className="flex gap-1 rounded-xl border border-border-default bg-background p-1"
    >
      {SOURCE_TAB_OPTIONS.map((option) => {
        const isActive = option.tab === activeTab;

        return (
          <button
            key={option.tab}
            id={buildSourceTabId(option.tab)}
            type="button"
            role="tab"
            aria-selected={isActive}
            aria-controls={buildSourcePanelId(option.tab)}
            tabIndex={isActive ? 0 : -1}
            onClick={() => onSelectTab(option.tab)}
            className={`flex-1 rounded-lg px-3 py-1.5 text-sm font-semibold transition ${
              isActive ? "bg-accent-strong text-background" : "text-foreground-muted hover:text-accent"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
