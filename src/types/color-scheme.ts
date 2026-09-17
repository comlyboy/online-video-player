export enum ColorScheme {
  CYAN = "cyan",
  INDIGO = "indigo",
  ROSE = "rose",
  EMERALD = "emerald",
}

export const COLOR_SCHEME_STORAGE_KEY = "online-video-player-color-scheme";

export interface ColorSchemeOption {
  scheme: ColorScheme;
  label: string;
  swatchColor: string;
}

export const colorSchemeOptions: ColorSchemeOption[] = [
  { scheme: ColorScheme.CYAN, label: "Cyan", swatchColor: "#22d3ee" },
  { scheme: ColorScheme.INDIGO, label: "Indigo", swatchColor: "#818cf8" },
  { scheme: ColorScheme.ROSE, label: "Rose", swatchColor: "#fb7185" },
  { scheme: ColorScheme.EMERALD, label: "Emerald", swatchColor: "#34d399" },
];
