import { RECIPES, MOODS } from './recipes';
import type { Recipe, RecipeStep, Substitution, AIResult } from './types';

export type { RecipeStep, Substitution, Recipe, AIResult };
export { MOODS };


export function generateRecipes(
  selectedIngredients: string[],
  pantryStaples: string[],
  mood: string
): AIResult[] {
  const allAvailable = [...selectedIngredients, ...pantryStaples];

  const scored = RECIPES.map((recipe) => {
    if (!recipe.moodFit.includes(mood)) return null;

    const requiredMatches = recipe.requiredIngredients.filter((ri) =>
      allAvailable.includes(ri)
    );

    // Must match at least one required ingredient
    if (requiredMatches.length === 0) return null;

    const optionalMatches = recipe.optionalIngredients.filter((oi) =>
      allAvailable.includes(oi)
    );

    const totalIngredients =
      recipe.requiredIngredients.length + recipe.optionalIngredients.length;
    const totalMatches = requiredMatches.length + optionalMatches.length;

    const requiredCoverage =
      requiredMatches.length / Math.max(1, recipe.requiredIngredients.length);
    const optionalCoverage =
      optionalMatches.length / Math.max(1, recipe.optionalIngredients.length);

    const matchScore = Math.round(
      (requiredCoverage * 0.7 + optionalCoverage * 0.3) * 100
    );

    const missingIngredients = recipe.requiredIngredients.filter(
      (ri) => !allAvailable.includes(ri)
    );

    const applicableSubstitutions = recipe.substitutions.filter((sub) =>
      missingIngredients.includes(sub.missing) && allAvailable.includes(sub.have)
    );

    return {
      recipe,
      matchScore,
      missingIngredients,
      substitutions: applicableSubstitutions,
    };
  }).filter(Boolean) as AIResult[];

  // Sort by score descending, take top 3
  scored.sort((a, b) => b.matchScore - a.matchScore);

  // If no mood-match results, relax mood constraint
  if (scored.length === 0) {
    return generateRecipesNoMood(allAvailable);
  }

  return scored.slice(0, 3);
}

function generateRecipesNoMood(allAvailable: string[]): AIResult[] {
  const scored = RECIPES.map((recipe) => {
    const requiredMatches = recipe.requiredIngredients.filter((ri) =>
      allAvailable.includes(ri)
    );
    if (requiredMatches.length === 0) return null;

    const optionalMatches = recipe.optionalIngredients.filter((oi) =>
      allAvailable.includes(oi)
    );

    const requiredCoverage =
      requiredMatches.length / Math.max(1, recipe.requiredIngredients.length);
    const optionalCoverage =
      optionalMatches.length / Math.max(1, recipe.optionalIngredients.length);

    const matchScore = Math.round(
      (requiredCoverage * 0.7 + optionalCoverage * 0.3) * 100
    );

    const missingIngredients = recipe.requiredIngredients.filter(
      (ri) => !allAvailable.includes(ri)
    );

    return { recipe, matchScore, missingIngredients, substitutions: [] };
  }).filter(Boolean) as AIResult[];

  scored.sort((a, b) => b.matchScore - a.matchScore);
  return scored.slice(0, 3);
}
