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
