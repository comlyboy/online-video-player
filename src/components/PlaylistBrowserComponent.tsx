"use client";

import { FormEvent, useMemo, useState } from "react";

import { DrawerSectionComponent } from "@/components/DrawerSectionComponent";
import { isPlayableVideoUrl } from "@/lib/video-url";
import { PlaylistStatus, usePlaylistStore } from "@/store/playlist-store";

const CHANNELS_PER_PAGE = 100;
const ALL_GROUPS_VALUE = "";

interface PlaylistBrowserComponentProps {
  activeVideoUrl: string;
  onSelectChannel: (channelUrl: string, channelName: string) => void;
}

export function PlaylistBrowserComponent({ activeVideoUrl, onSelectChannel }: PlaylistBrowserComponentProps) {
  const playlistUrl = usePlaylistStore((state) => state.playlistUrl);
  const channels = usePlaylistStore((state) => state.channels);
  const status = usePlaylistStore((state) => state.status);
  const errorMessage = usePlaylistStore((state) => state.errorMessage);
  const setPlaylistUrl = usePlaylistStore((state) => state.setPlaylistUrl);
  const loadPlaylist = usePlaylistStore((state) => state.loadPlaylist);

  const [searchText, setSearchText] = useState("");
  const [selectedGroup, setSelectedGroup] = useState(ALL_GROUPS_VALUE);
  const [visibleChannelCount, setVisibleChannelCount] = useState(CHANNELS_PER_PAGE);
  const [validationError, setValidationError] = useState("");

  const groupNames = useMemo(() => {
    const uniqueGroupNames = new Set<string>();
    channels.forEach((channel) => channel.groupTitle.split(";").forEach((groupName) => uniqueGroupNames.add(groupName.trim())));
    return [...uniqueGroupNames].filter(Boolean).sort((first, second) => first.localeCompare(second));
  }, [channels]);

  const matchingChannels = useMemo(() => {
    const normalizedSearchText = searchText.trim().toLowerCase();

    return channels.filter((channel) => {
      const matchesGroup =
        !selectedGroup || channel.groupTitle.split(";").some((groupName) => groupName.trim() === selectedGroup);
      const matchesSearch = !normalizedSearchText || channel.name.toLowerCase().includes(normalizedSearchText);
      return matchesGroup && matchesSearch;
    });
  }, [channels, searchText, selectedGroup]);

  function handleLoadPlaylist(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!isPlayableVideoUrl(playlistUrl)) {
      setValidationError("Enter a full playlist URL starting with http:// or https://");
      return;
    }

    setValidationError("");
    setSearchText("");
    setSelectedGroup(ALL_GROUPS_VALUE);
    setVisibleChannelCount(CHANNELS_PER_PAGE);
    void loadPlaylist(playlistUrl.trim());
  }

  const isLoading = status === PlaylistStatus.LOADING;
  const visibleChannels = matchingChannels.slice(0, visibleChannelCount);

  return (
    <DrawerSectionComponent title="Playlist">
      <form onSubmit={handleLoadPlaylist} className="flex flex-col gap-2">
        <label htmlFor="playlist-url" className="sr-only">
          Playlist URL (.m3u)
        </label>
        <div className="flex gap-2">
          <input
            id="playlist-url"
            type="url"
            inputMode="url"
            placeholder="Paste an .m3u playlist URL…"
            value={playlistUrl}
            onChange={(event) => setPlaylistUrl(event.target.value)}
            aria-invalid={Boolean(validationError)}
            aria-describedby={validationError ? "playlist-url-error" : undefined}
            className="min-w-0 flex-1 rounded-lg border border-border-default bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-accent"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="shrink-0 rounded-lg border border-border-default px-3 py-2 text-sm font-semibold text-foreground transition hover:border-accent hover:text-accent disabled:opacity-50"
          >
            {isLoading ? "Loading…" : "Load"}
          </button>
        </div>

        {validationError ? (
          <p id="playlist-url-error" role="alert" className="text-xs text-red-400">
            {validationError}
          </p>
        ) : null}
      </form>

      {status === PlaylistStatus.ERROR ? (
        <p role="alert" className="text-xs text-red-400">
          {errorMessage}
        </p>
      ) : null}

      {status === PlaylistStatus.READY ? (
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <label htmlFor="playlist-search" className="sr-only">
              Search channels
            </label>
            <input
              id="playlist-search"
              type="search"
              placeholder="Search channels…"
              value={searchText}
              onChange={(event) => {
                setSearchText(event.target.value);
                setVisibleChannelCount(CHANNELS_PER_PAGE);
              }}
              className="min-w-0 flex-1 rounded-lg border border-border-default bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-accent"
            />

            <label htmlFor="playlist-group" className="sr-only">
              Filter by group
            </label>
            <select
              id="playlist-group"
              value={selectedGroup}
              onChange={(event) => {
                setSelectedGroup(event.target.value);
                setVisibleChannelCount(CHANNELS_PER_PAGE);
              }}
              className="w-32 shrink-0 rounded-lg border border-border-default bg-background px-2 py-2 text-sm text-foreground outline-none transition focus:border-accent"
            >
              <option value={ALL_GROUPS_VALUE}>All groups</option>
              {groupNames.map((groupName) => (
                <option key={groupName} value={groupName}>
                  {groupName}
                </option>
              ))}
            </select>
          </div>

          <p role="status" className="text-[11px] text-foreground-muted">
            {matchingChannels.length.toLocaleString()} of {channels.length.toLocaleString()} channels
          </p>

          {visibleChannels.length > 0 ? (
            <ul className="flex max-h-72 flex-col gap-1 overflow-y-auto rounded-xl border border-border-default bg-background-card p-1.5">
              {visibleChannels.map((channel, index) => {
                const isCurrentlyPlaying = channel.url === activeVideoUrl;

                return (
                  <li key={`${channel.url}-${index}`}>
                    <button
                      type="button"
                      onClick={() => onSelectChannel(channel.url, channel.name)}
                      aria-current={isCurrentlyPlaying}
                      title={channel.url}
                      className={`flex w-full items-center justify-between gap-2 rounded-lg px-2.5 py-2 text-left transition hover:bg-accent-soft ${
                        isCurrentlyPlaying ? "bg-accent-soft" : ""
                      }`}
                    >
                      <span className="min-w-0">
                        <span className="block truncate text-sm text-foreground">{channel.name}</span>
                        <span className="block truncate text-[11px] text-foreground-muted">{channel.groupTitle}</span>
                      </span>
                      <span className="shrink-0 text-xs text-accent">{isCurrentlyPlaying ? "Playing" : "▶"}</span>
                    </button>
                  </li>
                );
              })}

              {matchingChannels.length > visibleChannelCount ? (
                <li>
                  <button
                    type="button"
                    onClick={() => setVisibleChannelCount(visibleChannelCount + CHANNELS_PER_PAGE)}
                    className="w-full rounded-lg px-2.5 py-2 text-center text-xs font-semibold text-accent transition hover:bg-accent-soft"
                  >
                    Show more
                  </button>
                </li>
              ) : null}
            </ul>
          ) : (
            <p className="text-xs text-foreground-muted">No channels match your search.</p>
          )}
        </div>
      ) : null}

      {status === PlaylistStatus.IDLE ? (
        <p className="text-xs text-foreground-muted">
          Load an .m3u playlist to browse and play its channels here. Only channels served over https that allow
          cross-origin requests will play.
        </p>
      ) : null}
    </DrawerSectionComponent>
  );
}
