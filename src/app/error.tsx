'use client';

import { useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';
import Link from 'next/link';

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * Next.js error boundary page
 * Catches unhandled errors in the app and displays a user-friendly error UI
 *
 * @see https://nextjs.org/docs/app/building-your-application/routing/error-handling
 */
export default function ErrorPage({ error, reset }: ErrorPageProps): JSX.Element {
  useEffect(() => {
    // Log error for monitoring
    if (process.env.NODE_ENV === 'development') {
      console.error('Error page caught:', {
        message: error.message,
        digest: error.digest,
        stack: error.stack,
        timestamp: new Date().toISOString(),
      });
    }
  }, [error]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-zinc-950 text-zinc-50 p-4">
      <div className="max-w-md w-full bg-zinc-900 border border-orange-500/30 rounded-lg p-6">
        {/* Error Icon */}
        <div className="flex justify-center mb-4">
          <div className="relative">
            <div className="absolute inset-0 bg-orange-500/20 rounded-full blur-xl" />
            <AlertTriangle className="w-12 h-12 text-orange-500 relative" />
          </div>
        </div>

        {/* Error Message */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold mb-2">Something Went Wrong</h1>
          <p className="text-zinc-400 text-sm">
            {error?.message || 'An unexpected error occurred while processing your request.'}
          </p>
        </div>

        {/* Development Error Details */}
        {process.env.NODE_ENV === 'development' && (
          <details className="mb-6 text-left bg-zinc-950 rounded p-3 text-xs text-red-400 max-h-40 overflow-auto border border-red-500/20">
            <summary className="cursor-pointer font-semibold text-red-400 hover:text-red-300">
              Error Details
            </summary>
            <pre className="mt-2 whitespace-pre-wrap break-words font-mono">
              {error?.stack || 'No stack trace available'}
            </pre>
          </details>
        )}

        {/* Actions */}
        <div className="flex flex-col gap-2">
          <button
            onClick={reset}
            className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105"
          >
            Try Again
          </button>

          <Link
            href="/"
            className="w-full text-center bg-zinc-800 hover:bg-zinc-700 text-zinc-50 font-semibold py-3 px-4 rounded-lg transition-colors border border-zinc-700 hover:border-zinc-600"
          >
            Back to Home
          </Link>
        </div>

        {/* Additional Help */}
        <p className="text-center text-zinc-500 text-xs mt-4">
          If the problem persists, try refreshing the page.
        </p>
      </div>
    </div>
  );
}
