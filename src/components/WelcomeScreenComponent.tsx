export function WelcomeScreenComponent() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-background-elevated px-6">
      <div className="w-full max-w-md text-center">
        <div className="mb-7 flex justify-center gap-2.5" aria-hidden="true">
          {[0, 0.2, 0.4, 0.6, 0.8, 1, 1.2].map((delay) => (
            <span
              key={delay}
              className="h-[7px] w-[7px] animate-pulse rounded-full bg-accent shadow-[0_0_6px_1px_rgba(232,163,61,0.55)]"
              style={{ animationDelay: `${delay}s` }}
            />
          ))}
        </div>

        <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-accent">Now Screening</p>

        <h1 className="font-display mt-3 text-[clamp(48px,11vw,92px)] leading-[0.92] tracking-wide text-foreground uppercase">
          Online
          <br />
          Video
          <br />
          Player
        </h1>

        <p className="mx-auto mt-6 max-w-[38ch] text-sm leading-relaxed text-foreground-muted">
          Open the controls in the corner to pick a streaming platform, or drop in a direct video
          link to play it right here.
        </p>
      </div>
    </div>
  );
}
