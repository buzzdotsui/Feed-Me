'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Trophy } from 'lucide-react';
import NavBar from '@/components/NavBar';
import RecipeStep from '@/components/RecipeStep';
import { RECIPES } from '@/lib/recipes';
import { Recipe } from '@/lib/mockAI';
import { toggleFavorite, isFavorite, getSelections, getPantryStaples } from '@/lib/storage';
import { generateRecipes } from '@/lib/mockAI';

export default function RecipePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [faved, setFaved] = useState(false);
  const [finished, setFinished] = useState(false);
  const [substitution, setSubstitution] = useState<{ advice: string; missing: string } | null>(null);

  useEffect(() => {
    const found = RECIPES.find((r) => r.id === id);
    if (found) {
      setRecipe(found);
      setFaved(isFavorite(found.id));

      // Check for substitutions
      const selections = getSelections();
      const pantry = getPantryStaples();
      if (selections) {
        const results = generateRecipes(selections.ingredients, pantry, selections.mood);
        const match = results.find((r) => r.recipe.id === id);
        if (match?.substitutions[0]) {
          setSubstitution(match.substitutions[0]);
        }
      }
    }
  }, [id]);

  function handleComplete(stepIndex: number) {
    setCompletedSteps((prev) => [...prev, stepIndex]);
    if (recipe && stepIndex + 1 >= recipe.steps.length) {
      setFinished(true);
    } else {
      setActiveStep(stepIndex + 1);
    }
  }

  function handleFav() {
    const updated = toggleFavorite(id);
    setFaved(updated.includes(id));
  }

  if (!recipe) {
    return (
      <div className="flex flex-col min-h-screen">
        <NavBar title="Recipe" />
        <div className="flex items-center justify-center flex-1 text-stone-400 text-lg">
          Recipe not found 😕
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen pb-8">
      <NavBar title="Step-by-step" />

      {/* Recipe header */}
      <div className="mb-6">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl"
              style={{ backgroundColor: '#FFF4EC' }}>
              {recipe.emoji}
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-stone-900 leading-tight">{recipe.name}</h1>
              <p className="text-sm text-stone-500 mt-0.5">⏱ {recipe.time} minutes</p>
            </div>
          </div>
          <motion.button
            onClick={handleFav}
            whileTap={{ scale: 0.85 }}
            className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: faved ? '#FFE4D3' : '#F0EAE0' }}
            aria-label="Toggle favorite"
          >
            <Heart size={20} fill={faved ? '#FF6B35' : 'none'} stroke={faved ? '#FF6B35' : '#9B8B78'} />
          </motion.button>
        </div>

        <p className="text-sm text-stone-500 leading-relaxed">{recipe.description}</p>

        {/* Progress bar */}
        <div className="mt-4 h-2 rounded-full overflow-hidden" style={{ backgroundColor: '#E5DDD0' }}>
          <motion.div
            className="h-full rounded-full"
            style={{ background: 'linear-gradient(90deg, #FF6B35, #FFB347)' }}
            animate={{ width: `${(completedSteps.length / recipe.steps.length) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <p className="text-xs text-stone-400 mt-1.5">
          {completedSteps.length} of {recipe.steps.length} steps complete
        </p>
      </div>

      {/* Substitution banner */}
      {substitution && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-4 rounded-2xl border border-amber-200"
          style={{ backgroundColor: '#FFFBEB' }}
        >
          <p className="text-sm font-bold text-amber-800 mb-1">
            💡 Quick sub tip
          </p>
          <p className="text-sm text-amber-700">
            {substitution.advice}
          </p>
        </motion.div>
      )}

      {/* Finished screen */}
      <AnimatePresence>
        {finished && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 p-6 rounded-3xl text-center"
            style={{ background: 'linear-gradient(135deg, #FFF4EC, #FFE4D3)' }}
          >
            <motion.div
              animate={{ rotate: [0, -10, 10, -10, 10, 0], scale: [1, 1.2, 1] }}
              transition={{ duration: 0.8 }}
              className="text-6xl mb-3"
            >
              🎉
            </motion.div>
            <h2 className="text-xl font-extrabold text-stone-900 mb-2">You did it!</h2>
            <p className="text-stone-600 text-sm mb-4">
              {recipe.name} is ready. We hope it's absolutely delicious.
            </p>
            <Trophy size={20} className="mx-auto mb-3 text-amber-500" />
            <motion.button
              onClick={() => router.push('/')}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 rounded-2xl font-bold text-white"
              style={{ background: 'linear-gradient(135deg, #FF6B35, #E85A24)' }}
            >
              Cook something else 🍽️
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Steps */}
      {!finished && recipe.steps.map((step, i) => (
        <RecipeStep
          key={step.id}
          step={step}
          stepNumber={i + 1}
          totalSteps={recipe.steps.length}
          isActive={i === activeStep}
          isCompleted={completedSteps.includes(i)}
          onComplete={() => handleComplete(i)}
        />
      ))}
    </div>
  );
}
