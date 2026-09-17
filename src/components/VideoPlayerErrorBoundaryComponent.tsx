"use client";

import { Component, ReactNode } from "react";

interface VideoPlayerErrorBoundaryComponentProps {
  children: ReactNode;
}

interface VideoPlayerErrorBoundaryComponentState {
  hasError: boolean;
}

export class VideoPlayerErrorBoundaryComponent extends Component<
  VideoPlayerErrorBoundaryComponentProps,
  VideoPlayerErrorBoundaryComponentState
> {
  state: VideoPlayerErrorBoundaryComponentState = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    console.error("Video player crashed:", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-background-elevated px-6 text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="h-10 w-10 text-accent"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="9" />
            <path strokeLinecap="round" d="M12 8v5" />
            <circle cx="12" cy="16" r="0.5" fill="currentColor" />
          </svg>
          <p className="text-sm font-semibold text-foreground">This video could not be loaded</p>
          <p className="max-w-xs text-xs leading-relaxed text-foreground-muted">
            The player ran into an unexpected error. Check the URL and try again.
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}
