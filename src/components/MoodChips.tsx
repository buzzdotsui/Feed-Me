'use client';

import React from 'react';
import { motion } from 'framer-motion';
import type { MoodOption } from '@/lib/types';

/**
 * Displays a horizontal scrollable list of mood options for the user to select
 * Shows emoji, label, and description for each mood
 * 
 * @component
 * @example
 * ```tsx
 * <MoodChips 
 *   moods={moods} 
 *   selected={selectedMood}
 *   onSelect={handleMoodSelect}
 * />
 * ```
 */
interface MoodChipsProps {
  /** Array of mood options to display */
  moods: MoodOption[];
  /** Currently selected mood ID */
  selected: string;
  /** Callback fired when a mood is selected */
  onSelect: (id: string) => void;
}

const MoodChips: React.FC<MoodChipsProps> = ({ moods, selected, onSelect }): React.ReactElement => {
  return (
    <div className="flex gap-3 overflow-x-auto pb-2 px-4 -mx-4 scrollbar-none snap-x snap-mandatory">
      {moods.map((mood) => {
        const isSelected = selected === mood.id;
        return (
          <motion.button
            key={mood.id}
            onClick={(): void => onSelect(mood.id)}
            whileTap={{ scale: 0.92 }}
            className={`relative overflow-hidden snap-start flex-shrink-0 flex items-center gap-3 px-5 py-3 rounded-full border min-w-[130px] focus:outline-none transition-all duration-300 backdrop-blur-xl ${isSelected ? 'bg-gradient-to-r from-neon-orange/90 to-neon-amber/90 border-neon-amber/50 shadow-[0_4px_20px_rgba(255,107,0,0.4)]' : 'bg-white/5 border-white/10 hover:bg-white/10 shadow-[0_4px_10px_rgba(0,0,0,0.2)]'}`}
            type="button"
            aria-pressed={isSelected}
          >
            <span className="text-2xl z-10 relative drop-shadow-md">{mood.emoji}</span>
            <div className="flex flex-col items-start z-10 relative">
              <span
                className={`text-sm font-extrabold tracking-wide leading-tight ${isSelected ? 'text-white drop-shadow-md' : 'text-zinc-200'}`}
              >
                {mood.label}
              </span>
              <span
                className={`text-[10px] uppercase tracking-wider font-semibold leading-tight mt-0.5 ${isSelected ? 'text-orange-100/90' : 'text-zinc-500'}`}
              >
                {mood.description}
              </span>
            </div>
            
            {/* Shimmer effect for selected */}
            {isSelected && (
              <motion.div
                className="absolute inset-0 z-0 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
                initial={{ x: '-150%' }}
                animate={{ x: '200%' }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              />
            )}
          </motion.button>
        );
      })}
    </div>
  );
};

export default MoodChips;
