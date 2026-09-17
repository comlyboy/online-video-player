import { StreamingPlatform } from "@/types/streaming-platform";

interface PlatformFrameComponentProps {
  platform: StreamingPlatform;
}

export function PlatformFrameComponent({ platform }: PlatformFrameComponentProps) {
  return (
    <iframe
      key={platform.id}
      src={platform.websiteUrl}
      title={`${platform.name} website`}
      className="h-full w-full bg-black"
      sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
      referrerPolicy="no-referrer"
      loading="lazy"
    />
  );
}
