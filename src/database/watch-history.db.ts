import { initIndexDatabase } from "@/database/db";
import { WatchHistoryEntry, WatchSource } from "@/types/watch-history-entry";

const STORE_NAME = "watch-history";

export interface RecordWatchedVideoOptions {
  title?: string;
  source?: WatchSource;
}

let dbApi: ReturnType<typeof initIndexDatabase> | undefined;

function getDbApi() {
  if (!dbApi) {
    dbApi = initIndexDatabase({ stores: [STORE_NAME] });
  }
  return dbApi;
}

export async function recordWatchedVideo(videoUrl: string, newVideoId: string, options: RecordWatchedVideoOptions = {}) {
  const existingEntry = await getDbApi().get<WatchHistoryEntry>({ key: videoUrl, storeName: STORE_NAME });
  const entry: WatchHistoryEntry = {
    videoUrl,
    watchedAt: Date.now(),
    id: existingEntry?.id ?? newVideoId,
    title: options.title ?? existingEntry?.title,
    source: options.source ?? existingEntry?.source,
    metadata: existingEntry?.metadata,
  };
  await getDbApi().put({ key: videoUrl, storeName: STORE_NAME, data: entry });
  return entry;
}

export async function updateWatchedVideo(videoUrl: string, changes: Pick<WatchHistoryEntry, "id" | "metadata">) {
  const existingEntry = await getDbApi().get<WatchHistoryEntry>({ key: videoUrl, storeName: STORE_NAME });
  if (!existingEntry) {
    return;
  }
  await getDbApi().put({ key: videoUrl, storeName: STORE_NAME, data: { ...existingEntry, ...changes } });
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
