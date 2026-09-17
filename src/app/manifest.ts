import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Online Video Player",
    short_name: "Video Player",
    description: "Watch on your favourite streaming platforms, or paste a direct video URL and play it instantly.",
    start_url: "/",
    display: "standalone",
    background_color: "#0b0a08",
    theme_color: "#d6922e",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
