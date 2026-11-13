import { initIndexDatabase } from "@/database/db";
import { VideoMetadata } from "@/types/video-metadata";
import { WatchHistoryEntry } from "@/types/watch-history-entry";

const STORE_NAME = "watch-history";

let dbApi: ReturnType<typeof initIndexDatabase> | undefined;

function getDbApi() {
  if (!dbApi) {
    dbApi = initIndexDatabase({ stores: [STORE_NAME] });
  }
  return dbApi;
}

export async function recordWatchedVideo(videoUrl: string) {
  const existingEntry = await getDbApi().get<WatchHistoryEntry>({ key: videoUrl, storeName: STORE_NAME });
  const entry: WatchHistoryEntry = { videoUrl, watchedAt: Date.now(), metadata: existingEntry?.metadata };
  await getDbApi().put({ key: videoUrl, storeName: STORE_NAME, data: entry });
}

export async function saveWatchedVideoMetadata(videoUrl: string, metadata: VideoMetadata) {
  const existingEntry = await getDbApi().get<WatchHistoryEntry>({ key: videoUrl, storeName: STORE_NAME });
  if (!existingEntry) {
    return;
  }
  await getDbApi().put({ key: videoUrl, storeName: STORE_NAME, data: { ...existingEntry, metadata } });
}

export async function removeWatchedVideo(videoUrl: string) {
  await getDbApi().remove({ key: videoUrl, storeName: STORE_NAME });
}

export async function getWatchHistory() {
  const entries = await getDbApi().getAll<WatchHistoryEntry>({ storeName: STORE_NAME });
  return entries.sort((a, b) => b.watchedAt - a.watchedAt);
}

export async function clearWatchHistory() {
  await getDbApi().clear({ storeName: STORE_NAME });
}
