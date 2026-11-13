import { ReactNode, useId } from "react";

interface DrawerSectionComponentProps {
  title: string;
  action?: ReactNode;
  children: ReactNode;
}

export function DrawerSectionComponent({ title, action, children }: DrawerSectionComponentProps) {
  const headingId = useId();

  return (
    <section aria-labelledby={headingId} className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-2">
        <h3
          id={headingId}
          className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-foreground-muted"
        >
          <span className="h-3 w-0.5 rounded-full bg-accent" aria-hidden="true" />
          {title}
        </h3>
        {action}
      </div>
      {children}
    </section>
  );
}
