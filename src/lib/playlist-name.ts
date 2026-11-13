// Builds a short label like "iptv-org.github.io/index.m3u" from a playlist link.
export function buildPlaylistName(playlistUrl: string): string {
  try {
    const parsedUrl = new URL(playlistUrl);
    const lastPathSegment = parsedUrl.pathname.split("/").filter(Boolean).pop();
    return lastPathSegment ? `${parsedUrl.hostname}/${lastPathSegment}` : parsedUrl.hostname;
  } catch {
    return playlistUrl;
  }
}
