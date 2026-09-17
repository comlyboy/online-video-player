import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

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
  title: "Online Video Player",
  description: "Watch on your favourite streaming platforms, or paste a direct video URL and play it instantly.",
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
      </body>
    </html>
  );
}
