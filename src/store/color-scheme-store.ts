import { create } from "zustand";
import { persist } from "zustand/middleware";

import { COLOR_SCHEME_STORAGE_KEY, ColorScheme } from "@/types/color-scheme";

interface ColorSchemeStore {
  colorScheme: ColorScheme;
  setColorScheme: (colorScheme: ColorScheme) => void;
}

export const useColorSchemeStore = create<ColorSchemeStore>()(
  persist(
    (set) => ({
      colorScheme: ColorScheme.CYAN,
      setColorScheme: (colorScheme) => set({ colorScheme }),
    }),
    { name: COLOR_SCHEME_STORAGE_KEY },
  ),
);
