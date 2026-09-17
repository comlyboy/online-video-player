"use client";

import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { ControlDrawerComponent } from "@/components/ControlDrawerComponent";
import { ControlDrawerTriggerComponent } from "@/components/ControlDrawerTriggerComponent";
import { PlatformFrameComponent } from "@/components/PlatformFrameComponent";
import { WelcomeScreenComponent } from "@/components/WelcomeScreenComponent";
import { streamingPlatforms } from "@/data/streaming-platforms";
import { CUSTOM_URL_TAB_ID } from "@/lib/watch-tabs";
import { useControlDrawerStore } from "@/store/control-drawer-store";
import { useCustomStreamingSitesStore } from "@/store/custom-streaming-sites-store";
import { useWatchHistoryStore } from "@/store/watch-history-store";

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

  const customSites = useCustomStreamingSitesStore((state) => state.customSites);
  const loadCustomSites = useCustomStreamingSitesStore((state) => state.loadCustomSites);
  const loadWatchHistory = useWatchHistoryStore((state) => state.loadHistory);
  const recordWatchedVideoUrl = useWatchHistoryStore((state) => state.recordVideo);
  const closeDrawer = useControlDrawerStore((state) => state.close);

  useEffect(() => {
    loadCustomSites();
    loadWatchHistory();
  }, [loadCustomSites, loadWatchHistory]);

  function selectTab(tabId: string) {
    setActiveTabId(tabId);
    closeDrawer();

    if (tabId === CUSTOM_URL_TAB_ID && activeVideoUrl) {
      router.replace(`/?tab=${tabId}&url=${encodeURIComponent(activeVideoUrl)}`);
    } else {
      router.replace(`/?tab=${tabId}`);
    }
  }

  function goToWelcome() {
    setActiveTabId("");
    closeDrawer();
    router.replace("/");
  }

  function handleSubmitVideoUrl(videoUrl: string) {
    setActiveTabId(CUSTOM_URL_TAB_ID);
    setActiveVideoUrl(videoUrl);
    recordWatchedVideoUrl(videoUrl);
    closeDrawer();
    router.replace(`/?tab=${CUSTOM_URL_TAB_ID}&url=${encodeURIComponent(videoUrl)}`);
  }

  const activePlatform = [...streamingPlatforms, ...customSites].find((platform) => platform.id === activeTabId);

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col">
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

      <ControlDrawerTriggerComponent />

      <ControlDrawerComponent
        activeTabId={activeTabId}
        onSelectTab={selectTab}
        activePlatform={activePlatform}
        activeVideoUrl={activeVideoUrl}
        onSubmitVideoUrl={handleSubmitVideoUrl}
        onGoToWelcome={goToWelcome}
      />
    </div>
  );
}
