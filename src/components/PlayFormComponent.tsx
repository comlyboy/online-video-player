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
      setValidationError("Enter a full video URL, starting with http:// or https://");
      return;
    }

    setValidationError("");
    onSubmitVideoUrl(videoUrlInput.trim());
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-border-default bg-background-elevated p-5">
      <label htmlFor="video-url" className="mb-3 block text-sm font-medium text-foreground">
        Video URL
      </label>

      <div className="flex flex-col gap-3 md:flex-row">
        <input
          id="video-url"
          type="url"
          inputMode="url"
          placeholder="https://example.com/video.mp4"
          value={videoUrlInput}
          onChange={(event) => setVideoUrlInput(event.target.value)}
          className="flex-1 rounded-xl border border-border-default bg-background px-5 py-4 text-foreground outline-none transition focus:border-accent"
        />

        <button
          type="submit"
          className="rounded-xl bg-accent-strong px-8 py-4 font-semibold text-background transition hover:opacity-90"
        >
          ▶ Play
        </button>
      </div>

      {validationError ? (
        <p role="alert" className="mt-3 text-sm text-red-400">
          {validationError}
        </p>
      ) : null}
    </form>
  );
}
