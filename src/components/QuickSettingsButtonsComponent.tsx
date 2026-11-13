import { ReactNode } from "react";

import { AccessibilityIconComponent } from "@/components/icons/AccessibilityIconComponent";
import { PaletteIconComponent } from "@/components/icons/PaletteIconComponent";
import { buildQuickSettingsPanelId, QUICK_SETTINGS_BUTTONS, QuickSettingsPanel } from "@/lib/quick-settings-panel";

interface QuickSettingsButtonsComponentProps {
  openPanel: QuickSettingsPanel | null;
  onTogglePanel: (panel: QuickSettingsPanel) => void;
}

function renderPanelIcon(panel: QuickSettingsPanel): ReactNode {
  return panel === QuickSettingsPanel.APPEARANCE ? <PaletteIconComponent /> : <AccessibilityIconComponent />;
}

export function QuickSettingsButtonsComponent({ openPanel, onTogglePanel }: QuickSettingsButtonsComponentProps) {
  return (
    <div className="flex items-center gap-1.5">
      {QUICK_SETTINGS_BUTTONS.map((button) => {
        const isOpen = openPanel === button.panel;

        return (
          <button
            key={button.panel}
            type="button"
            onClick={() => onTogglePanel(button.panel)}
            aria-expanded={isOpen}
            aria-controls={buildQuickSettingsPanelId(button.panel)}
            aria-label={button.label}
            title={button.label}
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition ${
              isOpen
                ? "border-accent bg-accent-soft text-accent"
                : "border-border-default text-foreground-muted hover:border-accent hover:text-accent"
            }`}
          >
            {renderPanelIcon(button.panel)}
          </button>
        );
      })}
    </div>
  );
}
