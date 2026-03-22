'use client';

import { motion } from 'framer-motion';

interface Props {
  onPress: () => void;
  disabled?: boolean;
  selectedCount: number;
}

export default function FeedMeButton({ onPress, disabled, selectedCount }: Props) {
  return (
    <div className="fixed bottom-0 left-0 right-0 flex justify-center px-4 pb-6 pt-3 z-40"
      style={{ background: 'linear-gradient(to top, #FDFAF5 70%, transparent)' }}>
      <motion.button
        onClick={onPress}
        disabled={disabled}
        className="w-full max-w-sm h-16 rounded-2xl font-bold text-xl text-white focus:outline-none relative overflow-hidden"
        style={{
          background: disabled
            ? 'linear-gradient(135deg, #D1C5B5, #B8AD9E)'
            : 'linear-gradient(135deg, #FF6B35 0%, #FF8C5A 50%, #E85A24 100%)',
          boxShadow: disabled ? 'none' : '0 8px 32px rgba(255, 107, 53, 0.45)',
        }}
        animate={!disabled ? {
          boxShadow: [
            '0 8px 24px rgba(255,107,53,0.35)',
            '0 12px 40px rgba(255,107,53,0.55)',
            '0 8px 24px rgba(255,107,53,0.35)',
          ],
        } : {}}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        whileTap={!disabled ? { scale: 0.96, boxShadow: '0 2px 8px rgba(255,107,53,0.3)' } : {}}
        whileHover={!disabled ? { scale: 1.02 } : {}}
        aria-label="Feed Me"
      >
        <span className="relative z-10 flex items-center justify-center gap-2">
          <span className="text-2xl">🍽️</span>
          {disabled ? 'Pick some ingredients first' : 'Feed Me'}
        </span>
        {/* Shine overlay */}
        {!disabled && (
          <motion.div
            className="absolute top-0 left-0 w-20 h-full pointer-events-none"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)',
            }}
            animate={{ x: ['-80px', '420px'] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', repeatDelay: 1 }}
          />
        )}
      </motion.button>
    </div>
  );
}
