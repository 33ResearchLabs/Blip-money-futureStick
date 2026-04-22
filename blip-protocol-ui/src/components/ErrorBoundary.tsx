import React from "react";

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  stack?: string;
}

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught:", error);
    console.error("Component stack:", errorInfo.componentStack);
    this.setState({ stack: errorInfo.componentStack || "" });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center p-6">
          <div className="text-left max-w-2xl w-full">
            <h1 className="text-2xl font-semibold text-black dark:text-white mb-4">
              Something went wrong
            </h1>
            <pre className="text-xs text-red-600 dark:text-red-400 bg-black/5 dark:bg-white/5 p-4 rounded mb-4 overflow-auto max-h-64 whitespace-pre-wrap">
              {this.state.error?.message || "Unknown error"}
              {"\n\n"}
              {this.state.error?.stack}
            </pre>
            {this.state.stack && (
              <pre className="text-[10px] text-black/50 dark:text-white/40 bg-black/5 dark:bg-white/5 p-4 rounded mb-6 overflow-auto max-h-48 whitespace-pre-wrap">
                {this.state.stack}
              </pre>
            )}
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-white text-black border border-black/10 rounded-full font-semibold transition-all duration-200 ease-out hover:scale-[1.02] hover:bg-gray-50 hover:shadow-[0_4px_16px_rgba(0,0,0,0.10)] active:scale-[0.98]"
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
