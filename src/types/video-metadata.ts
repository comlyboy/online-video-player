export interface VideoMetadata {
  fileName: string;
  hostName: string;
  durationSeconds: number | null;
  widthPixels: number | null;
  heightPixels: number | null;
  contentType: string | null;
  sizeBytes: number | null;
}
