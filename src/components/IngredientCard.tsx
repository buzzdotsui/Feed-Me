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
      className="relative flex flex-col items-center justify-center aspect-square rounded-2xl cursor-pointer select-none border-2 focus:outline-none"
      style={{
        backgroundColor: selected ? ingredient.color : '#F9F5EE',
        borderColor: selected ? ingredient.glowColor : '#E5DDD0',
      }}
      whileTap={{ scale: 0.92 }}
      animate={
        selected
          ? {
              scale: [1, 1.07, 1.04],
              boxShadow: [`0 0 0px 0px ${ingredient.glowColor}40`, `0 0 18px 6px ${ingredient.glowColor}60`],
            }
          : {
              scale: 1,
              boxShadow: '0 0 0px 0px transparent',
            }
      }
      transition={{ duration: 0.35, ease: 'easeOut' }}
      aria-pressed={selected}
      aria-label={ingredient.name}
    >
      <motion.span
        className="text-4xl mb-1 leading-none"
        animate={selected ? { scale: [1, 1.2, 1] } : { scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        {ingredient.emoji}
      </motion.span>
      <span
        className="text-xs font-semibold tracking-tight leading-none mt-1"
        style={{ color: selected ? '#1A1208' : '#6B5E4A' }}
      >
        {ingredient.name}
      </span>

      {/* Staple badge */}
      {isStaple && (
        <span className="absolute top-1 right-1 text-[8px] font-bold bg-amber-200 text-amber-800 rounded-full px-1 py-0.5 leading-none">
          ✓
        </span>
      )}

      {/* Selected checkmark */}
      <AnimatePresence>
        {selected && (
          <motion.span
            key="check"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="absolute top-1 left-1 w-4 h-4 rounded-full flex items-center justify-center text-[10px]"
            style={{ backgroundColor: ingredient.glowColor }}
          >
            ✓
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
