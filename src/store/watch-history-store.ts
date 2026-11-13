import { create } from "zustand";

import {
  clearWatchHistory,
  getWatchHistory,
  recordWatchedVideo,
  removeWatchedVideo,
  updateWatchedVideo,
} from "@/database";
import { loadVideoMetadata } from "@/lib/video-metadata";
import { buildUniqueVideoId } from "@/lib/video-id";
import { WatchHistoryEntry } from "@/types/watch-history-entry";

interface WatchHistoryStore {
  historyEntries: WatchHistoryEntry[];
  metadataLookupUrls: string[];
  loadHistory: () => Promise<void>;
  recordVideo: (videoUrl: string, title?: string) => Promise<void>;
  removeVideo: (videoUrl: string) => Promise<void>;
  clearHistory: () => Promise<void>;
}

function assignMissingVideoIds(historyEntries: WatchHistoryEntry[]): WatchHistoryEntry[] {
  const takenVideoIds = historyEntries.map((entry) => entry.id);

  // Oldest first, so the earliest video keeps the ID closest to when it was watched.
  const entriesOldestFirst = [...historyEntries].sort((first, second) => first.watchedAt - second.watchedAt);
  const assignedIds = new Map<string, string>();

  for (const entry of entriesOldestFirst) {
    if (!entry.id) {
      const newVideoId = buildUniqueVideoId(entry.watchedAt, takenVideoIds);
      takenVideoIds.push(newVideoId);
      assignedIds.set(entry.videoUrl, newVideoId);
    }
  }

  return historyEntries.map((entry) => (entry.id ? entry : { ...entry, id: assignedIds.get(entry.videoUrl) }));
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
      await updateWatchedVideo(videoUrl, { metadata });
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
        const entriesWithIds = assignMissingVideoIds(historyEntries);
        set({ historyEntries: entriesWithIds });

        // Entries saved before IDs existed get one now and keep it from then on.
        for (const entry of entriesWithIds) {
          const originalEntry = historyEntries.find((candidate) => candidate.videoUrl === entry.videoUrl);
          if (!originalEntry?.id) {
            await updateWatchedVideo(entry.videoUrl, { id: entry.id });
          }
        }
      } catch (error) {
        console.warn("Could not load watch history:", error);
      }
    },

    recordVideo: async (videoUrl, title) => {
      const existingEntry = get().historyEntries.find((entry) => entry.videoUrl === videoUrl);
      const takenVideoIds = get().historyEntries.map((entry) => entry.id);
      const newVideoId = existingEntry?.id ?? buildUniqueVideoId(Date.now(), takenVideoIds);

      let recordedEntry: WatchHistoryEntry = {
        videoUrl,
        watchedAt: Date.now(),
        id: newVideoId,
        title: title ?? existingEntry?.title,
        metadata: existingEntry?.metadata,
      };

      try {
        recordedEntry = await recordWatchedVideo(videoUrl, newVideoId, title);
      } catch (error) {
        console.warn("Could not save this video to watch history:", error);
      }

      const remainingEntries = get().historyEntries.filter((entry) => entry.videoUrl !== videoUrl);
      set({ historyEntries: [recordedEntry, ...remainingEntries] });

      if (!recordedEntry.metadata) {
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
