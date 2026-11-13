import { create } from "zustand";

import {
  clearWatchHistory,
  getWatchHistory,
  recordWatchedVideo,
  removeWatchedVideo,
  saveWatchedVideoMetadata,
} from "@/database";
import { loadVideoMetadata } from "@/lib/video-metadata";
import { WatchHistoryEntry } from "@/types/watch-history-entry";

interface WatchHistoryStore {
  historyEntries: WatchHistoryEntry[];
  metadataLookupUrls: string[];
  loadHistory: () => Promise<void>;
  recordVideo: (videoUrl: string) => Promise<void>;
  removeVideo: (videoUrl: string) => Promise<void>;
  clearHistory: () => Promise<void>;
}

// Browser storage can be unavailable (private mode, blocked site data, quota exceeded).
// History is a convenience, so a failed write is logged and the in-memory list still updates.
export const useWatchHistoryStore = create<WatchHistoryStore>((set, get) => {
  async function lookUpMetadata(videoUrl: string) {
    if (get().metadataLookupUrls.includes(videoUrl)) {
      return;
    }
    set({ metadataLookupUrls: [...get().metadataLookupUrls, videoUrl] });

    try {
      const metadata = await loadVideoMetadata(videoUrl);
      set({
        historyEntries: get().historyEntries.map((entry) =>
          entry.videoUrl === videoUrl ? { ...entry, metadata } : entry,
        ),
      });
      await saveWatchedVideoMetadata(videoUrl, metadata);
    } catch (error) {
      console.debug("Could not look up or save video metadata:", error);
    } finally {
      set({ metadataLookupUrls: get().metadataLookupUrls.filter((lookupUrl) => lookupUrl !== videoUrl) });
    }
  }

  return {
    historyEntries: [],
    metadataLookupUrls: [],

    loadHistory: async () => {
      try {
        const historyEntries = await getWatchHistory();
        set({ historyEntries });
      } catch (error) {
        console.warn("Could not load watch history:", error);
      }
    },

    recordVideo: async (videoUrl) => {
      try {
        await recordWatchedVideo(videoUrl);
      } catch (error) {
        console.warn("Could not save this video to watch history:", error);
      }

      const existingEntry = get().historyEntries.find((entry) => entry.videoUrl === videoUrl);
      const remainingEntries = get().historyEntries.filter((entry) => entry.videoUrl !== videoUrl);
      set({
        historyEntries: [{ videoUrl, watchedAt: Date.now(), metadata: existingEntry?.metadata }, ...remainingEntries],
      });

      if (!existingEntry?.metadata) {
        void lookUpMetadata(videoUrl);
      }
    },

    removeVideo: async (videoUrl) => {
      try {
        await removeWatchedVideo(videoUrl);
      } catch (error) {
        console.warn("Could not remove this video from watch history:", error);
      }
      set({ historyEntries: get().historyEntries.filter((entry) => entry.videoUrl !== videoUrl) });
    },

    clearHistory: async () => {
      try {
        await clearWatchHistory();
      } catch (error) {
        console.warn("Could not clear watch history:", error);
      }
      set({ historyEntries: [] });
    },
  };
});
