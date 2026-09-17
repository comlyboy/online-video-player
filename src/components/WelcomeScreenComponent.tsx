"use client";

import { FormEvent, useState } from "react";

import { streamingPlatforms } from "@/data/streaming-platforms";
import { CUSTOM_URL_TAB_ID } from "@/lib/watch-tabs";

interface WelcomeScreenComponentProps {
  onSelectTab: (tabId: string) => void;
}

export function WelcomeScreenComponent({ onSelectTab }: WelcomeScreenComponentProps) {
  const [selectedTabId, setSelectedTabId] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (selectedTabId) {
      onSelectTab(selectedTabId);
    }
  }

  return (
    <div className="flex h-full w-full items-center justify-center bg-background-elevated px-6">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-strong text-2xl font-bold text-background">
          ▶
        </div>

        <h1 className="text-2xl font-bold text-foreground">Welcome to Online Video Player</h1>

        <p className="mt-3 text-sm leading-relaxed text-foreground-muted">
          Choose a streaming platform to open it in an embedded window, or pick Custom URL to paste
          a direct video link and play it right here.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-3 sm:flex-row">
          <label htmlFor="platform-select" className="sr-only">
            Choose what to watch
          </label>

          <select
            id="platform-select"
            value={selectedTabId}
            onChange={(event) => setSelectedTabId(event.target.value)}
            className="flex-1 rounded-xl border border-border-default bg-background px-4 py-3 text-sm text-foreground outline-none transition focus:border-accent"
          >
            <option value="" disabled>
              Select a platform…
            </option>
            {streamingPlatforms.map((platform) => (
              <option key={platform.id} value={platform.id}>
                {platform.name}
              </option>
            ))}
            <option value={CUSTOM_URL_TAB_ID}>Custom URL</option>
          </select>

          <button
            type="submit"
            disabled={!selectedTabId}
            className="shrink-0 rounded-xl bg-accent-strong px-6 py-3 text-sm font-semibold text-background transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
}
