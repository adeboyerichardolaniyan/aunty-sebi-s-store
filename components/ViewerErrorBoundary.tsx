"use client";

import { Component, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export default class ViewerErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center w-full h-full min-h-[400px] bg-cream">
          <svg
            width="48"
            height="48"
            viewBox="0 0 48 48"
            fill="none"
            className="mb-4 text-warm-gray"
          >
            <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="2" />
            <path
              d="M16 28s2.5 4 8 4 8-4 8-4"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <circle cx="18" cy="20" r="2" fill="currentColor" />
            <circle cx="30" cy="20" r="2" fill="currentColor" />
          </svg>
          <p className="font-heading text-lg text-rich-black/70 mb-2">
            Unable to load 3D viewer
          </p>
          <p className="text-small text-rich-black/50 max-w-xs text-center">
            Your browser may not support WebGL, or the model failed to load.
            Try refreshing the page.
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}
