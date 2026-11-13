import { VideoMetadata } from "@/types/video-metadata";

export enum WatchSource {
  VIDEO = "video",
  PLAYLIST = "playlist",
}

export interface WatchHistoryEntry {
  // Unique ID in the form YYYYMMDD-HHMMSS, assigned when the video is first added.
  id?: string;
  // Friendly name (e.g. a playlist channel name), shown instead of the file name when present.
  title?: string;
  // Where it was played from. Entries saved before this existed count as plain videos.
  source?: WatchSource;
  videoUrl: string;
  watchedAt: number;
  // Absent until a lookup succeeds; stored with the video so it is never looked up twice.
  metadata?: VideoMetadata;
}
