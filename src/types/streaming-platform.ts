export interface StreamingPlatform {
  id: string;
  name: string;
  websiteUrl: string;
  accentColor: string;
  /** Set to false when the site is known to send X-Frame-Options/CSP headers that block embedding. */
  canEmbed?: boolean;
}
