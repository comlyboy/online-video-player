"use client";

import { useEffect, useState } from "react";

import { openPopupWindow } from "@/lib/popup-window";
import { StreamingPlatform } from "@/types/streaming-platform";

interface PlatformFrameComponentProps {
  platform: StreamingPlatform;
}

const EMBED_HINT_DELAY_MS = 4000;

export function PlatformFrameComponent({ platform }: PlatformFrameComponentProps) {
  const [showEmbedHint, setShowEmbedHint] = useState(false);

  useEffect(() => {
    if (platform.canEmbed === false) {
      openPopupWindow(platform.websiteUrl, platform.id);
      return;
    }

    const timeoutId = window.setTimeout(() => setShowEmbedHint(true), EMBED_HINT_DELAY_MS);
    return () => window.clearTimeout(timeoutId);
  }, [platform.id, platform.canEmbed, platform.websiteUrl]);

  if (platform.canEmbed === false) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-background-elevated px-6 text-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="h-10 w-10 text-accent"
          aria-hidden="true"
        >
          <rect x="4" y="4" width="16" height="16" rx="2" />
          <path strokeLinecap="round" d="M9 9l6 6M15 9l-6 6" />
        </svg>
        <p className="text-sm font-semibold text-foreground">{platform.name} can&apos;t be embedded here</p>
        <p className="max-w-sm text-xs leading-relaxed text-foreground-muted">
          This site sends a header that blocks other pages from displaying it in a frame. We just tried
          opening it in a separate window, if your browser blocked that popup, use the button below.
        </p>
        <button
          type="button"
          onClick={() => openPopupWindow(platform.websiteUrl, platform.id)}
          className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-accent-strong px-4 py-2 text-sm font-semibold text-background transition hover:opacity-90"
        >
          Open {platform.name}
          <span aria-hidden="true">↗</span>
        </button>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full">
      <div
        className="h-4 w-full border-b border-border-default bg-[radial-gradient(circle,var(--color-border)_2.4px,transparent_2.8px)] bg-size-[20px_16px] bg-position-[10px_center]"
        aria-hidden="true"
      />
      <iframe
        key={platform.id}
        src={platform.websiteUrl}
        title={`${platform.name} website`}
        className="h-[calc(100%-16px)] w-full bg-black"
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
        referrerPolicy="no-referrer"
        loading="lazy"
      />

      {showEmbedHint ? (
        <div className="pointer-events-none absolute inset-x-0 bottom-4 flex justify-center px-4">
          <div className="pointer-events-auto flex items-center gap-3 rounded-full border border-border-default bg-background-elevated px-4 py-2 text-xs text-foreground-muted shadow-lg">
            Nothing showing? This site may block embedding.
            <button
              type="button"
              onClick={() => openPopupWindow(platform.websiteUrl, platform.id)}
              className="font-semibold text-accent hover:underline"
            >
              Open directly ↗
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
