import { buildQuickSettingsPanelId, QUICK_SETTINGS_BUTTONS, QuickSettingsPanel } from "@/lib/quick-settings-panel";

interface QuickSettingsButtonsComponentProps {
  openPanel: QuickSettingsPanel | null;
  onTogglePanel: (panel: QuickSettingsPanel) => void;
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
            className={`rounded-full border px-2.5 py-1 text-xs font-semibold transition ${
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
  );
}
