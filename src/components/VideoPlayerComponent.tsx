"use client";

import Artplayer from "artplayer";
import { useEffect, useRef, useState } from "react";

import { buildPlaceholderPosterDataUrl } from "@/lib/video-placeholder";

interface VideoPlayerComponentProps {
  videoUrl: string;
}

export function VideoPlayerComponent({ videoUrl }: VideoPlayerComponentProps) {
  const playerContainerRef = useRef<HTMLDivElement>(null);
  const artplayerInstanceRef = useRef<Artplayer | null>(null);
  const [hasPlaybackError, setHasPlaybackError] = useState(false);

  useEffect(() => {
    if (!playerContainerRef.current) {
      return;
    }

    const artplayerInstance = new Artplayer({
      container: playerContainerRef.current,
      url: videoUrl,
      poster: buildPlaceholderPosterDataUrl(["Press play to start streaming"]),
      volume: 0.2,
      isLive: false,
      muted: false,
      autoplay: false,
      pip: true,
      autoSize: false,
      autoMini: true,
      screenshot: true,
      setting: true,
      loop: false,
      flip: true,
      playbackRate: true,
      aspectRatio: true,
      fullscreen: true,
      fullscreenWeb: true,
      subtitleOffset: true,
      miniProgressBar: true,
      mutex: true,
      backdrop: true,
      playsInline: true,
      autoPlayback: true,
      airplay: true,
      theme: "#06b6d4",
    });

    artplayerInstance.on("video:error", () => {
      artplayerInstance.pause();
      setHasPlaybackError(true);
    });

    artplayerInstanceRef.current = artplayerInstance;

    return () => {
      artplayerInstance.destroy(false);
      artplayerInstanceRef.current = null;
    };
  }, [videoUrl]);

  return (
    <div className="relative h-full w-full bg-black">
      <div ref={playerContainerRef} className="h-full w-full" />

      {hasPlaybackError ? (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 bg-background-elevated px-6 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-10 w-10 text-accent">
            <circle cx="12" cy="12" r="9" />
            <path strokeLinecap="round" d="M12 8v5" />
            <circle cx="12" cy="16" r="0.5" fill="currentColor" />
          </svg>
          <p className="text-sm font-semibold text-foreground">This video could not be loaded</p>
          <p className="max-w-xs text-xs leading-relaxed text-foreground-muted">
            Check that the URL points directly to a video file and is publicly accessible, then try again.
          </p>
        </div>
      ) : null}
    </div>
  );
}
