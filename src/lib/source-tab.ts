export enum SourceTab {
  VIDEOS = "videos",
  PLAYLIST = "playlist",
}

export interface SourceTabOption {
  tab: SourceTab;
  label: string;
}

// Order matters: the first tab is the default one.
export const SOURCE_TAB_OPTIONS: SourceTabOption[] = [
  { tab: SourceTab.VIDEOS, label: "Videos" },
  { tab: SourceTab.PLAYLIST, label: "Playlist" },
];

export function buildSourceTabId(tab: SourceTab): string {
  return `source-tab-${tab}`;
}

export function buildSourcePanelId(tab: SourceTab): string {
  return `source-panel-${tab}`;
}
