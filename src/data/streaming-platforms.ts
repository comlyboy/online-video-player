import { StreamingPlatform } from "@/types/streaming-platform";

export const streamingPlatforms: StreamingPlatform[] = [
  {
    id: "goojara",
    name: "Goojara",
    websiteUrl: "https://ww1.goojara.to/",
    accentColor: "#22d3ee",
    canEmbed: false,
  },
  {
    id: "movieboxhd",
    name: "MovieBox HD",
    websiteUrl: "https://movieboxhd.net/",
    accentColor: "#818cf8",
    canEmbed: true,
  },
];
