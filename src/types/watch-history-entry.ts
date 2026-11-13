import { VideoMetadata } from "@/types/video-metadata";

export interface WatchHistoryEntry {
  videoUrl: string;
  watchedAt: number;
  // Absent until a lookup succeeds; stored with the video so it is never looked up twice.
  metadata?: VideoMetadata;
}
