import { ReactNode } from "react";

export interface IconComponentProps {
  className?: string;
}

interface IconBaseComponentProps extends IconComponentProps {
  children: ReactNode;
  // Solid shapes (play, stop) are filled; the round-joined outline softens their corners.
  isFilled?: boolean;
}

// Every icon is drawn on a 24x24 grid and inherits the surrounding text color.
export function IconBaseComponent({ children, className = "h-4 w-4", isFilled = false }: IconBaseComponentProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill={isFilled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      {children}
    </svg>
  );
}
