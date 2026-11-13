import { VideoMetadata } from "@/types/video-metadata";

export interface WatchHistoryEntry {
  // Unique ID in the form YYYYMMDD-HHMMSS, assigned when the video is first added.
  id?: string;
  videoUrl: string;
  watchedAt: number;
  // Absent until a lookup succeeds; stored with the video so it is never looked up twice.
  metadata?: VideoMetadata;
}
