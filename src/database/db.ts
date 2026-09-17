import localforage from "localforage";

interface InitIndexDatabaseArgs {
  stores?: string[];
  databaseName?: string;
  options?: Omit<LocalForageOptions, "storeName" | "name">;
}

export function initIndexDatabase({ stores = [], databaseName = "online-video-player", options }: InitIndexDatabaseArgs = {}) {
  const storeInstances: Record<string, LocalForage> = {};

  stores.forEach((store) => {
    storeInstances[store] = localforage.createInstance({
      name: databaseName,
      storeName: store,
      description: options?.description || "Browser database",
      ...options,
    });
  });

  function getStore(storeName: string) {
    const store = storeInstances[storeName];
    if (!store) {
      throw new Error(`Store "${storeName}" not initialised`);
    }
    return store;
  }

  return {
    put: async <TData>({ key, storeName, data }: { key: string; storeName: string; data: TData }) => {
      const store = getStore(storeName);
      await store.setItem(key, data);
    },

    get: async <TData>({ key, storeName }: { key: string; storeName: string }) => {
      const store = getStore(storeName);
      return (await store.getItem<TData>(key)) ?? null;
    },

    remove: async ({ key, storeName }: { key: string; storeName: string }) => {
      const store = getStore(storeName);
      await store.removeItem(key);
    },

    getAll: async <TData>({ storeName }: { storeName: string }) => {
      const store = getStore(storeName);
      const entries: TData[] = [];
      await store.iterate<TData, void>((value) => {
        entries.push(value);
      });
      return entries;
    },

    clear: async ({ storeName }: { storeName: string }) => {
      const store = getStore(storeName);
      await store.clear();
    },
  };
}
