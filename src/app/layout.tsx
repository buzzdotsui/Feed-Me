import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

/**
 * Optimized font loading with font-display: swap for better performance
 * Preloads only used font weights to minimize CLS
 */
const font = Inter({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '600', '700', '900'],
  preload: true,
});

/**
 * SEO Metadata configuration
 */
export const metadata: Metadata = {
  title: 'Feed Me — What\'s in your fridge?',
  description: 'AI-powered cooking assistant. Tell us what\'s in your fridge, get 3 perfect recipes in seconds.',
};

/**
 * Viewport configuration for mobile optimization
 */
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#FF6B00',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${font.className} antialiased bg-zinc-950 text-zinc-50 overflow-hidden relative`}>
        {/* Ambient background glows */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-orange-500/10 rounded-full blur-[120px] mix-blend-screen animate-blob" />
          <div className="absolute top-[20%] right-[-20%] w-[60%] h-[60%] bg-amber-500/10 rounded-full blur-[120px] mix-blend-screen animate-blob animation-delay-2000" />
          <div className="absolute bottom-[-20%] left-[20%] w-[60%] h-[60%] bg-orange-600/10 rounded-full blur-[120px] mix-blend-screen animate-blob animation-delay-4000" />
        </div>

        {/* Main interactive area */}
        <div className="relative z-10 h-dvh max-w-md mx-auto flex flex-col overflow-y-auto overflow-x-hidden scrollbar-none">
          {children}
        </div>
      </body>
    </html>
  );
}
