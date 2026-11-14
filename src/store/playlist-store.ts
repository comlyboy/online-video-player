import { create } from "zustand";
import { persist } from "zustand/middleware";

import { isBuiltInPlaylistUrl } from "@/lib/built-in-playlists";
import { parseM3uPlaylist } from "@/lib/m3u-playlist";
import { buildPlaylistName } from "@/lib/playlist-name";
import { PlaylistChannel } from "@/types/playlist-channel";
import { SavedPlaylist } from "@/types/saved-playlist";

export enum PlaylistStatus {
  IDLE = "idle",
  LOADING = "loading",
  READY = "ready",
  ERROR = "error",
}

interface PlaylistStore {
  savedPlaylists: SavedPlaylist[];
  activePlaylistUrl: string;
  channels: PlaylistChannel[];
  status: PlaylistStatus;
  errorMessage: string;
  addPlaylist: (playlistUrl: string) => Promise<void>;
  selectPlaylist: (playlistUrl: string) => Promise<void>;
  removePlaylist: (playlistUrl: string) => void;
}

interface PersistedPlaylistState {
  savedPlaylists: SavedPlaylist[];
  activePlaylistUrl: string;
}

// Channel lists are big (the iptv-org one has over 11,000), so they stay in memory only, once per playlist.
const cachedChannelsByPlaylistUrl = new Map<string, PlaylistChannel[]>();
let latestLoadRequestNumber = 0;

export const usePlaylistStore = create<PlaylistStore>()(
  persist(
    (set, get) => {
      async function showPlaylist(playlistUrl: string) {
        latestLoadRequestNumber += 1;
        const thisLoadRequestNumber = latestLoadRequestNumber;
        set({ activePlaylistUrl: playlistUrl, errorMessage: "" });

        const cachedChannels = cachedChannelsByPlaylistUrl.get(playlistUrl);
        if (cachedChannels) {
          set({ channels: cachedChannels, status: PlaylistStatus.READY });
          return;
        }

        set({ channels: [], status: PlaylistStatus.LOADING });

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

          cachedChannelsByPlaylistUrl.set(playlistUrl, channels);
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
      }

      return {
        savedPlaylists: [],
        activePlaylistUrl: "",
        channels: [],
        status: PlaylistStatus.IDLE,
        errorMessage: "",

        addPlaylist: async (playlistUrl) => {
          const isAlreadySaved =
            isBuiltInPlaylistUrl(playlistUrl) || get().savedPlaylists.some((playlist) => playlist.url === playlistUrl);
          if (!isAlreadySaved) {
            set({ savedPlaylists: [...get().savedPlaylists, { url: playlistUrl, name: buildPlaylistName(playlistUrl) }] });
          }
          await showPlaylist(playlistUrl);
        },

        selectPlaylist: (playlistUrl) => showPlaylist(playlistUrl),

        removePlaylist: (playlistUrl) => {
          cachedChannelsByPlaylistUrl.delete(playlistUrl);
          set({ savedPlaylists: get().savedPlaylists.filter((playlist) => playlist.url !== playlistUrl) });

          if (get().activePlaylistUrl === playlistUrl) {
            latestLoadRequestNumber += 1;
            set({ activePlaylistUrl: "", channels: [], status: PlaylistStatus.IDLE, errorMessage: "" });
          }
        },
      };
    },
    {
      name: "online-video-player-playlist",
      version: 1,
      // Saved playlists live in localStorage, which the server render cannot see, so they load after mount.
      skipHydration: true,
      partialize: (state): PersistedPlaylistState => ({
        savedPlaylists: state.savedPlaylists,
        activePlaylistUrl: state.activePlaylistUrl,
      }),
      // Version 0 stored a single "playlistUrl"; keep it as the first saved playlist.
      migrate: (persistedState) => {
        const olderState = persistedState as { playlistUrl?: string } | undefined;
        const olderPlaylistUrl = olderState?.playlistUrl;
        return {
          savedPlaylists: olderPlaylistUrl ? [{ url: olderPlaylistUrl, name: buildPlaylistName(olderPlaylistUrl) }] : [],
          activePlaylistUrl: "",
        } satisfies PersistedPlaylistState;
      },
    },
  ),
);
