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
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6"
      >
        <p className="text-sm font-semibold text-orange-400 mb-1 tracking-wide uppercase">
          AI Kitchen Assistant
        </p>
        <h1 className="text-3xl font-extrabold text-stone-900 leading-tight">
          What's in your<br />
          <span className="text-orange-500">fridge? 🧊</span>
        </h1>
        <p className="text-stone-500 text-sm mt-2">
          Tap what you have. We'll find you something delicious.
        </p>
      </motion.div>

      {/* Pantry staples notice */}
      {pantry.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-4 px-3 py-2 bg-amber-50 border border-amber-200 rounded-2xl flex items-center gap-2"
        >
          <span className="text-sm">🧂</span>
          <span className="text-xs text-amber-700 font-medium">
            Salt, pepper, oil & more already included from your pantry
          </span>
        </motion.div>
      )}

      {/* Ingredient grid */}
      <div className="mb-6">
        <h2 className="text-xs font-bold text-stone-500 uppercase tracking-widest mb-3">
          Ingredient Wall
        </h2>
        <div className="grid grid-cols-5 gap-2.5">
          {INGREDIENTS.map((ingredient, i) => (
            <motion.div
              key={ingredient.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.04, duration: 0.35 }}
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
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-4 text-center"
        >
          <span className="inline-flex items-center gap-1.5 text-sm font-semibold px-3 py-1.5 rounded-full"
            style={{ backgroundColor: '#FFE4D3', color: '#C2410C' }}>
            {selected.map(id => INGREDIENTS.find(i => i.id === id)?.emoji).join(' ')}
            <span className="ml-1">{selected.length} ingredient{selected.length !== 1 ? 's' : ''} selected</span>
          </span>
        </motion.div>
      )}

      {/* Mood selector */}
      <div className="mb-6">
        <h2 className="text-xs font-bold text-stone-500 uppercase tracking-widest mb-3">
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
