export enum ColorScheme {
  AMBER = "amber",
  TEAL = "teal",
  ROSE = "rose",
  VIOLET = "violet",
  CRIMSON = "crimson",
  ORANGE = "orange",
  LIME = "lime",
  EMERALD = "emerald",
  SKY = "sky",
  INDIGO = "indigo",
  FUCHSIA = "fuchsia",
  SLATE = "slate",
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
  { scheme: ColorScheme.CRIMSON, label: "Curtain crimson", swatchColor: "#e05c5c" },
  { scheme: ColorScheme.ORANGE, label: "Sunset orange", swatchColor: "#ee8a4a" },
  { scheme: ColorScheme.LIME, label: "Spotlight lime", swatchColor: "#a3c95a" },
  { scheme: ColorScheme.EMERALD, label: "Premiere emerald", swatchColor: "#4fc08d" },
  { scheme: ColorScheme.SKY, label: "Matinee sky", swatchColor: "#5aa9e6" },
  { scheme: ColorScheme.INDIGO, label: "Midnight indigo", swatchColor: "#7b8ce0" },
  { scheme: ColorScheme.FUCHSIA, label: "Neon fuchsia", swatchColor: "#d46bc4" },
  { scheme: ColorScheme.SLATE, label: "Silver slate", swatchColor: "#9aa6b5" },
];
