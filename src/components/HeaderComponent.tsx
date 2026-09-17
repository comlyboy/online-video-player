import Link from "next/link";

import { ColorSchemeSwitcherComponent } from "@/components/ColorSchemeSwitcherComponent";

export function HeaderComponent() {
  return (
    <header className="sticky top-0 z-50 border-b border-border-default bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-strong text-lg font-bold text-background">
            ▶
          </span>
          <span>
            <span className="block font-bold text-foreground">Online Video Player</span>
            <span className="block text-xs text-foreground-muted">Stream from anywhere</span>
          </span>
        </Link>

        <nav className="flex items-center gap-2 sm:gap-4">
          <ColorSchemeSwitcherComponent />
        </nav>
      </div>
    </header>
  );
}
