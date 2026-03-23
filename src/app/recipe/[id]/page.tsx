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
        <NavBar title="Recipe Detail" />
        <div className="flex items-center justify-center flex-1 text-zinc-500 font-bold text-lg">
          Recipe not found 😕
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen pb-10 px-4">
      <NavBar title="Step-by-step" />

      {/* Recipe header */}
      <div className="mb-8 mt-2">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-[1.5rem] flex items-center justify-center text-4xl glass-panel relative">
              <div className="absolute inset-0 bg-neon-orange/10 rounded-[1.5rem]" />
              <span className="relative z-10 drop-shadow-md">{recipe.emoji}</span>
            </div>
            <div>
              <h1 className="text-2xl font-black text-white leading-tight drop-shadow-md">{recipe.name}</h1>
              <div className="flex items-center gap-1.5 mt-1 text-zinc-400">
                <span className="text-xs">⏱</span>
                <p className="text-xs font-semibold tracking-wide">{recipe.time} min</p>
              </div>
            </div>
          </div>
          <motion.button
            onClick={handleFav}
            whileTap={{ scale: 0.85 }}
            className={`w-12 h-12 rounded-[1.2rem] flex items-center justify-center flex-shrink-0 transition-all shadow-lg ${faved ? 'bg-neon-orange/20 border border-neon-orange/30' : 'bg-white/5 border border-white/10 hover:bg-white/10'}`}
            aria-label="Toggle favorite"
          >
            <Heart size={22} fill={faved ? '#FF6B00' : 'none'} stroke={faved ? '#FF6B00' : '#a1a1aa'} />
          </motion.button>
        </div>

        <p className="text-sm font-medium text-zinc-400 leading-relaxed max-w-[320px]">{recipe.description}</p>

        {/* Progress bar */}
        <div className="mt-6 mb-2">
          <div className="h-2 rounded-full overflow-hidden bg-white/5 border border-white/5">
            <motion.div
              className="h-full rounded-full relative"
              style={{ background: 'linear-gradient(90deg, #FF6B00, #FFB800)' }}
              animate={{ width: `${(completedSteps.length / recipe.steps.length) * 100}%` }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="absolute inset-0 bg-white/20 blur-[2px]" />
            </motion.div>
          </div>
          <p className="text-[10px] font-bold tracking-widest uppercase text-zinc-500 mt-2 flex justify-between">
            <span>Progress</span>
            <span className="text-neon-amber">{completedSteps.length} / {recipe.steps.length}</span>
          </p>
        </div>
      </div>

      {/* Substitution banner */}
      {substitution && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-6 p-5 rounded-2xl border border-neon-amber/20 bg-neon-amber/5 relative overflow-hidden backdrop-blur-md"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-neon-amber/10 blur-[40px] rounded-full pointer-events-none" />
          <p className="text-xs font-black tracking-widest text-amber-500 uppercase mb-2 flex items-center gap-2">
            <span className="text-lg">💡</span> Swap Idea
          </p>
          <p className="text-sm font-medium text-amber-100/90 leading-relaxed relative z-10">
            {substitution.advice}
          </p>
        </motion.div>
      )}

      {/* Finished screen */}
      <AnimatePresence>
        {finished && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="mb-8 p-8 rounded-[2rem] text-center border border-white/10 shadow-[0_20px_40px_rgba(0,0,0,0.5)] relative overflow-hidden backdrop-blur-2xl"
            style={{ background: 'linear-gradient(135deg, rgba(255,107,0,0.1), rgba(255,184,0,0.1))' }}
          >
            <div className="absolute inset-0 block pointer-events-none" style={{ background: 'radial-gradient(circle at top right, rgba(255,107,0,0.2) 0%, transparent 60%)' }} />
            <motion.div
              animate={{ rotate: [0, -10, 10, -10, 10, 0], scale: [1, 1.2, 1] }}
              transition={{ duration: 1, ease: 'easeInOut' }}
              className="text-7xl mb-6 relative z-10 drop-shadow-xl"
            >
              🎉
            </motion.div>
            <h2 className="text-3xl font-black text-white mb-3 tracking-tight relative z-10">Nailed it!</h2>
            <p className="text-zinc-300 text-sm font-medium leading-relaxed mb-6 relative z-10">
              Your <span className="text-neon-amber font-bold">{recipe.name}</span> is ready. Bon appétit!
            </p>
            <Trophy size={32} className="mx-auto mb-6 text-neon-amber drop-shadow-[0_0_15px_rgba(255,184,0,0.6)] relative z-10" />
            <motion.button
              onClick={() => router.push('/')}
              whileTap={{ scale: 0.94 }}
              className="w-full px-6 py-4 rounded-2xl font-black text-lg text-[#050505] relative z-10 shadow-[0_4px_20px_rgba(255,184,0,0.3)]"
              style={{ background: 'linear-gradient(135deg, #FFB800, #FF6B00)' }}
            >
              Cook something else Wait
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
