import { StreamFormat } from "@/lib/stream-format";

export interface StreamAttachment {
  destroy: () => void;
}

// Each library is loaded only when a stream of its kind is played, so none of them weigh on the first page load.
async function attachHlsStream(videoElement: HTMLVideoElement, streamUrl: string, onFatalError: (reason: string) => void) {
  const { default: Hls } = await import("hls.js");

  if (Hls.isSupported()) {
    const hlsPlayer = new Hls();
    hlsPlayer.loadSource(streamUrl);
    hlsPlayer.attachMedia(videoElement);
    hlsPlayer.on(Hls.Events.ERROR, (_event, errorData) => {
      if (errorData.fatal) {
        onFatalError(errorData.details);
      }
    });
    return { destroy: () => hlsPlayer.destroy() };
  }

  // Safari plays HLS by itself.
  if (videoElement.canPlayType("application/vnd.apple.mpegurl")) {
    videoElement.src = streamUrl;
    return null;
  }

  onFatalError("This browser cannot play HLS streams.");
  return null;
}

async function attachDashStream(videoElement: HTMLVideoElement, streamUrl: string, onFatalError: (reason: string) => void) {
  const dashjs = await import("dashjs");

  const dashPlayer = dashjs.MediaPlayer().create();
  dashPlayer.on("error", (errorEvent: unknown) => onFatalError(JSON.stringify(errorEvent)));
  dashPlayer.initialize(videoElement, streamUrl, false);
  return { destroy: () => dashPlayer.destroy() };
}

// mpegts.js plays both FLV and MPEG-TS.
async function attachMpegtsStream(
  format: StreamFormat,
  videoElement: HTMLVideoElement,
  streamUrl: string,
  onFatalError: (reason: string) => void,
) {
  const { default: mpegts } = await import("mpegts.js");

  if (!mpegts.getFeatureList().mseLivePlayback) {
    onFatalError("This browser cannot play FLV or MPEG-TS streams.");
    return null;
  }

  const mpegtsPlayer = mpegts.createPlayer({
    type: format === StreamFormat.FLV ? "flv" : "mpegts",
    url: streamUrl,
    isLive: format === StreamFormat.MPEG_TS,
  });
  mpegtsPlayer.on(mpegts.Events.ERROR, (errorType: string, errorDetail: string) => onFatalError(`${errorType}: ${errorDetail}`));
  mpegtsPlayer.attachMediaElement(videoElement);
  mpegtsPlayer.load();
  return { destroy: () => mpegtsPlayer.destroy() };
}

// Returns null when there is nothing to clean up (the browser played it natively, or it failed).
export async function attachStream(
  format: StreamFormat,
  videoElement: HTMLVideoElement,
  streamUrl: string,
  onFatalError: (reason: string) => void,
): Promise<StreamAttachment | null> {
  try {
    switch (format) {
      case StreamFormat.HLS:
        return await attachHlsStream(videoElement, streamUrl, onFatalError);
      case StreamFormat.DASH:
        return await attachDashStream(videoElement, streamUrl, onFatalError);
      case StreamFormat.FLV:
      case StreamFormat.MPEG_TS:
        return await attachMpegtsStream(format, videoElement, streamUrl, onFatalError);
      default:
        videoElement.src = streamUrl;
        return null;
    }
  } catch (error) {
    onFatalError(String(error));
    return null;
  }
}
