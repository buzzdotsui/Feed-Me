'use client';

import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import NavBar from '@/components/NavBar';
import RecipeCard from '@/components/RecipeCard';
import LoadingScreen from '@/components/LoadingScreen';
import { generateRecipes, AIResult } from '@/lib/mockAI';
import { getSelections, getPantryStaples } from '@/lib/storage';
import { RECIPES } from '@/lib/recipes';

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
        <div className="flex flex-col items-center justify-center flex-1 gap-4 px-4 text-center">
          <span className="text-6xl">🤔</span>
          <h2 className="text-xl font-bold text-stone-900">
            The fridge is a mystery
          </h2>
          <p className="text-stone-500 text-sm">
            We couldn't find recipes for those ingredients. Try selecting more, or switch moods!
          </p>
          <motion.button
            onClick={() => router.back()}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 rounded-2xl font-bold text-white mt-2"
            style={{ background: 'linear-gradient(135deg, #FF6B35, #E85A24)' }}
          >
            Try again
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
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-2xl font-extrabold text-stone-900 mb-1">
          We found {results.length} recipes!
        </h1>
        <p className="text-stone-500 text-sm">
          Swipe to browse · Tap to start cooking
        </p>
      </motion.div>

      {/* Swipeable card row */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-none snap-x"
      >
        {results.map((result, i) => (
          <RecipeCard
            key={result.recipe.id}
            result={result}
            index={i}
            onSelect={handleSelect}
          />
        ))}
      </div>

      {/* Swipe hint */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="text-center text-xs text-stone-400 mt-3 mb-6"
      >
        ← Swipe for more options →
      </motion.p>

      {/* What you're working with */}
      <div className="mt-2 p-4 rounded-2xl" style={{ backgroundColor: '#F0EAE0' }}>
        <p className="text-xs font-bold text-stone-500 uppercase tracking-widest mb-2">
          What you're working with
        </p>
        <div className="flex flex-wrap gap-2">
          {[...selectedIngredients, ...pantry].map((id) => {
            const allIngredients = [...(RECIPES.flatMap(r => [...r.requiredIngredients, ...r.optionalIngredients]))];
            return (
              <span key={id} className="text-xs font-medium px-2.5 py-1 rounded-full bg-white text-stone-700 border border-stone-200">
                {id.replace(/_/g, ' ')}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}
