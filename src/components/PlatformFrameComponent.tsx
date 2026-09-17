import { StreamingPlatform } from "@/types/streaming-platform";

interface PlatformFrameComponentProps {
  platform: StreamingPlatform;
}

export function PlatformFrameComponent({ platform }: PlatformFrameComponentProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border-default bg-background-elevated px-4 py-3">
        <p className="text-sm text-foreground-muted">
          Viewing <span className="font-semibold text-foreground">{platform.name}</span> in an
          embedded frame. If it stays blank, that site is blocking embedding, open it directly instead.
        </p>

        <a
          href={platform.websiteUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-border-default px-4 py-2 text-sm font-semibold text-foreground transition hover:border-accent hover:text-accent"
        >
          Open in new tab
          <span aria-hidden="true">↗</span>
        </a>
      </div>

      <iframe
        key={platform.id}
        src={platform.websiteUrl}
        title={`${platform.name} website`}
        className="h-[75vh] w-full rounded-2xl border border-border-default bg-black"
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
        referrerPolicy="no-referrer"
        loading="lazy"
      />
    </div>
  );
}
