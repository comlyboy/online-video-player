import { isHlsUrl } from "@/lib/video-url";
import { VideoMetadata } from "@/types/video-metadata";

const METADATA_TIMEOUT_MS = 10000;

interface PlaybackMetadata {
  durationSeconds: number | null;
  widthPixels: number | null;
  heightPixels: number | null;
}

interface HeaderMetadata {
  contentType: string | null;
  sizeBytes: number | null;
}

function readFileName(parsedUrl: URL): string {
  const lastPathSegment = parsedUrl.pathname.split("/").filter(Boolean).pop() ?? "";
  try {
    return decodeURIComponent(lastPathSegment) || parsedUrl.hostname;
  } catch {
    return lastPathSegment || parsedUrl.hostname;
  }
}

// Reads duration and resolution by letting the browser load only the video's metadata.
function readPlaybackMetadata(videoUrl: string): Promise<PlaybackMetadata> {
  return new Promise((resolve) => {
    // A stream has no fixed duration, and most browsers cannot load one in a bare <video>.
    if (isHlsUrl(videoUrl)) {
      resolve({ durationSeconds: null, widthPixels: null, heightPixels: null });
      return;
    }

    const videoElement = document.createElement("video");
    videoElement.preload = "metadata";
    videoElement.muted = true;

    const timeoutId = window.setTimeout(() => finish(null), METADATA_TIMEOUT_MS);

    function finish(result: PlaybackMetadata | null) {
      window.clearTimeout(timeoutId);
      videoElement.removeAttribute("src");
      videoElement.load();
      resolve(result ?? { durationSeconds: null, widthPixels: null, heightPixels: null });
    }

    videoElement.onloadedmetadata = () =>
      finish({
        durationSeconds: Number.isFinite(videoElement.duration) ? videoElement.duration : null,
        widthPixels: videoElement.videoWidth || null,
        heightPixels: videoElement.videoHeight || null,
      });
    videoElement.onerror = () => finish(null);

    videoElement.src = videoUrl;
  });
}

// Reads file type and size from response headers. Servers without CORS block this, so it is best effort.
async function readHeaderMetadata(videoUrl: string): Promise<HeaderMetadata> {
  try {
    const response = await fetch(videoUrl, { method: "HEAD" });
    if (!response.ok) {
      return { contentType: null, sizeBytes: null };
    }

    const contentLength = Number(response.headers.get("content-length"));
    return {
      contentType: response.headers.get("content-type"),
      sizeBytes: Number.isFinite(contentLength) && contentLength > 0 ? contentLength : null,
    };
  } catch {
    return { contentType: null, sizeBytes: null };
  }
}

export async function loadVideoMetadata(videoUrl: string): Promise<VideoMetadata> {
  const parsedUrl = new URL(videoUrl);
  const [playbackMetadata, headerMetadata] = await Promise.all([
    readPlaybackMetadata(videoUrl),
    readHeaderMetadata(videoUrl),
  ]);

  return {
    fileName: readFileName(parsedUrl),
    hostName: parsedUrl.hostname,
    ...playbackMetadata,
    ...headerMetadata,
  };
}

export function formatDuration(totalSeconds: number): string {
  const wholeSeconds = Math.round(totalSeconds);
  const hours = Math.floor(wholeSeconds / 3600);
  const minutes = Math.floor((wholeSeconds % 3600) / 60);
  const seconds = wholeSeconds % 60;
  const paddedSeconds = String(seconds).padStart(2, "0");

  return hours > 0
    ? `${hours}:${String(minutes).padStart(2, "0")}:${paddedSeconds}`
    : `${minutes}:${paddedSeconds}`;
}

export function formatFileSize(sizeBytes: number): string {
  const units = ["B", "KB", "MB", "GB"];
  let value = sizeBytes;
  let unitIndex = 0;

  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }

  return `${value.toFixed(unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
}

export interface VideoMetadataRow {
  label: string;
  value: string;
}

export function buildVideoMetadataRows(metadata: VideoMetadata): VideoMetadataRow[] {
  const rows: VideoMetadataRow[] = [
    { label: "File", value: metadata.fileName },
    { label: "Source", value: metadata.hostName },
  ];

  if (metadata.durationSeconds !== null) {
    rows.push({ label: "Duration", value: formatDuration(metadata.durationSeconds) });
  }
  if (metadata.widthPixels !== null && metadata.heightPixels !== null) {
    rows.push({ label: "Resolution", value: `${metadata.widthPixels} × ${metadata.heightPixels}` });
  }
  if (metadata.contentType) {
    rows.push({ label: "Type", value: metadata.contentType });
  }
  if (metadata.sizeBytes !== null) {
    rows.push({ label: "Size", value: formatFileSize(metadata.sizeBytes) });
  }

  return rows;
}
