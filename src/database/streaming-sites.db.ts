import { initIndexDatabase } from "@/database/db";
import { CustomStreamingPlatform } from "@/types/custom-streaming-platform";

const STORE_NAME = "custom-streaming-sites";

let dbApi: ReturnType<typeof initIndexDatabase> | undefined;

function getDbApi() {
  if (!dbApi) {
    dbApi = initIndexDatabase({ stores: [STORE_NAME] });
  }
  return dbApi;
}

export async function addCustomStreamingSite(site: CustomStreamingPlatform) {
  await getDbApi().put({ key: site.id, storeName: STORE_NAME, data: site });
}

export async function removeCustomStreamingSite(id: string) {
  await getDbApi().remove({ key: id, storeName: STORE_NAME });
}

export async function getCustomStreamingSites() {
  const sites = await getDbApi().getAll<CustomStreamingPlatform>({ storeName: STORE_NAME });
  return sites.sort((a, b) => a.createdAt - b.createdAt);
}
