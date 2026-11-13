import { ReactNode } from "react";

import { buildQuickSettingsPanelId, QUICK_SETTINGS_BUTTONS, QuickSettingsPanel } from "@/lib/quick-settings-panel";

interface QuickSettingsButtonsComponentProps {
  openPanel: QuickSettingsPanel | null;
  onTogglePanel: (panel: QuickSettingsPanel) => void;
}

function renderPanelIcon(panel: QuickSettingsPanel): ReactNode {
  return (
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
      {panel === QuickSettingsPanel.APPEARANCE ? (
        <>
          <path d="M12 3a9 9 0 1 0 0 18c1.1 0 1.8-.8 1.8-1.7 0-.5-.2-.9-.5-1.2-.3-.3-.5-.7-.5-1.2 0-.9.8-1.7 1.7-1.7H16a5 5 0 0 0 5-5c0-4-4-7.2-9-7.2z" />
          <circle cx="7.5" cy="11" r="1" />
          <circle cx="10.5" cy="7" r="1" />
          <circle cx="15" cy="7.5" r="1" />
        </>
      ) : (
        <>
          <circle cx="12" cy="12" r="9" />
          <circle cx="12" cy="7.8" r="0.8" />
          <path d="M7.5 10.5l4.5.8 4.5-.8M12 11.3v3.2M10 17l2-2.5 2 2.5" />
        </>
      )}
    </svg>
  );
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
