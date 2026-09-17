"use client";

import Artplayer from "artplayer";
import { useEffect, useRef } from "react";

interface VideoPlayerComponentProps {
  videoUrl: string;
}

export function VideoPlayerComponent({ videoUrl }: VideoPlayerComponentProps) {
  const playerContainerRef = useRef<HTMLDivElement>(null);
  const artplayerInstanceRef = useRef<Artplayer | null>(null);

  useEffect(() => {
    if (!playerContainerRef.current) {
      return;
    }

    artplayerInstanceRef.current = new Artplayer({
      container: playerContainerRef.current,
      url: videoUrl,
      volume: 0.5,
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

    return () => {
      artplayerInstanceRef.current?.destroy(false);
      artplayerInstanceRef.current = null;
    };
  }, [videoUrl]);

  return <div ref={playerContainerRef} className="aspect-video w-full overflow-hidden rounded-2xl border border-border-default bg-black shadow-2xl" />;
}
