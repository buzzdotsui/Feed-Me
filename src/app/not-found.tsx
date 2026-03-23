import Link from 'next/link';
import { SearchX } from 'lucide-react';

/**
 * 404 Not Found page
 * Displays when a user tries to access a page that doesn't exist
 *
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/not-found
 */
export default function NotFoundPage(): JSX.Element {
  return (
    <div className="flex items-center justify-center min-h-screen bg-zinc-950 text-zinc-50 p-4">
      <div className="max-w-md w-full bg-zinc-900 border border-amber-500/30 rounded-lg p-6">
        {/* 404 Icon */}
        <div className="flex justify-center mb-4">
          <div className="relative">
            <div className="absolute inset-0 bg-amber-500/20 rounded-full blur-xl" />
            <SearchX className="w-12 h-12 text-amber-500 relative" />
          </div>
        </div>

        {/* Message */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold mb-2">404</h1>
          <h2 className="text-xl font-semibold mb-2">Page Not Found</h2>
          <p className="text-zinc-400 text-sm">
            The recipe you're looking for doesn't exist. Let's get you back to cooking!
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2">
          <Link
            href="/"
            className="w-full text-center bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105"
          >
            Back to Feed Me
          </Link>

          <Link
            href="/results"
            className="w-full text-center bg-zinc-800 hover:bg-zinc-700 text-zinc-50 font-semibold py-3 px-4 rounded-lg transition-colors border border-zinc-700 hover:border-zinc-600"
          >
            View Recipes
          </Link>
        </div>
      </div>
    </div>
  );
}
