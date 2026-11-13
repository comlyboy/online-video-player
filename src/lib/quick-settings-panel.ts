export enum QuickSettingsPanel {
  APPEARANCE = "appearance",
  ACCESSIBILITY = "accessibility",
}

export interface QuickSettingsButton {
  panel: QuickSettingsPanel;
  label: string;
}

export const QUICK_SETTINGS_BUTTONS: QuickSettingsButton[] = [
  { panel: QuickSettingsPanel.APPEARANCE, label: "Appearance" },
  { panel: QuickSettingsPanel.ACCESSIBILITY, label: "Accessibility" },
];

export function buildQuickSettingsPanelId(panel: QuickSettingsPanel): string {
  return `quick-settings-${panel}`;
}
