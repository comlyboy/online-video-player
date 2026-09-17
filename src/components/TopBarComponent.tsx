interface TopBarComponentProps {
  onGoToWelcome: () => void;
}

export function TopBarComponent({ onGoToWelcome }: TopBarComponentProps) {
  return (
    <header className="flex h-12 shrink-0 items-center border-b border-border-default bg-background-elevated px-4">
      <button
        type="button"
        onClick={onGoToWelcome}
        className="flex items-center gap-2 text-sm font-semibold text-foreground transition hover:text-accent"
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent-strong text-xs font-bold text-background">
          ▶
        </span>
        Online Video Player
      </button>
    </header>
  );
}
