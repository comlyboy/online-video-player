import { PlaylistChannel } from "@/types/playlist-channel";

const EXTINF_PREFIX = "#EXTINF:";
const UNGROUPED_LABEL = "Ungrouped";

// The channel name follows the first comma that is not inside a quoted attribute value.
function readChannelName(extinfLine: string): string {
  let isInsideQuotes = false;

  for (let characterIndex = 0; characterIndex < extinfLine.length; characterIndex += 1) {
    const character = extinfLine[characterIndex];
    if (character === '"') {
      isInsideQuotes = !isInsideQuotes;
    } else if (character === "," && !isInsideQuotes) {
      return extinfLine.slice(characterIndex + 1).trim();
    }
  }

  return "";
}

function readGroupTitle(extinfLine: string): string {
  const groupMatch = extinfLine.match(/group-title="([^"]*)"/i);
  return groupMatch?.[1].trim() || UNGROUPED_LABEL;
}

function isHttpUrl(candidateLine: string): boolean {
  return /^https?:\/\//i.test(candidateLine);
}

export function parseM3uPlaylist(playlistText: string): PlaylistChannel[] {
  const channels: PlaylistChannel[] = [];
  let pendingExtinfLine: string | null = null;

  for (const rawLine of playlistText.split(/\r?\n/)) {
    const line = rawLine.trim();

    if (line.startsWith(EXTINF_PREFIX)) {
      pendingExtinfLine = line;
    } else if (line && !line.startsWith("#") && pendingExtinfLine) {
      if (isHttpUrl(line)) {
        channels.push({
          name: readChannelName(pendingExtinfLine) || line,
          url: line,
          groupTitle: readGroupTitle(pendingExtinfLine),
        });
      }
      pendingExtinfLine = null;
    }
  }

  return channels;
}
