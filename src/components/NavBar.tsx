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
    <div className="flex items-center justify-between py-3 mb-2">
      {showBack ? (
        <motion.button
          onClick={() => router.back()}
          whileTap={{ scale: 0.9 }}
          className="w-10 h-10 rounded-2xl flex items-center justify-center"
          style={{ backgroundColor: '#F0EAE0' }}
          aria-label="Back"
        >
          <ChevronLeft size={20} color="#6B5E4A" />
        </motion.button>
      ) : (
        <div className="w-10" />
      )}

      {title && (
        <h2 className="font-bold text-base text-stone-800">{title}</h2>
      )}

      {showSettings ? (
        <motion.button
          onClick={() => router.push('/settings')}
          whileTap={{ scale: 0.9 }}
          className="w-10 h-10 rounded-2xl flex items-center justify-center"
          style={{ backgroundColor: '#F0EAE0' }}
          aria-label="Settings"
        >
          <Settings size={18} color="#6B5E4A" />
        </motion.button>
      ) : (
        <div className="w-10" />
      )}
    </div>
  );
}
