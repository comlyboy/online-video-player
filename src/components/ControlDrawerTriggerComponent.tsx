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
      aria-label="Open controls"
      className={`fixed bottom-20 right-6 z-20 flex h-14 w-14 items-center justify-center rounded-full bg-accent-strong text-background shadow-2xl transition hover:opacity-90 ${
        isOpen ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="h-6 w-6"
        aria-hidden="true"
      >
        <path strokeLinecap="round" d="M4 7h16M4 12h10M4 17h13" />
      </svg>
    </button>
  );
}
