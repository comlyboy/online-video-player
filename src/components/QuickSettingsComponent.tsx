"use client";

import { useState } from "react";

import { ColorSchemeSwitcherComponent } from "@/components/ColorSchemeSwitcherComponent";

enum QuickSettingsPanel {
  APPEARANCE = "appearance",
  ACCESSIBILITY = "accessibility",
}

interface QuickSettingsButton {
  panel: QuickSettingsPanel;
  label: string;
}

const QUICK_SETTINGS_BUTTONS: QuickSettingsButton[] = [
  { panel: QuickSettingsPanel.APPEARANCE, label: "Appearance" },
  { panel: QuickSettingsPanel.ACCESSIBILITY, label: "Accessibility" },
];

export function QuickSettingsComponent() {
  const [openPanel, setOpenPanel] = useState<QuickSettingsPanel | null>(null);

  function togglePanel(panel: QuickSettingsPanel) {
    setOpenPanel(openPanel === panel ? null : panel);
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-2">
        {QUICK_SETTINGS_BUTTONS.map((button) => {
          const isOpen = openPanel === button.panel;

          return (
            <button
              key={button.panel}
              type="button"
              onClick={() => togglePanel(button.panel)}
              aria-expanded={isOpen}
              aria-controls={`quick-settings-${button.panel}`}
              className={`flex-1 rounded-lg border px-3 py-2 text-sm font-semibold transition ${
                isOpen
                  ? "border-accent bg-accent-soft text-accent"
                  : "border-border-default text-foreground-muted hover:border-accent hover:text-accent"
              }`}
            >
              {button.label}
            </button>
          );
        })}
      </div>

      <div
        id={`quick-settings-${QuickSettingsPanel.APPEARANCE}`}
        role="region"
        aria-label="Appearance"
        hidden={openPanel !== QuickSettingsPanel.APPEARANCE}
      >
        <ColorSchemeSwitcherComponent />
      </div>

      <div
        id={`quick-settings-${QuickSettingsPanel.ACCESSIBILITY}`}
        role="region"
        aria-label="Accessibility"
        hidden={openPanel !== QuickSettingsPanel.ACCESSIBILITY}
      >
        <p className="text-xs leading-relaxed text-foreground-muted">
          For automatic captions on any video playing here, turn on your browser&apos;s built-in live captioning
          (e.g. Chrome or Edge: Settings → Accessibility → Live Caption). This app can&apos;t switch it on for you,
          it&apos;s a browser-level feature that works on whatever is playing.
        </p>
      </div>
    </div>
  );
}
