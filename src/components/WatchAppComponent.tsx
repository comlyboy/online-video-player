"use client";

import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { ControlDrawerComponent } from "@/components/ControlDrawerComponent";
import { ControlDrawerTriggerComponent } from "@/components/ControlDrawerTriggerComponent";
import { PlatformFrameComponent } from "@/components/PlatformFrameComponent";
import { SourceBadgeComponent } from "@/components/SourceBadgeComponent";
import { VideoPlayerErrorBoundaryComponent } from "@/components/VideoPlayerErrorBoundaryComponent";
import { WelcomeScreenComponent } from "@/components/WelcomeScreenComponent";
import { CUSTOM_URL_TAB_ID } from "@/lib/watch-tabs";
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

  useEffect(() => {
    loadCustomSites();
    loadWatchHistory();
  }, [loadCustomSites, loadWatchHistory]);

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
    setActiveTabId(CUSTOM_URL_TAB_ID);
    setActiveVideoUrl(videoUrl);
    recordWatchedVideoUrl(videoUrl);
    router.replace(`/?tab=${CUSTOM_URL_TAB_ID}&url=${encodeURIComponent(videoUrl)}`);
  }

  const activePlatform = customSites.find((platform) => platform.id === activeTabId);
  const sourceLabel = activePlatform ? activePlatform.name.toUpperCase() : activeVideoUrl ? "CUSTOM URL" : "";

  return (
    <div className="relative flex h-full min-h-0 flex-1 flex-col">
      <div className="relative min-h-0 flex-1">
        {activeTabId === "" ? (
          <WelcomeScreenComponent />
        ) : activePlatform ? (
          <PlatformFrameComponent key={activePlatform.id} platform={activePlatform} />
        ) : activeVideoUrl ? (
          <VideoPlayerErrorBoundaryComponent key={activeVideoUrl}>
            <VideoPlayerComponent videoUrl={activeVideoUrl} />
          </VideoPlayerErrorBoundaryComponent>
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-background-elevated text-center text-foreground-muted">
            <p className="max-w-sm px-6">Paste a direct video URL below and press Play to start streaming here.</p>
          </div>
        )}

        {sourceLabel ? <SourceBadgeComponent label={sourceLabel} /> : null}
      </div>

      <ControlDrawerTriggerComponent />

      <ControlDrawerComponent
        activeTabId={activeTabId}
        onSelectTab={selectTab}
        activeVideoUrl={activeVideoUrl}
        onSubmitVideoUrl={handleSubmitVideoUrl}
        onGoToWelcome={goToWelcome}
      />
    </div>
  );
}
