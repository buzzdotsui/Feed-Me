/**
 * Mock AI recipe generation engine for the Feed Me application
 * Generates recipe recommendations based on available ingredients and user mood
 */

import { RECIPES, MOODS } from './recipes';
import { RECIPE_SCORING } from './constants';
import { logError, ValidationError } from './errors';
import type { Recipe, RecipeStep, Substitution, AIResult, MoodId } from './types';

export type { RecipeStep, Substitution, Recipe, AIResult };
export { MOODS };

/**
 * Generates personalized recipe recommendations based on available ingredients and mood
 * 
 * @param selectedIngredients - Array of selected ingredient names
 * @param pantryStaples - Array of pantry staple ingredient names
 * @param mood - Selected mood ID for filtering recipes
 * @returns Array of top 3 recipe recommendations sorted by match score
 * @throws {ValidationError} If inputs are invalid
 */
export function generateRecipes(
  selectedIngredients: string[],
  pantryStaples: string[],
  mood: string
): AIResult[] {
  // Validate inputs
  if (!Array.isArray(selectedIngredients) || !Array.isArray(pantryStaples)) {
    logError('Invalid ingredients input', { selectedIngredients, pantryStaples });
    throw new ValidationError('Ingredients must be arrays');
  }

  if (typeof mood !== 'string' || mood.length === 0) {
    logError('Invalid mood input', { mood });
    throw new ValidationError('Mood must be a non-empty string');
  }

  const allAvailable = [...selectedIngredients, ...pantryStaples];

  if (process.env.NODE_ENV === 'development') {
    console.log('[MockAI] Generating recipes', {
      selectedCount: selectedIngredients.length,
      pantryCount: pantryStaples.length,
      mood,
    });
  }

  const scored = RECIPES.map((recipe) => {
    // Filter by mood first
    if (!recipe.moodFit.includes(mood as MoodId)) {
      return null;
    }

    const requiredMatches = recipe.requiredIngredients.filter((ri) =>
      allAvailable.find((a) => a.toLowerCase() === ri.toLowerCase())
    );

    // Must match at least minimum required ingredients
    if (requiredMatches.length < RECIPE_SCORING.MIN_REQUIRED_MATCHES) {
      return null;
    }

    const optionalMatches = recipe.optionalIngredients.filter((oi) =>
      allAvailable.find((a) => a.toLowerCase() === oi.toLowerCase())
    );

    const requiredCoverage =
      requiredMatches.length / Math.max(1, recipe.requiredIngredients.length);
    const optionalCoverage =
      optionalMatches.length / Math.max(1, recipe.optionalIngredients.length);

    const matchScore = Math.round(
      (requiredCoverage * RECIPE_SCORING.REQUIRED_COVERAGE_WEIGHT +
        optionalCoverage * RECIPE_SCORING.OPTIONAL_COVERAGE_WEIGHT) *
        100
    );

    const missingIngredients = recipe.requiredIngredients.filter(
      (ri) => !allAvailable.find((a) => a.toLowerCase() === ri.toLowerCase())
    );

    const applicableSubstitutions = recipe.substitutions.filter((sub) =>
      missingIngredients.some(
        (m) => m.toLowerCase() === sub.missing.toLowerCase()
      ) &&
      allAvailable.some((a) => a.toLowerCase() === sub.have.toLowerCase())
    );

    return {
      recipe,
      matchScore,
      missingIngredients,
      substitutions: applicableSubstitutions,
    };
  }).filter(Boolean) as AIResult[];

  // Sort by score descending
  scored.sort((a, b) => b.matchScore - a.matchScore);

  if (process.env.NODE_ENV === 'development') {
    console.log('[MockAI] Recipes generated', {
      moodMatches: scored.length,
      topScore: scored[0]?.matchScore,
    });
  }

  // If no mood-match results, relax mood constraint
  if (scored.length === 0) {
    if (process.env.NODE_ENV === 'development') {
      console.log('[MockAI] No mood matches found, relaxing constraint');
    }
    return generateRecipesNoMood(allAvailable);
  }

  return scored.slice(0, 3);
}

/**
 * Fallback recipe generation when no mood matches are found
 * Relaxes mood constraint but maintains ingredient matching
 * 
 * @param allAvailable - Combined array of all available ingredients
 * @returns Array of top 3 recipe recommendations without mood filter
 */
function generateRecipesNoMood(allAvailable: string[]): AIResult[] {
  const scored = RECIPES.map((recipe) => {
    const requiredMatches = recipe.requiredIngredients.filter((ri) =>
      allAvailable.find((a) => a.toLowerCase() === ri.toLowerCase())
    );

    if (requiredMatches.length < RECIPE_SCORING.MIN_REQUIRED_MATCHES) {
      return null;
    }

    const optionalMatches = recipe.optionalIngredients.filter((oi) =>
      allAvailable.find((a) => a.toLowerCase() === oi.toLowerCase())
    );

    const requiredCoverage =
      requiredMatches.length / Math.max(1, recipe.requiredIngredients.length);
    const optionalCoverage =
      optionalMatches.length / Math.max(1, recipe.optionalIngredients.length);

    const matchScore = Math.round(
      (requiredCoverage * RECIPE_SCORING.REQUIRED_COVERAGE_WEIGHT +
        optionalCoverage * RECIPE_SCORING.OPTIONAL_COVERAGE_WEIGHT) *
        100
    );

    const missingIngredients = recipe.requiredIngredients.filter(
      (ri) => !allAvailable.find((a) => a.toLowerCase() === ri.toLowerCase())
    );

    return {
      recipe,
      matchScore,
      missingIngredients,
      substitutions: [],
    };
  }).filter(Boolean) as AIResult[];

  scored.sort((a, b) => b.matchScore - a.matchScore);

  if (process.env.NODE_ENV === 'development') {
    console.log('[MockAI] Fallback recipes generated', {
      total: scored.length,
      topScore: scored[0]?.matchScore,
    });
  }

  return scored.slice(0, 3);
}
