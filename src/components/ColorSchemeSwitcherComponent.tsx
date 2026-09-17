"use client";

import { useEffect } from "react";

import { useColorSchemeStore } from "@/store/color-scheme-store";
import { colorSchemeOptions } from "@/types/color-scheme";

export function ColorSchemeSwitcherComponent() {
  const activeColorScheme = useColorSchemeStore((state) => state.colorScheme);
  const setColorScheme = useColorSchemeStore((state) => state.setColorScheme);

  useEffect(() => {
    document.documentElement.setAttribute("data-color-scheme", activeColorScheme);
  }, [activeColorScheme]);

  return (
    <div role="radiogroup" aria-label="Accent color scheme" className="flex items-center gap-1.5 rounded-lg border border-border-default p-1.5">
      {colorSchemeOptions.map((option) => {
        const isActive = option.scheme === activeColorScheme;

        return (
          <button
            key={option.scheme}
            type="button"
            role="radio"
            aria-checked={isActive}
            aria-label={`${option.label} accent`}
            title={option.label}
            onClick={() => setColorScheme(option.scheme)}
            className="h-6 w-6 rounded-full transition"
            style={{
              backgroundColor: option.swatchColor,
              outline: isActive ? `2px solid ${option.swatchColor}` : "none",
              outlineOffset: 2,
            }}
          />
        );
      })}
    </div>
  );
}
