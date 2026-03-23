'use client';

import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import NavBar from '@/components/NavBar';
import RecipeCard from '@/components/RecipeCard';
import LoadingScreen from '@/components/LoadingScreen';
import { generateRecipes, AIResult } from '@/lib/mockAI';
import { getSelections, getPantryStaples } from '@/lib/storage';


export default function ResultsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState<AIResult[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      const selections = getSelections();
      const pantry = getPantryStaples();
      if (selections) {
        const recipes = generateRecipes(selections.ingredients, pantry, selections.mood);
        setResults(recipes);
      }
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  function handleSelect(id: string) {
    router.push(`/recipe/${id}`);
  }

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <NavBar title="Finding recipes…" />
        <LoadingScreen />
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="flex flex-col min-h-screen">
        <NavBar title="Hmm…" />
        <div className="flex flex-col items-center justify-center flex-1 gap-5 px-6 text-center">
          <span className="text-7xl drop-shadow-xl mb-2">🤔</span>
          <h2 className="text-3xl font-black text-white tracking-tight drop-shadow-md">
            The fridge is a mystery
          </h2>
          <p className="text-zinc-400 text-sm leading-relaxed max-w-[280px]">
            We couldn't find recipes for those ingredients. Try selecting more, or switch moods!
          </p>
          <motion.button
            onClick={() => router.back()}
            whileTap={{ scale: 0.94 }}
            className="px-8 py-4 rounded-2xl font-black text-white mt-4 backdrop-blur-md relative overflow-hidden group shadow-[0_8px_24px_rgba(255,107,0,0.3)]"
            style={{ background: 'linear-gradient(135deg, #FF6B00, #FFB800)' }}
          >
            <span className="relative z-10">Try again</span>
            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
          </motion.button>
        </div>
      </div>
    );
  }

  const selectedIngredients = getSelections()?.ingredients ?? [];
  const pantry = getPantryStaples();

  return (
    <div className="flex flex-col min-h-screen">
      <NavBar title="Your recipes 🍽️" />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -16, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="mb-8 mt-2 relative z-10 px-4"
      >
        <h1 className="text-4xl font-black text-white mb-2 tracking-tighter leading-[1.1] drop-shadow-md">
          We found <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-orange via-neon-amber to-neon-emerald animate-pulse-slow inline-block mt-1">
            {results.length} recipes!
          </span>
        </h1>
        <p className="text-zinc-400 text-sm font-semibold tracking-wide">
          Swipe to browse · Tap to start cooking
        </p>
      </motion.div>

      {/* Swipeable card row */}
      <div
        ref={scrollRef}
        className="flex gap-5 overflow-x-auto pb-8 -mx-4 px-4 scrollbar-none snap-x snap-mandatory"
      >
        {results.map((result, i) => (
          <div key={result.recipe.id} className="snap-center">
            <RecipeCard
              result={result}
              index={i}
              onSelect={handleSelect}
            />
          </div>
        ))}
      </div>

      {/* Swipe hint */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ delay: 1, duration: 1 }}
        className="text-center text-[10px] font-bold tracking-[0.2em] uppercase text-zinc-500 mt-2 mb-8 relative z-10"
      >
        ← Swipe for more options →
      </motion.p>

      {/* What you're working with */}
      <div className="mt-auto mx-4 mb-6 p-5 rounded-3xl glass-panel relative z-10">
        <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.15em] mb-4">
          What you're working with
        </p>
        <div className="flex flex-wrap gap-2.5">
          {[...selectedIngredients, ...pantry].map((id) => {
            return (
              <span key={id} className="text-xs font-bold px-3 py-1.5 rounded-xl bg-white/5 text-zinc-300 border border-white/10 shadow-[0_2px_8px_rgba(0,0,0,0.2)]">
                {id.replace(/_/g, ' ')}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}
