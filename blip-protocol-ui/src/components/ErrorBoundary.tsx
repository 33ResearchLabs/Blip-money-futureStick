import React from "react";

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center p-6">
          <div className="text-center max-w-md">
            <h1 className="text-2xl font-semibold text-black dark:text-white mb-4">
              Something went wrong
            </h1>
            <p className="text-black/60 dark:text-white/60 mb-6">
              An unexpected error occurred. Please refresh the page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-lg font-medium"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
