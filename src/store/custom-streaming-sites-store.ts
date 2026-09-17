import { create } from "zustand";

import { addCustomStreamingSite, getCustomStreamingSites, removeCustomStreamingSite } from "@/database";
import { CustomStreamingPlatform } from "@/types/custom-streaming-platform";

interface CustomStreamingSitesStore {
  customSites: CustomStreamingPlatform[];
  loadCustomSites: () => Promise<void>;
  addSite: (site: CustomStreamingPlatform) => Promise<void>;
  removeSite: (id: string) => Promise<void>;
}

export const useCustomStreamingSitesStore = create<CustomStreamingSitesStore>((set, get) => ({
  customSites: [],

  loadCustomSites: async () => {
    const customSites = await getCustomStreamingSites();
    set({ customSites });
  },

  addSite: async (site) => {
    await addCustomStreamingSite(site);
    set({ customSites: [...get().customSites, site] });
  },

  removeSite: async (id) => {
    await removeCustomStreamingSite(id);
    set({ customSites: get().customSites.filter((site) => site.id !== id) });
  },
}));
