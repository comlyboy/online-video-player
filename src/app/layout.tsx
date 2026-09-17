import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { ServiceWorkerRegistrarComponent } from "@/components/ServiceWorkerRegistrarComponent";
import { COLOR_SCHEME_STORAGE_KEY, ColorScheme } from "@/types/color-scheme";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: "Online Video Player",
  description: "Watch on your favourite streaming platforms, or paste a direct video URL and play it instantly.",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Video Player",
  },
  openGraph: {
    title: "Online Video Player",
    description: "Watch on your favourite streaming platforms, or paste a direct video URL and play it instantly.",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
};

export const viewport: Viewport = {
  themeColor: "#0891b2",
};

const colorSchemeInitScript = `
(function () {
  try {
    var storedValue = window.localStorage.getItem("${COLOR_SCHEME_STORAGE_KEY}");
    var colorScheme = "${ColorScheme.CYAN}";
    if (storedValue) {
      var parsedValue = JSON.parse(storedValue);
      colorScheme = (parsedValue && parsedValue.state && parsedValue.state.colorScheme) || "${ColorScheme.CYAN}";
    }
    document.documentElement.setAttribute("data-color-scheme", colorScheme);
  } catch (error) {
    document.documentElement.setAttribute("data-color-scheme", "${ColorScheme.CYAN}");
  }
})();
`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-color-scheme={ColorScheme.CYAN}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: colorSchemeInitScript }} />
      </head>
      <body className="flex h-dvh flex-col overflow-hidden bg-background text-foreground">
        <main className="flex min-h-0 flex-1 flex-col">{children}</main>
        <ServiceWorkerRegistrarComponent />
      </body>
    </html>
  );
}
