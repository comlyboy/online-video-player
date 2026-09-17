import { create } from "zustand";

import { clearWatchHistory, getWatchHistory, recordWatchedVideo, removeWatchedVideo } from "@/database";
import { WatchHistoryEntry } from "@/types/watch-history-entry";

interface WatchHistoryStore {
  historyEntries: WatchHistoryEntry[];
  loadHistory: () => Promise<void>;
  recordVideo: (videoUrl: string) => Promise<void>;
  removeVideo: (videoUrl: string) => Promise<void>;
  clearHistory: () => Promise<void>;
}

export const useWatchHistoryStore = create<WatchHistoryStore>((set, get) => ({
  historyEntries: [],

  loadHistory: async () => {
    const historyEntries = await getWatchHistory();
    set({ historyEntries });
  },

  recordVideo: async (videoUrl) => {
    await recordWatchedVideo(videoUrl);
    const remainingEntries = get().historyEntries.filter((entry) => entry.videoUrl !== videoUrl);
    set({ historyEntries: [{ videoUrl, watchedAt: Date.now() }, ...remainingEntries] });
  },

  removeVideo: async (videoUrl) => {
    await removeWatchedVideo(videoUrl);
    set({ historyEntries: get().historyEntries.filter((entry) => entry.videoUrl !== videoUrl) });
  },

  clearHistory: async () => {
    await clearWatchHistory();
    set({ historyEntries: [] });
  },
}));
