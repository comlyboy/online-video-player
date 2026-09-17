"use client";

import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import { BottomControlBarComponent } from "@/components/BottomControlBarComponent";
import { PlatformFrameComponent } from "@/components/PlatformFrameComponent";
import { TopBarComponent } from "@/components/TopBarComponent";
import { WelcomeScreenComponent } from "@/components/WelcomeScreenComponent";
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
  const requestedTabId = searchParams.get("tab") || (requestedVideoUrl ? CUSTOM_URL_TAB_ID : "");

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

  function goToWelcome() {
    setActiveTabId("");
    router.replace("/");
  }

  function handleSubmitVideoUrl(videoUrl: string) {
    setActiveVideoUrl(videoUrl);
    router.replace(`/?tab=${CUSTOM_URL_TAB_ID}&url=${encodeURIComponent(videoUrl)}`);
  }

  const activePlatform = streamingPlatforms.find((platform) => platform.id === activeTabId);

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col">
      <TopBarComponent onGoToWelcome={goToWelcome} />

      <div className="min-h-0 flex-1">
        {activeTabId === "" ? (
          <WelcomeScreenComponent onSelectTab={selectTab} />
        ) : activePlatform ? (
          <PlatformFrameComponent platform={activePlatform} />
        ) : activeVideoUrl ? (
          <VideoPlayerComponent key={activeVideoUrl} videoUrl={activeVideoUrl} />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-background-elevated text-center text-foreground-muted">
            <p className="max-w-sm px-6">Paste a direct video URL below and press Play to start streaming here.</p>
          </div>
        )}
      </div>

      {activeTabId !== "" ? (
        <BottomControlBarComponent
          activeTabId={activeTabId}
          onSelectTab={selectTab}
          activePlatform={activePlatform}
          activeVideoUrl={activeVideoUrl}
          onSubmitVideoUrl={handleSubmitVideoUrl}
        />
      ) : null}
    </div>
  );
}
