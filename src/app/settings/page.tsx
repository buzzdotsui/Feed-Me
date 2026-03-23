'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, Plus, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import NavBar from '@/components/NavBar';
import { PANTRY_STAPLES } from '@/lib/ingredients';
import { getPantryStaples, setPantryStaples, getFavorites } from '@/lib/storage';
import { RECIPES } from '@/lib/recipes';

export default function SettingsPage() {
  const router = useRouter();
  const [pantry, setPantry] = useState<string[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setPantry(getPantryStaples());
    setFavorites(getFavorites());
  }, []);

  function toggleStaple(id: string) {
    setPantry((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
    setSaved(false);
  }

  function handleSave() {
    setPantryStaples(pantry);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const favoriteRecipes = RECIPES.filter((r) => favorites.includes(r.id));

  return (
    <div className="flex flex-col min-h-screen pb-8">
      <NavBar title="Pantry & Settings" />

      {/* Pantry section */}
      <div className="mb-6">
        <h2 className="text-lg font-extrabold text-stone-900 mb-1">My Pantry Staples</h2>
        <p className="text-sm text-stone-500 mb-4">
          These ingredients are always pre-selected. Edit to match what you always have.
        </p>
        <div className="grid grid-cols-2 gap-2.5">
          {PANTRY_STAPLES.map((staple) => {
            const isIn = pantry.includes(staple.id);
            return (
              <motion.button
                key={staple.id}
                onClick={() => toggleStaple(staple.id)}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-3 px-3 py-3 rounded-2xl border-2 text-left"
                style={{
                  backgroundColor: isIn ? staple.color : '#F9F5EE',
                  borderColor: isIn ? staple.glowColor : '#E5DDD0',
                }}
              >
                <span className="text-2xl">{staple.emoji}</span>
                <span className="text-sm font-semibold text-stone-800">
                  {staple.name}
                </span>
                <span className="ml-auto">
                  {isIn ? (
                    <X size={14} color="#9B8B78" />
                  ) : (
                    <Plus size={14} color="#9B8B78" />
                  )}
                </span>
              </motion.button>
            );
          })}
        </div>

        <motion.button
          onClick={handleSave}
          whileTap={{ scale: 0.95 }}
          className="mt-4 w-full py-4 rounded-2xl font-bold text-white"
          style={{ background: saved ? 'linear-gradient(135deg, #16A34A, #15803D)' : 'linear-gradient(135deg, #FF6B35, #E85A24)' }}
        >
          {saved ? '✅ Saved!' : 'Save pantry'}
        </motion.button>
      </div>

      {/* Favorites section */}
      <div>
        <h2 className="text-lg font-extrabold text-stone-900 mb-1">
          <Heart size={18} className="inline mr-2 text-orange-500" fill="#FF6B35" />
          Saved Recipes
        </h2>
        <p className="text-sm text-stone-500 mb-4">
          Recipes you've hearted while browsing.
        </p>
        {favoriteRecipes.length === 0 ? (
          <div className="text-center py-8 text-stone-400">
            <span className="text-4xl block mb-2">💔</span>
            <p className="text-sm">No favorites yet. Heart a recipe to save it here.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {favoriteRecipes.map((recipe) => (
              <motion.button
                key={recipe.id}
                onClick={() => router.push(`/recipe/${recipe.id}`)}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-3 p-4 rounded-2xl border border-stone-200 bg-white text-left"
              >
                <span className="text-3xl">{recipe.emoji}</span>
                <div className="flex-1">
                  <p className="font-bold text-stone-900 text-sm">{recipe.name}</p>
                  <p className="text-xs text-stone-500">⏱ {recipe.time} min</p>
                </div>
                <span className="text-orange-400 text-xs font-medium">Cook →</span>
              </motion.button>
            ))}
          </div>
        )}
      </div>

      {/* About */}
      <div className="mt-8 pt-6 border-t border-stone-200">
        <p className="text-xs text-stone-400 text-center">
          Feed Me v1.0 · AI-powered kitchen assistant<br />
          Made with 🧡 by people who love to eat
        </p>
      </div>
    </div>
  );
}
