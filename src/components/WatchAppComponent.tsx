"use client";

import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import { PlatformFrameComponent } from "@/components/PlatformFrameComponent";
import { PlayFormComponent } from "@/components/PlayFormComponent";
import { WatchTabBarComponent } from "@/components/WatchTabBarComponent";
import { streamingPlatforms } from "@/data/streaming-platforms";
import { CUSTOM_URL_TAB_ID } from "@/lib/watch-tabs";

const VideoPlayerComponent = dynamic(
  () => import("@/components/VideoPlayerComponent").then((videoPlayerModule) => videoPlayerModule.VideoPlayerComponent),
  { ssr: false },
);

export function WatchAppComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const requestedVideoUrl = searchParams.get("url") ?? "";
  const requestedTabId = searchParams.get("tab") || (requestedVideoUrl ? CUSTOM_URL_TAB_ID : streamingPlatforms[0].id);

  const [activeTabId, setActiveTabId] = useState(requestedTabId);
  const [activeVideoUrl, setActiveVideoUrl] = useState(requestedVideoUrl);

  function selectTab(tabId: string) {
    setActiveTabId(tabId);

    if (tabId === CUSTOM_URL_TAB_ID && activeVideoUrl) {
      router.replace(`/?tab=${tabId}&url=${encodeURIComponent(activeVideoUrl)}`);
    } else {
      router.replace(`/?tab=${tabId}`);
    }
  }

  function handleSubmitVideoUrl(videoUrl: string) {
    setActiveVideoUrl(videoUrl);
    router.replace(`/?tab=${CUSTOM_URL_TAB_ID}&url=${encodeURIComponent(videoUrl)}`);
  }

  const activePlatform = streamingPlatforms.find((platform) => platform.id === activeTabId);

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <WatchTabBarComponent activeTabId={activeTabId} onSelectTab={selectTab} />

      <div className="mt-6">
        {activePlatform ? (
          <PlatformFrameComponent platform={activePlatform} />
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
            <section className="flex flex-col gap-6">
              <PlayFormComponent initialVideoUrl={activeVideoUrl} onSubmitVideoUrl={handleSubmitVideoUrl} />

              {activeVideoUrl ? (
                <VideoPlayerComponent videoUrl={activeVideoUrl} />
              ) : (
                <div className="flex aspect-video w-full items-center justify-center rounded-2xl border border-dashed border-border-default bg-background-elevated text-center text-foreground-muted">
                  <p className="max-w-sm px-6">Paste a direct video URL above and press Play to start streaming here.</p>
                </div>
              )}
            </section>

            <aside className="space-y-6">
              <div className="rounded-2xl border border-border-default bg-background-elevated p-6">
                <h3 className="font-semibold text-foreground">Supported formats</h3>
                <div className="mt-5 space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-foreground-muted">MP4</span>
                    <span className="text-emerald-400">Supported</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-foreground-muted">WebM</span>
                    <span className="text-emerald-400">Supported</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-foreground-muted">Ogg</span>
                    <span className="text-emerald-400">Supported</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-foreground-muted">HLS (.m3u8)</span>
                    <span className="text-amber-400">Plugin</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-foreground-muted">MPEG-DASH</span>
                    <span className="text-amber-400">Plugin</span>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-accent/20 bg-accent-soft p-6">
                <h3 className="font-semibold text-accent">Tips</h3>
                <ul className="mt-4 space-y-3 text-sm text-foreground-muted">
                  <li>Use a publicly accessible, direct video file link.</li>
                  <li>Video page links, such as YouTube watch pages, are not supported here.</li>
                  <li>The video stays on its original host. Nothing is uploaded.</li>
                  <li>Switch tabs above to jump to a streaming platform instead.</li>
                </ul>
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}
