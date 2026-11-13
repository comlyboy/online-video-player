import { ColorSchemeSwitcherComponent } from "@/components/ColorSchemeSwitcherComponent";
import { buildQuickSettingsPanelId, QuickSettingsPanel } from "@/lib/quick-settings-panel";

interface QuickSettingsPanelComponentProps {
  openPanel: QuickSettingsPanel | null;
}

export function QuickSettingsPanelComponent({ openPanel }: QuickSettingsPanelComponentProps) {
  return (
    <div hidden={openPanel === null} className="shrink-0 border-b border-border-default bg-background-card p-4">
      <div
        id={buildQuickSettingsPanelId(QuickSettingsPanel.APPEARANCE)}
        role="region"
        aria-label="Appearance"
        hidden={openPanel !== QuickSettingsPanel.APPEARANCE}
      >
        <ColorSchemeSwitcherComponent />
      </div>

      <div
        id={buildQuickSettingsPanelId(QuickSettingsPanel.ACCESSIBILITY)}
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
