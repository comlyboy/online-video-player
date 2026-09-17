import { initIndexDatabase } from "@/database/db";

const STORE_NAME = "video-cache";
const MAX_CACHEABLE_BYTES = 200 * 1024 * 1024;

let dbApi: ReturnType<typeof initIndexDatabase> | undefined;

function getDbApi() {
  if (!dbApi) {
    dbApi = initIndexDatabase({ stores: [STORE_NAME] });
  }
  return dbApi;
}

export async function getCachedVideoBlob(videoUrl: string) {
  return getDbApi().get<Blob>({ key: videoUrl, storeName: STORE_NAME });
}

export async function cacheVideoForReuse(videoUrl: string) {
  try {
    const response = await fetch(videoUrl);
    if (!response.ok) {
      return;
    }

    const contentLength = Number(response.headers.get("content-length") ?? "0");
    if (contentLength && contentLength > MAX_CACHEABLE_BYTES) {
      return;
    }

    const videoBlob = await response.blob();
    if (videoBlob.size > MAX_CACHEABLE_BYTES) {
      return;
    }

    await getDbApi().put({ key: videoUrl, storeName: STORE_NAME, data: videoBlob });
  } catch (error) {
    console.warn("Could not store this video for reuse:", error);
  }
}
