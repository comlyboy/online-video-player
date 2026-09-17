import { initIndexDatabase } from "@/database/db";
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
  const entry: WatchHistoryEntry = { videoUrl, watchedAt: Date.now() };
  await getDbApi().put({ key: videoUrl, storeName: STORE_NAME, data: entry });
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
