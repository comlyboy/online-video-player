"use client";

import { useControlDrawerStore } from "@/store/control-drawer-store";

export function ControlDrawerTriggerComponent() {
  const isOpen = useControlDrawerStore((state) => state.isOpen);
  const toggle = useControlDrawerStore((state) => state.toggle);

  return (
    <button
      type="button"
      onClick={toggle}
      aria-expanded={isOpen}
      aria-controls="control-drawer"
      className="flex h-12 w-full shrink-0 items-center justify-center gap-2 border-t border-border-default bg-background-elevated text-sm font-semibold text-foreground-muted transition hover:text-accent"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        className="h-4 w-4"
        aria-hidden="true"
      >
        <path strokeLinecap="round" d="M4 7h16M4 12h10M4 17h13" />
      </svg>
      Controls
    </button>
  );
}
