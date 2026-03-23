'use client';

import React, { ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * React Error Boundary component for handling errors in the component tree
 * Catches errors during rendering and displays a user-friendly error UI
 *
 * @example
 * ```tsx
 * <ErrorBoundary>
 *   <SomeComponent />
 * </ErrorBoundary>
 * ```
 */
export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // Log error for debugging
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', {
        error,
        errorInfo,
        timestamp: new Date().toISOString(),
      });
    }
  }

  resetError = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="flex items-center justify-center min-h-screen bg-zinc-950 text-zinc-50 p-4">
            <div className="max-w-md w-full bg-zinc-900 border border-orange-500/30 rounded-lg p-6 text-center">
              <div className="flex justify-center mb-4">
                <AlertTriangle className="w-12 h-12 text-orange-500" />
              </div>

              <h2 className="text-xl font-semibold mb-2">Oops! Something went wrong</h2>

              <p className="text-zinc-400 mb-4 text-sm">
                {this.state.error?.message ||
                  'An unexpected error occurred. Please try again.'}
              </p>

              {process.env.NODE_ENV === 'development' && (
                <details className="mb-4 text-left bg-zinc-950 rounded p-3 text-xs text-red-400 max-h-32 overflow-auto">
                  <summary className="cursor-pointer font-semibold">Error Details</summary>
                  <pre className="mt-2 whitespace-pre-wrap break-words">
                    {this.state.error?.stack}
                  </pre>
                </details>
              )}

              <div className="flex gap-2">
                <button
                  onClick={this.resetError}
                  className="flex-1 bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 font-medium py-2 px-4 rounded transition-colors"
                >
                  Try Again
                </button>
                <button
                  onClick={() => window.location.href = '/'}
                  className="flex-1 bg-zinc-700 hover:bg-zinc-600 text-zinc-50 font-medium py-2 px-4 rounded transition-colors"
                >
                  Home
                </button>
              </div>
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
