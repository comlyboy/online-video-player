export function isPlayableVideoUrl(candidateUrl: string): boolean {
  if (!candidateUrl.trim()) {
    return false;
  }

  try {
    const parsedUrl = new URL(candidateUrl);
    return parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:";
  } catch {
    return false;
  }
}

export function readHostName(videoUrl: string): string {
  try {
    return new URL(videoUrl).hostname;
  } catch {
    return "";
  }
}

function readLowerCasePathname(candidateUrl: string): string {
  try {
    return new URL(candidateUrl).pathname.toLowerCase();
  } catch {
    return "";
  }
}

// A .m3u file is a list of channels, not a video.
export function isPlaylistUrl(candidateUrl: string): boolean {
  return readLowerCasePathname(candidateUrl).endsWith(".m3u");
}
