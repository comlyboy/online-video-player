import { create } from "zustand";
import { persist } from "zustand/middleware";

import { parseM3uPlaylist } from "@/lib/m3u-playlist";
import { PlaylistChannel } from "@/types/playlist-channel";

export enum PlaylistStatus {
  IDLE = "idle",
  LOADING = "loading",
  READY = "ready",
  ERROR = "error",
}

interface PlaylistStore {
  playlistUrl: string;
  channels: PlaylistChannel[];
  status: PlaylistStatus;
  errorMessage: string;
  setPlaylistUrl: (playlistUrl: string) => void;
  loadPlaylist: (playlistUrl: string) => Promise<void>;
}

let latestLoadRequestNumber = 0;

export const usePlaylistStore = create<PlaylistStore>()(
  persist(
    (set) => ({
      playlistUrl: "",
      channels: [],
      status: PlaylistStatus.IDLE,
      errorMessage: "",

      setPlaylistUrl: (playlistUrl) => set({ playlistUrl }),

      loadPlaylist: async (playlistUrl) => {
        latestLoadRequestNumber += 1;
        const thisLoadRequestNumber = latestLoadRequestNumber;
        set({ playlistUrl, status: PlaylistStatus.LOADING, errorMessage: "" });

        try {
          const response = await fetch(playlistUrl);
          if (!response.ok) {
            throw new Error(`The server answered with status ${response.status}.`);
          }

          const channels = parseM3uPlaylist(await response.text());
          if (thisLoadRequestNumber !== latestLoadRequestNumber) {
            return;
          }

          if (channels.length === 0) {
            set({ channels: [], status: PlaylistStatus.ERROR, errorMessage: "No channels were found in this playlist." });
            return;
          }
          set({ channels, status: PlaylistStatus.READY });
        } catch (error) {
          console.warn("Could not load the playlist:", error);
          if (thisLoadRequestNumber === latestLoadRequestNumber) {
            set({
              channels: [],
              status: PlaylistStatus.ERROR,
              errorMessage: "Could not load this playlist. Check the link, and note the server must allow cross-origin requests.",
            });
          }
        }
      },
    }),
    { name: "online-video-player-playlist", partialize: (state) => ({ playlistUrl: state.playlistUrl }) },
  ),
);
