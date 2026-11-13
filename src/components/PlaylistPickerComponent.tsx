"use client";

import { FormEvent, useEffect, useState } from "react";

import { CloseIconComponent } from "@/components/icons/CloseIconComponent";
import { isPlayableVideoUrl } from "@/lib/video-url";
import { usePlaylistStore } from "@/store/playlist-store";

export function PlaylistPickerComponent() {
  const savedPlaylists = usePlaylistStore((state) => state.savedPlaylists);
  const activePlaylistUrl = usePlaylistStore((state) => state.activePlaylistUrl);
  const addPlaylist = usePlaylistStore((state) => state.addPlaylist);
  const selectPlaylist = usePlaylistStore((state) => state.selectPlaylist);
  const removePlaylist = usePlaylistStore((state) => state.removePlaylist);

  const [playlistUrlInput, setPlaylistUrlInput] = useState("");
  const [validationError, setValidationError] = useState("");

  useEffect(() => {
    void usePlaylistStore.persist.rehydrate();
  }, []);

  function handleAddPlaylist(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!isPlayableVideoUrl(playlistUrlInput)) {
      setValidationError("Enter a full playlist URL starting with http:// or https://");
      return;
    }

    setValidationError("");
    void addPlaylist(playlistUrlInput.trim());
    setPlaylistUrlInput("");
  }

  return (
    <div className="flex flex-col gap-3">
      {savedPlaylists.length > 0 ? (
        <ul aria-label="Saved playlists" className="flex flex-wrap gap-1.5">
          {savedPlaylists.map((playlist) => {
            const isActive = playlist.url === activePlaylistUrl;

            return (
              <li
                key={playlist.url}
                className={`flex max-w-full items-center rounded-full border text-xs transition ${
                  isActive ? "border-accent bg-accent-soft text-accent" : "border-border-default text-foreground-muted"
                }`}
              >
                <button
                  type="button"
                  onClick={() => void selectPlaylist(playlist.url)}
                  aria-pressed={isActive}
                  title={playlist.url}
                  className="min-w-0 truncate py-1 pl-3 pr-1.5 font-semibold transition hover:text-accent"
                >
                  {playlist.name}
                </button>
                <button
                  type="button"
                  onClick={() => removePlaylist(playlist.url)}
                  aria-label={`Remove playlist ${playlist.name}`}
                  className="shrink-0 py-1 pl-0.5 pr-2.5 transition hover:text-red-400"
                >
                  <CloseIconComponent className="h-3 w-3" />
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}

      <form onSubmit={handleAddPlaylist} className="flex flex-col gap-2">
        <label htmlFor="playlist-url" className="sr-only">
          Add a playlist (.m3u URL)
        </label>
        <div className="flex gap-2">
          <input
            id="playlist-url"
            type="url"
            inputMode="url"
            placeholder="Add an .m3u playlist URL…"
            value={playlistUrlInput}
            onChange={(event) => setPlaylistUrlInput(event.target.value)}
            aria-invalid={Boolean(validationError)}
            aria-describedby={validationError ? "playlist-url-error" : undefined}
            className="min-w-0 flex-1 rounded-lg border border-border-default bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-accent"
          />
          <button
            type="submit"
            className="shrink-0 rounded-lg border border-border-default px-3 py-2 text-sm font-semibold text-foreground transition hover:border-accent hover:text-accent"
          >
            Add
          </button>
        </div>

        {validationError ? (
          <p id="playlist-url-error" role="alert" className="text-xs text-red-400">
            {validationError}
          </p>
        ) : null}
      </form>
    </div>
  );
}
