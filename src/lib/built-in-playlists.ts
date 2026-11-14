import { SavedPlaylist } from "@/types/saved-playlist";

// Ships with the app: always listed first, cannot be removed, and is the one opened by default.
export const BUILT_IN_PLAYLISTS: SavedPlaylist[] = [
  { url: "https://iptv-org.github.io/iptv/index.m3u", name: "IPTV-org · All channels" },
];

export function isBuiltInPlaylistUrl(playlistUrl: string): boolean {
  return BUILT_IN_PLAYLISTS.some((playlist) => playlist.url === playlistUrl);
}
