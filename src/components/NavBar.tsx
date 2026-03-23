'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, Settings } from 'lucide-react';
import { useRouter } from 'next/navigation';

/**
 * Navigation bar component that appears at the top of pages
 * Provides back button, title, and settings button
 * 
 * @component
 * @example
 * ```tsx
 * <NavBar title="Recipes" showSettings={true} showBack={true} />
 * ```
 */
interface NavBarProps {
  /** Title to display in the center of the navbar */
  title?: string;
  /** Whether to show the settings button in the top right */
  showSettings?: boolean;
  /** Whether to show the back button in the top left */
  showBack?: boolean;
}

const NavBar: React.FC<NavBarProps> = ({ title, showSettings, showBack = true }): React.ReactElement => {
  const router = useRouter();

  const handleBack = (): void => {
    router.back();
  };

  const handleSettings = (): void => {
    router.push('/settings');
  };

  return (
    <div className="flex items-center justify-between py-4 mb-2 sticky top-0 z-50 bg-zinc-950/20 backdrop-blur-2xl border-b border-white/5 mx-[-16px] px-4 shadow-[0_4px_30px_rgba(0,0,0,0.1)]">
      {showBack ? (
        <motion.button
          onClick={handleBack}
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.05 }}
          className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 border border-white/10 hover:bg-white/10 transition-colors shadow-inner hover:shadow-md"
          aria-label="Go back to previous page"
          type="button"
        >
          <ChevronLeft size={20} className="text-zinc-300" />
        </motion.button>
      ) : (
        <div className="w-10" />
      )}

      {title && (
        <h2 className="font-bold text-lg tracking-tight text-white drop-shadow-md">{title}</h2>
      )}

      {showSettings ? (
        <motion.button
          onClick={handleSettings}
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.05, rotate: 15 }}
          className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 border border-white/10 hover:bg-white/10 transition-all shadow-inner hover:shadow-md"
          aria-label="Open settings"
          type="button"
        >
          <Settings size={18} className="text-zinc-300" />
        </motion.button>
      ) : (
        <div className="w-10" />
      )}
    </div>
  );
};

export default NavBar;
