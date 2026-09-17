export enum ColorScheme {
  AMBER = "amber",
  TEAL = "teal",
  ROSE = "rose",
  VIOLET = "violet",
}

export const COLOR_SCHEME_STORAGE_KEY = "online-video-player-color-scheme";

export interface ColorSchemeOption {
  scheme: ColorScheme;
  label: string;
  swatchColor: string;
}

export const colorSchemeOptions: ColorSchemeOption[] = [
  { scheme: ColorScheme.AMBER, label: "Marquee amber", swatchColor: "#e8a33d" },
  { scheme: ColorScheme.TEAL, label: "Reel teal", swatchColor: "#7fa6a0" },
  { scheme: ColorScheme.ROSE, label: "Velvet rose", swatchColor: "#c97b90" },
  { scheme: ColorScheme.VIOLET, label: "Backlot violet", swatchColor: "#a78bc9" },
];
