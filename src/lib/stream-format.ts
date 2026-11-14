export enum StreamFormat {
  NATIVE = "native",
  HLS = "hls",
  DASH = "dash",
  FLV = "flv",
  MPEG_TS = "mpegts",
}

const DETECTION_TIMEOUT_MS = 5000;

const STREAM_FORMAT_BY_EXTENSION: Record<string, StreamFormat> = {
  ".m3u8": StreamFormat.HLS,
  ".mpd": StreamFormat.DASH,
  ".flv": StreamFormat.FLV,
  ".ts": StreamFormat.MPEG_TS,
};

// Plain files the browser plays by itself, so there is nothing to detect.
const NATIVE_EXTENSIONS = [".mp4", ".m4v", ".mov", ".webm", ".ogv", ".ogg", ".mkv", ".mp3", ".m4a", ".wav", ".aac"];

const STREAM_FORMAT_BY_CONTENT_TYPE: Array<{ pattern: RegExp; format: StreamFormat }> = [
  { pattern: /mpegurl/i, format: StreamFormat.HLS },
  { pattern: /dash\+xml/i, format: StreamFormat.DASH },
  { pattern: /x-flv/i, format: StreamFormat.FLV },
  { pattern: /mp2t/i, format: StreamFormat.MPEG_TS },
];

function readLowerCasePathname(candidateUrl: string): string {
  try {
    return new URL(candidateUrl).pathname.toLowerCase();
  } catch {
    return "";
  }
}

// Reads the format from the file extension alone; null when the extension says nothing.
export function readStreamFormatFromExtension(candidateUrl: string): StreamFormat | null {
  const pathname = readLowerCasePathname(candidateUrl);

  const streamExtension = Object.keys(STREAM_FORMAT_BY_EXTENSION).find((extension) => pathname.endsWith(extension));
  if (streamExtension) {
    return STREAM_FORMAT_BY_EXTENSION[streamExtension];
  }

  return NATIVE_EXTENSIONS.some((extension) => pathname.endsWith(extension)) ? StreamFormat.NATIVE : null;
}

// True for links that are known to be a stream (HLS, DASH, FLV, MPEG-TS) just from their extension.
export function isStreamUrl(candidateUrl: string): boolean {
  const format = readStreamFormatFromExtension(candidateUrl);
  return format !== null && format !== StreamFormat.NATIVE;
}

// Works out how to play a link. When the extension is unknown (e.g. ".php" endpoints), the response's
// content type decides, if the server allows it; otherwise the browser tries to play it natively.
export async function detectStreamFormat(candidateUrl: string): Promise<StreamFormat> {
  const formatFromExtension = readStreamFormatFromExtension(candidateUrl);
  if (formatFromExtension) {
    return formatFromExtension;
  }

  const abortController = new AbortController();
  const timeoutId = window.setTimeout(() => abortController.abort(), DETECTION_TIMEOUT_MS);

  try {
    const response = await fetch(candidateUrl, { method: "HEAD", signal: abortController.signal });
    const contentType = response.headers.get("content-type") ?? "";
    const matchingFormat = STREAM_FORMAT_BY_CONTENT_TYPE.find((entry) => entry.pattern.test(contentType));
    return matchingFormat?.format ?? StreamFormat.NATIVE;
  } catch {
    return StreamFormat.NATIVE;
  } finally {
    window.clearTimeout(timeoutId);
  }
}
