"use client";

import { FormEvent, useState } from "react";

import { isPlayableVideoUrl } from "@/lib/video-url";

interface PlayFormComponentProps {
  initialVideoUrl: string;
  onSubmitVideoUrl: (videoUrl: string) => void;
}

export function PlayFormComponent({ initialVideoUrl, onSubmitVideoUrl }: PlayFormComponentProps) {
  const [videoUrlInput, setVideoUrlInput] = useState(initialVideoUrl);
  const [validationError, setValidationError] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!isPlayableVideoUrl(videoUrlInput)) {
      setValidationError("Enter a full URL starting with http:// or https://");
      return;
    }

    setValidationError("");
    onSubmitVideoUrl(videoUrlInput.trim());
  }

  return (
    <form onSubmit={handleSubmit} className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
      <label htmlFor="video-url" className="sr-only">
        Video URL
      </label>

      <input
        id="video-url"
        type="url"
        inputMode="url"
        placeholder="Paste a direct video URL…"
        value={videoUrlInput}
        onChange={(event) => setVideoUrlInput(event.target.value)}
        aria-invalid={Boolean(validationError)}
        aria-describedby={validationError ? "video-url-error" : undefined}
        className="min-w-0 flex-1 rounded-lg border border-border-default bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-accent"
      />

      <button
        type="submit"
        className="shrink-0 rounded-lg bg-accent-strong px-4 py-2 text-sm font-semibold text-background transition hover:opacity-90"
      >
        ▶ Play
      </button>

      {validationError ? (
        <p id="video-url-error" role="alert" className="basis-full text-xs text-red-400">
          {validationError}
        </p>
      ) : null}
    </form>
  );
}
