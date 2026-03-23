'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import IngredientCard from '@/components/IngredientCard';
import MoodChips from '@/components/MoodChips';
import FeedMeButton from '@/components/FeedMeButton';
import NavBar from '@/components/NavBar';
import { INGREDIENTS } from '@/lib/ingredients';
import { MOODS } from '@/lib/recipes';
import { getPantryStaples, saveSelections } from '@/lib/storage';

export default function HomePage() {
  const router = useRouter();
  const [selected, setSelected] = useState<string[]>([]);
  const [mood, setMood] = useState<string>('quick_win');
  const [pantry, setPantry] = useState<string[]>([]);

  useEffect(() => {
    setPantry(getPantryStaples());
  }, []);

  function toggleIngredient(id: string) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  }

  function handleFeedMe() {
    saveSelections(selected, mood);
    router.push('/results');
  }

  const hasSelection = selected.length > 0 || pantry.length > 0;

  return (
    <div className="flex flex-col min-h-screen pb-28">
      {/* Header */}
      <NavBar showBack={false} showSettings />

      {/* Hero headline */}
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="mb-8 mt-2 relative z-10 px-4"
      >
        <p className="text-xs font-bold text-neon-orange mb-3 tracking-[0.2em] uppercase drop-shadow-md">
          AI Kitchen Assistant
        </p>
        <h1 className="text-5xl font-black text-white leading-[1.1] tracking-tighter drop-shadow-lg">
          What's in your<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B00] via-[#FFB800] to-[#00E88F] flex items-center gap-2 animate-pulse-slow">
            fridge? <span className="text-4xl drop-shadow-lg">🧊</span>
          </span>
        </h1>
        <p className="text-zinc-400 text-sm mt-4 font-medium max-w-[280px] leading-relaxed">
          Tap what you have. We'll find something delicious.
        </p>
      </motion.div>

      {/* Pantry staples notice */}
      {pantry.length > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-6 mx-4 px-4 py-3 bg-neon-amber/10 border border-neon-amber/20 backdrop-blur-xl rounded-2xl flex items-center gap-3 shadow-[0_4px_20px_rgba(255,184,0,0.15)]"
        >
          <span className="text-xl drop-shadow-md">🧂</span>
          <span className="text-xs text-amber-100/90 font-semibold tracking-wide leading-snug">
            Salt, pepper, oil & more included from pantry
          </span>
        </motion.div>
      )}

      {/* Ingredient grid */}
      <div className="mb-8 relative z-10 px-4">
        <h2 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.15em] mb-4 pl-1">
          Ingredient Wall
        </h2>
        <div className="grid grid-cols-4 gap-3">
          {INGREDIENTS.map((ingredient, i) => (
            <motion.div
              key={ingredient.id}
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: i * 0.03, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <IngredientCard
                ingredient={ingredient}
                selected={selected.includes(ingredient.id)}
                isStaple={pantry.includes(ingredient.id)}
                onToggle={toggleIngredient}
              />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Selected count */}
      {selected.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 text-center sticky bottom-[104px] z-30 pointer-events-none"
        >
          <span className="inline-flex items-center gap-2 text-sm font-bold px-5 py-2.5 rounded-full backdrop-blur-2xl border border-neon-orange/40 shadow-[0_8px_32px_rgba(255,107,0,0.4)] text-orange-50 bg-[#050505]/80 pointer-events-auto">
            <span className="flex gap-1 drop-shadow">{selected.map(id => INGREDIENTS.find(i => i.id === id)?.emoji).slice(0, 3)}</span>
            {selected.length > 3 && <span className="opacity-70 text-xs">+{selected.length - 3}</span>}
            <span className="ml-1 opacity-90">{selected.length} selected</span>
          </span>
        </motion.div>
      )}

      {/* Mood selector */}
      <div className="mb-[120px] relative z-10">
        <h2 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.15em] mb-4 px-5">
          What's your mood?
        </h2>
        <MoodChips moods={MOODS} selected={mood} onSelect={setMood} />
      </div>

      {/* Feed Me sticky button */}
      <FeedMeButton
        onPress={handleFeedMe}
        disabled={!hasSelection}
        selectedCount={selected.length}
      />
    </div>
  );
}
