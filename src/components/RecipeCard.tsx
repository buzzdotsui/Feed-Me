'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Clock, ChevronRight } from 'lucide-react';
import { AIResult } from '@/lib/mockAI';
import { toggleFavorite, isFavorite } from '@/lib/storage';

interface Props {
  result: AIResult;
  index: number;
  onSelect: (id: string) => void;
}

const CARD_COLORS = [
  { bg: '#FFF4EC', accent: '#FF6B35', badge: '#FFE4D3' },
  { bg: '#F0FDF4', accent: '#16A34A', badge: '#DCFCE7' },
  { bg: '#EFF6FF', accent: '#2563EB', badge: '#DBEAFE' },
];

export default function RecipeCard({ result, index, onSelect }: Props) {
  const { recipe, matchScore, missingIngredients, substitutions } = result;
  const colors = CARD_COLORS[index % CARD_COLORS.length];
  const [faved, setFaved] = useState(() => isFavorite(recipe.id));

  function handleFav(e: React.MouseEvent) {
    e.stopPropagation();
    const updated = toggleFavorite(recipe.id);
    setFaved(updated.includes(recipe.id));
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.12, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="flex-shrink-0 w-[78vw] max-w-[300px] rounded-3xl p-5 cursor-pointer relative"
      style={{ backgroundColor: colors.bg, boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}
      onClick={() => onSelect(recipe.id)}
      whileTap={{ scale: 0.97 }}
    >
      {/* Favorite */}
      <button
        onClick={handleFav}
        className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center"
        style={{ backgroundColor: faved ? '#FFE4D3' : '#F3EDE6' }}
        aria-label="Toggle favorite"
      >
        <Heart
          size={18}
          fill={faved ? colors.accent : 'none'}
          stroke={faved ? colors.accent : '#9B8B78'}
        />
      </button>

      {/* Emoji illustration */}
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center text-4xl mb-4"
        style={{ backgroundColor: colors.badge }}
      >
        {recipe.emoji}
      </div>

      {/* Name */}
      <h3 className="font-bold text-lg text-stone-900 leading-tight pr-8 mb-2">
        {recipe.name}
      </h3>

      {/* Description */}
      <p className="text-sm text-stone-500 leading-snug mb-4 line-clamp-2">
        {recipe.description}
      </p>

      {/* Meta row */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center gap-1.5 text-stone-600">
          <Clock size={14} />
          <span className="text-sm font-medium">{recipe.time} min</span>
        </div>
        <div
          className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold"
          style={{ backgroundColor: colors.badge, color: colors.accent }}
        >
          {matchScore}% match
        </div>
      </div>

      {/* Missing ingredient warning */}
      {missingIngredients.length > 0 && substitutions.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4">
          <p className="text-xs text-amber-700 font-medium">
            💡 {substitutions[0].advice}
          </p>
        </div>
      )}

      {/* CTA */}
      <div
        className="flex items-center justify-between px-4 py-3 rounded-2xl"
        style={{ backgroundColor: colors.badge }}
      >
        <span className="text-sm font-bold" style={{ color: colors.accent }}>
          Start cooking
        </span>
        <ChevronRight size={16} color={colors.accent} />
      </div>
    </motion.div>
  );
}
