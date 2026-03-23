'use client';

import { motion } from 'framer-motion';
import { ChevronLeft, Settings } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Props {
  title?: string;
  showSettings?: boolean;
  showBack?: boolean;
}

export default function NavBar({ title, showSettings, showBack = true }: Props) {
  const router = useRouter();
  return (
    <div className="flex items-center justify-between py-4 mb-2 sticky top-0 z-50 bg-zinc-950/20 backdrop-blur-2xl border-b border-white/5 mx-[-16px] px-4 shadow-[0_4px_30px_rgba(0,0,0,0.1)]">
      {showBack ? (
        <motion.button
          onClick={() => router.back()}
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.05 }}
          className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 border border-white/10 hover:bg-white/10 transition-colors shadow-inner"
          aria-label="Back"
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
          onClick={() => router.push('/settings')}
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.05, rotate: 15 }}
          className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 border border-white/10 hover:bg-white/10 transition-all shadow-inner"
          aria-label="Settings"
        >
          <Settings size={18} className="text-zinc-300" />
        </motion.button>
      ) : (
        <div className="w-10" />
      )}
    </div>
  );
}
