import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';

const font = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Feed Me — What\'s in your fridge?',
  description: 'AI-powered cooking assistant. Tell us what\'s in your fridge, get 3 perfect recipes in seconds.',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${font.className} antialiased`} style={{ backgroundColor: '#FDFAF5' }}>
        <div className="min-h-screen max-w-md mx-auto px-4 flex flex-col" style={{ backgroundColor: '#FDFAF5' }}>
          {children}
        </div>
      </body>
    </html>
  );
}
