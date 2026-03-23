'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Ingredient } from '@/lib/ingredients';

interface Props {
  ingredient: Ingredient;
  selected: boolean;
  isStaple?: boolean;
  onToggle: (id: string) => void;
}

export default function IngredientCard({ ingredient, selected, isStaple, onToggle }: Props) {
  return (
    <motion.button
      onClick={() => onToggle(ingredient.id)}
      className={`relative flex flex-col items-center justify-center aspect-square rounded-[2rem] cursor-pointer select-none border transition-all duration-300 focus:outline-none backdrop-blur-xl ${selected ? 'bg-gradient-to-br from-white/10 to-white/5 border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.4)]' : 'bg-white/[0.02] border-white/[0.05] hover:bg-white/[0.08] hover:border-white/10 shadow-[0_4px_16px_rgba(0,0,0,0.2)]'}`}
      whileTap={{ scale: 0.88 }}
      whileHover={!selected ? { y: -4, scale: 1.02 } : {}}
      animate={
        selected
          ? {
              scale: [1, 1.08, 1.05],
              boxShadow: [`0 0 0px 0px ${ingredient.glowColor}00`, `0 0 25px 2px ${ingredient.glowColor}50`],
            }
          : {
              scale: 1,
              boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
            }
      }
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      aria-pressed={selected}
      aria-label={ingredient.name}
    >
      <motion.span
        className="text-[2.5rem] mb-2 leading-none drop-shadow-xl z-10 relative"
        animate={selected ? { scale: [1, 1.25, 1], rotate: [0, -10, 10, 0] } : { scale: 1, rotate: 0 }}
        transition={{ duration: 0.5 }}
      >
        {ingredient.emoji}
      </motion.span>
      <span
        className={`text-xs font-bold tracking-wide leading-none z-10 relative ${selected ? 'text-white drop-shadow-md' : 'text-zinc-400'}`}
      >
        {ingredient.name}
      </span>

      {/* Subtle background glow for selected state */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.15 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 rounded-[2rem] z-0 blur-xl mix-blend-screen"
            style={{ backgroundColor: ingredient.glowColor }}
          />
        )}
      </AnimatePresence>

      {/* Staple badge */}
      {isStaple && (
        <span className="absolute top-2 right-2 text-[9px] font-black bg-neon-amber/20 shadow-[0_0_12px_rgba(255,184,0,0.4)] text-amber-200 border border-neon-amber/40 rounded-full px-1.5 py-0.5 leading-none backdrop-blur-md z-20">
          ✓
        </span>
      )}

      {/* Selected checkmark glow ring */}
      <AnimatePresence>
        {selected && (
          <motion.div
            key="ring"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute inset-0 rounded-[2rem] border-2 z-20 pointer-events-none"
            style={{ borderColor: ingredient.glowColor }}
          />
        )}
      </AnimatePresence>
    </motion.button>
  );
}
