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
  { bgClass: 'bg-white/5 border-white/10', glowColor: 'rgba(255, 107, 0, 0.5)', accent: '#FF6B00', badgeClass: 'bg-neon-orange/20 text-orange-200 border border-neon-orange/30' },
  { bgClass: 'bg-white/5 border-white/10', glowColor: 'rgba(0, 232, 143, 0.5)', accent: '#00E88F', badgeClass: 'bg-neon-emerald/20 text-emerald-200 border border-neon-emerald/30' },
  { bgClass: 'bg-white/5 border-white/10', glowColor: 'rgba(0, 184, 255, 0.5)', accent: '#00B8FF', badgeClass: 'bg-neon-blue/20 text-blue-200 border border-neon-blue/30' },
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
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.12, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`flex-shrink-0 w-[80vw] max-w-[320px] rounded-[2rem] p-6 cursor-pointer relative backdrop-blur-2xl border shadow-[0_20px_40px_rgba(0,0,0,0.4)] ${colors.bgClass} overflow-hidden group`}
      onClick={() => onSelect(recipe.id)}
      whileTap={{ scale: 0.96 }}
      whileHover={{ y: -8, boxShadow: `0 30px 60px ${colors.glowColor}` }}
    >
      {/* Ambient Glow */}
      <div 
        className="absolute top-0 right-0 w-32 h-32 rounded-full blur-[60px] opacity-30 pointer-events-none transition-opacity group-hover:opacity-50"
        style={{ backgroundColor: colors.accent }}
      />

      {/* Favorite */}
      <button
        onClick={handleFav}
        className="absolute top-5 right-5 w-10 h-10 rounded-full flex items-center justify-center bg-white/10 backdrop-blur-xl border border-white/20 hover:bg-white/20 transition-colors shadow-lg z-20"
        aria-label="Toggle favorite"
      >
        <Heart
          size={20}
          fill={faved ? colors.accent : 'none'}
          stroke={faved ? colors.accent : '#e4e4e7'}
        />
      </button>

      {/* Emoji illustration */}
      <div
        className={`w-20 h-20 rounded-[1.5rem] flex items-center justify-center text-5xl mb-5 shadow-inner backdrop-blur-md relative z-10 ${colors.badgeClass}`}
      >
        <span className="drop-shadow-lg">{recipe.emoji}</span>
      </div>

      {/* Name */}
      <h3 className="font-extrabold text-2xl text-white leading-tight pr-10 mb-3 drop-shadow-md relative z-10">
        {recipe.name}
      </h3>

      {/* Description */}
      <p className="text-sm text-zinc-300 leading-relaxed mb-5 line-clamp-2 font-medium relative z-10">
        {recipe.description}
      </p>

      {/* Meta row */}
      <div className="flex items-center gap-3 mb-5 relative z-10">
        <div className="flex items-center gap-1.5 text-zinc-200 bg-white/10 px-3 py-1.5 rounded-full backdrop-blur-md border border-white/5">
          <Clock size={16} />
          <span className="text-sm font-semibold tracking-wide">{recipe.time} min</span>
        </div>
        <div
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold tracking-wide backdrop-blur-md ${colors.badgeClass}`}
        >
          <span className="text-lg leading-none pt-0.5">✨</span> {matchScore}% match
        </div>
      </div>

      {/* Missing ingredient warning */}
      {missingIngredients.length > 0 && substitutions.length > 0 && (
        <div className="bg-neon-amber/10 border border-neon-amber/20 rounded-2xl p-4 mb-5 backdrop-blur-md shadow-inner relative z-10">
          <p className="text-xs text-amber-100 font-semibold leading-relaxed">
            <span className="drop-shadow inline-block mr-1">💡</span> {substitutions[0].advice}
          </p>
        </div>
      )}

      {/* CTA */}
      <div
        className={`flex items-center justify-between px-5 py-4 rounded-2xl border transition-all duration-300 group-hover:brightness-110 relative z-10 ${colors.badgeClass}`}
        style={{ borderColor: `${colors.accent}40` }}
      >
        <span className="text-base font-bold tracking-wide">
          Start cooking
        </span>
        <motion.div
           animate={{ x: [0, 4, 0] }}
           transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronRight size={20} />
        </motion.div>
      </div>
    </motion.div>
  );
}
