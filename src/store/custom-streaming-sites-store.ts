import { create } from "zustand";

import { addCustomStreamingSite, getCustomStreamingSites, removeCustomStreamingSite } from "@/database";
import { CustomStreamingPlatform } from "@/types/custom-streaming-platform";

interface CustomStreamingSitesStore {
  customSites: CustomStreamingPlatform[];
  loadCustomSites: () => Promise<void>;
  addSite: (site: CustomStreamingPlatform) => Promise<void>;
  removeSite: (id: string) => Promise<void>;
}

// Browser storage can be unavailable (private mode, blocked site data, quota exceeded).
// A failed write is logged and the in-memory list still updates, so the app keeps working for this session.
export const useCustomStreamingSitesStore = create<CustomStreamingSitesStore>((set, get) => ({
  customSites: [],

  loadCustomSites: async () => {
    try {
      const customSites = await getCustomStreamingSites();
      set({ customSites });
    } catch (error) {
      console.warn("Could not load custom streaming sites:", error);
    }
  },

  addSite: async (site) => {
    try {
      await addCustomStreamingSite(site);
    } catch (error) {
      console.warn("Could not save this streaming site:", error);
    }
    set({ customSites: [...get().customSites, site] });
  },

  removeSite: async (id) => {
    try {
      await removeCustomStreamingSite(id);
    } catch (error) {
      console.warn("Could not remove this streaming site:", error);
    }
    set({ customSites: get().customSites.filter((site) => site.id !== id) });
  },
}));
