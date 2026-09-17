"use client";

import { FormEvent, useState } from "react";

import { isPlayableVideoUrl } from "@/lib/video-url";
import { useCustomStreamingSitesStore } from "@/store/custom-streaming-sites-store";

const ACCENT_COLOR_PALETTE = ["#22d3ee", "#818cf8", "#fb7185", "#34d399", "#fbbf24"];

function pickAccentColor(existingSiteCount: number): string {
  return ACCENT_COLOR_PALETTE[existingSiteCount % ACCENT_COLOR_PALETTE.length];
}

export function ManageStreamingSitesComponent() {
  const customSites = useCustomStreamingSitesStore((state) => state.customSites);
  const addSite = useCustomStreamingSitesStore((state) => state.addSite);
  const removeSite = useCustomStreamingSitesStore((state) => state.removeSite);

  const [siteName, setSiteName] = useState("");
  const [siteUrl, setSiteUrl] = useState("");
  const [validationError, setValidationError] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!siteName.trim() || !isPlayableVideoUrl(siteUrl)) {
      setValidationError("Enter a name and a full URL starting with http:// or https://");
      return;
    }

    setValidationError("");
    addSite({
      id: `custom-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name: siteName.trim(),
      websiteUrl: siteUrl.trim(),
      accentColor: pickAccentColor(customSites.length),
      createdAt: Date.now(),
    });
    setSiteName("");
    setSiteUrl("");
  }

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-xs font-semibold uppercase tracking-wide text-foreground-muted">Your streaming sites</h3>

      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <label htmlFor="site-name" className="sr-only">
          Site name
        </label>
        <input
          id="site-name"
          type="text"
          placeholder="Site name"
          value={siteName}
          onChange={(event) => setSiteName(event.target.value)}
          className="rounded-lg border border-border-default bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-accent"
        />

        <label htmlFor="site-url" className="sr-only">
          Site URL
        </label>
        <input
          id="site-url"
          type="url"
          inputMode="url"
          placeholder="https://example.com"
          value={siteUrl}
          onChange={(event) => setSiteUrl(event.target.value)}
          className="rounded-lg border border-border-default bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-accent"
        />

        {validationError ? (
          <p role="alert" className="text-xs text-red-400">
            {validationError}
          </p>
        ) : null}

        <button
          type="submit"
          className="rounded-lg border border-border-default px-3 py-2 text-sm font-semibold text-foreground transition hover:border-accent hover:text-accent"
        >
          Add site
        </button>
      </form>

      {customSites.length > 0 ? (
        <ul className="flex flex-col gap-1.5">
          {customSites.map((site) => (
            <li
              key={site.id}
              className="flex items-center justify-between gap-2 rounded-lg border border-border-default px-3 py-2 text-sm"
            >
              <span className="flex min-w-0 items-center gap-2">
                <span
                  className="h-2 w-2 shrink-0 rounded-full"
                  style={{ backgroundColor: site.accentColor }}
                  aria-hidden="true"
                />
                <span className="truncate text-foreground">{site.name}</span>
              </span>

              <button
                type="button"
                onClick={() => removeSite(site.id)}
                aria-label={`Remove ${site.name}`}
                className="shrink-0 text-foreground-muted transition hover:text-red-400"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
