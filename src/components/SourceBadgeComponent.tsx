interface SourceBadgeComponentProps {
  label: string;
}

export function SourceBadgeComponent({ label }: SourceBadgeComponentProps) {
  return (
    <div className="pointer-events-none absolute left-3.5 top-7 z-[2] flex items-center gap-1.5 rounded-full border border-border-default bg-background/55 px-3 py-1.5 backdrop-blur-sm">
      <span className="h-[7px] w-[7px] animate-pulse rounded-full bg-accent shadow-[0_0_7px_1px_rgba(232,163,61,0.6)]" aria-hidden="true" />
      <span className="font-mono text-[11.5px] tracking-wide text-foreground-muted">{label}</span>
    </div>
  );
}
