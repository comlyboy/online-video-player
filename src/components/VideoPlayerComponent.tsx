"use client";

import Artplayer from "artplayer";
import Hls from "hls.js";
import { useEffect, useRef, useState } from "react";

import { cacheVideoForReuse, getCachedVideoBlob } from "@/database";
import { isHlsUrl } from "@/lib/video-url";
import { buildPlaceholderPosterDataUrl } from "@/lib/video-placeholder";

const FALLBACK_ACCENT_COLOR = "#d6922e";

function readAccentColor(): string {
  return getComputedStyle(document.documentElement).getPropertyValue("--color-accent-strong").trim() || FALLBACK_ACCENT_COLOR;
}

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

    let isCancelled = false;
    let artplayerInstance: Artplayer | null = null;
    let cachedObjectUrl: string | null = null;

    const isHlsStream = isHlsUrl(videoUrl);

    async function setUpPlayer() {
      // Streams are never cached: playlists are tiny and live channels have no end.
      const cachedVideoBlob = isHlsStream ? null : await getCachedVideoBlob(videoUrl);

      if (isCancelled || !playerContainerRef.current) {
        return;
      }

      let playbackUrl = videoUrl;

      if (cachedVideoBlob) {
        cachedObjectUrl = URL.createObjectURL(cachedVideoBlob);
        playbackUrl = cachedObjectUrl;
      }

      // Plays an HLS stream through hls.js, or natively where the browser supports it (Safari).
      function playHlsStream(videoElement: HTMLVideoElement, streamUrl: string, player: Artplayer) {
        if (Hls.isSupported()) {
          const hlsInstance = new Hls();
          hlsInstance.loadSource(streamUrl);
          hlsInstance.attachMedia(videoElement);
          hlsInstance.on(Hls.Events.ERROR, (_event, errorData) => {
            if (errorData.fatal) {
              // Expected for dead or blocked channels; the error panel tells the user, so avoid the dev error overlay.
              console.warn("HLS stream failed:", errorData.details);
              setHasPlaybackError(true);
            }
          });
          player.on("destroy", () => hlsInstance.destroy());
        } else if (videoElement.canPlayType("application/vnd.apple.mpegurl")) {
          videoElement.src = streamUrl;
        } else {
          setHasPlaybackError(true);
        }
      }

      // Screenshots need a CORS-enabled video (otherwise the canvas is tainted). Cached blobs are same-origin.
      // If the server rejects CORS, the video errors, so we retry once without it (playback works, screenshots don't).
      function createPlayer(shouldRequestCors: boolean) {
        const player = new Artplayer({
          container: playerContainerRef.current as HTMLDivElement,
          url: playbackUrl,
          poster: buildPlaceholderPosterDataUrl(["Press play to start streaming"]),
          volume: 0.2,
          isLive: false,
          muted: false,
          autoplay: false,
          pip: true,
          autoSize: false,
          autoMini: true,
          // Only offer the button when the canvas can be exported; otherwise ArtPlayer rejects with a SecurityError.
          // HLS plays through MSE blobs, which are same-origin, so it is always exportable.
          screenshot: shouldRequestCors || Boolean(cachedObjectUrl) || isHlsStream,
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
          theme: readAccentColor(),
          ...(isHlsStream ? { type: "m3u8", customType: { m3u8: playHlsStream } } : {}),
          moreVideoAttr: shouldRequestCors && !isHlsStream ? { crossOrigin: "anonymous" } : {},
        });

        player.on("video:error", (error) => {
          if (shouldRequestCors && player === artplayerInstance) {
            console.warn("Video failed with CORS enabled, retrying without screenshot support:", error);
            try {
              player.destroy(false);
              artplayerInstance = createPlayer(false);
              artplayerInstanceRef.current = artplayerInstance;
            } catch (retryError) {
              console.error("ArtPlayer failed to retry without CORS:", retryError);
              setHasPlaybackError(true);
            }
            return;
          }

          console.warn("ArtPlayer playback error:", error);
          try {
            player.pause();
          } catch (pauseError) {
            console.error("ArtPlayer failed to pause after an error:", pauseError);
          }
          setHasPlaybackError(true);
        });

        return player;
      }

      try {
        artplayerInstance = createPlayer(!cachedObjectUrl && !isHlsStream);
      } catch (error) {
        console.error("ArtPlayer failed to initialise:", error);
        setHasPlaybackError(true);
      }

      artplayerInstanceRef.current = artplayerInstance;

      if (!cachedVideoBlob && !isHlsStream) {
        void cacheVideoForReuse(videoUrl);
      }
    }

    // Keep the player's accent in step with the colour scheme (set on <html> by the switcher).
    const colorSchemeObserver = new MutationObserver(() => {
      const accentColor = readAccentColor();
      // Skip until the new scheme's CSS has been applied.
      requestAnimationFrame(() => {
        if (artplayerInstance) {
          artplayerInstance.theme = readAccentColor() || accentColor;
        }
      });
    });
    colorSchemeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-color-scheme"] });

    setUpPlayer().catch((error: unknown) => {
      console.error("Video player setup failed:", error);
      setHasPlaybackError(true);
    });

    return () => {
      isCancelled = true;
      colorSchemeObserver.disconnect();

      try {
        artplayerInstance?.destroy(false);
      } catch (error) {
        console.error("ArtPlayer failed to tear down cleanly:", error);
      }

      if (cachedObjectUrl) {
        URL.revokeObjectURL(cachedObjectUrl);
      }

      artplayerInstanceRef.current = null;
    };
  }, [videoUrl]);

  return (
    <div className="relative h-full w-full bg-black">
      <div
        className="h-4 w-full border-b border-border-default bg-[radial-gradient(circle,var(--color-border)_2.4px,transparent_2.8px)] bg-size-[20px_16px] bg-position-[10px_center]"
        aria-hidden="true"
      />
      <div ref={playerContainerRef} className="h-[calc(100%-16px)] w-full" />

      {hasPlaybackError ? (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 bg-background-elevated px-6 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-10 w-10 text-accent">
            <circle cx="12" cy="12" r="9" />
            <path strokeLinecap="round" d="M12 8v5" />
            <circle cx="12" cy="16" r="0.5" fill="currentColor" />
          </svg>
          <p className="text-sm font-semibold text-foreground">
            {isHlsUrl(videoUrl) ? "This channel is not available" : "This video could not be loaded"}
          </p>
          <p className="max-w-xs text-xs leading-relaxed text-foreground-muted">
            {isHlsUrl(videoUrl)
              ? "It may be offline, blocked in your region, or it does not allow browsers to play it. Pick another channel from the playlist."
              : "Check that the URL points directly to a video file and is publicly accessible, then try again."}
          </p>
        </div>
      ) : null}
    </div>
  );
}
