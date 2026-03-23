'use client';

import { motion } from 'framer-motion';

interface Props {
  onPress: () => void;
  disabled?: boolean;
  selectedCount: number;
}

export default function FeedMeButton({ onPress, disabled, selectedCount: _selectedCount }: Props) {
  return (
    <div className="fixed bottom-0 left-0 right-0 flex justify-center px-4 pb-8 pt-6 z-40 bg-gradient-to-t from-[#050505] via-[#050505]/90 to-transparent">
      <motion.button
        onClick={onPress}
        disabled={disabled}
        className="w-full max-w-sm h-16 rounded-2xl font-black tracking-wide text-xl text-white focus:outline-none relative overflow-hidden backdrop-blur-md"
        style={{
          background: disabled
            ? 'rgba(255, 255, 255, 0.03)'
            : 'linear-gradient(135deg, #FF6B00 0%, #FFB800 100%)',
          boxShadow: disabled ? '0 4px 20px rgba(0,0,0,0.5)' : '0 0 30px rgba(255,107,0,0.6), inset 0 2px 2px rgba(255,255,255,0.3)',
          border: disabled ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(255,255,255,0.2)',
        }}
        animate={!disabled ? {
          boxShadow: [
            '0 10px 30px rgba(255,107,0,0.4)',
            '0 15px 50px rgba(255,184,0,0.6)',
            '0 10px 30px rgba(255,107,0,0.4)',
          ],
        } : {}}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        whileTap={!disabled ? { scale: 0.94, boxShadow: '0 2px 10px rgba(255,107,0,0.4)' } : {}}
        whileHover={!disabled ? { scale: 1.03 } : {}}
        aria-label="Feed Me"
      >
        <span className="relative z-10 flex items-center justify-center gap-2 drop-shadow-md">
          <span className="text-2xl pt-0.5">🍽️</span>
          {disabled ? 'Pick some ingredients' : 'Feed Me!'}
        </span>
        {/* Shine overlay */}
        {!disabled && (
          <motion.div
            className="absolute top-0 left-0 w-24 h-full pointer-events-none"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
              transform: 'skewX(-20deg)',
            }}
            animate={{ x: ['-100px', '450px'] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', repeatDelay: 1.5 }}
          />
        )}
      </motion.button>
    </div>
  );
}
