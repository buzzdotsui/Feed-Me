/**
 * Validation utilities for the Feed Me application
 */

import { ValidationError, ERROR_MESSAGES } from './errors';

/**
 * Validates ingredient ID format
 */
export function validateIngredientId(id: string): boolean {
  return typeof id === 'string' && id.length > 0 && /^[a-z0-9_-]+$/.test(id);
}

/**
 * Validates ingredient ID and throws error if invalid
 */
export function assertValidIngredientId(id: unknown): asserts id is string {
  if (typeof id !== 'string' || !validateIngredientId(id)) {
    throw new ValidationError(ERROR_MESSAGES.INVALID_INGREDIENT_ID, 'ingredientId');
  }
}

/**
 * Validates recipe ID format
 */
export function validateRecipeId(id: string): boolean {
  return typeof id === 'string' && id.length > 0 && /^[a-z0-9_-]+$/.test(id);
}

/**
 * Validates recipe ID and throws error if invalid
 */
export function assertValidRecipeId(id: unknown): asserts id is string {
  if (typeof id !== 'string' || !validateRecipeId(id)) {
    throw new ValidationError(ERROR_MESSAGES.INVALID_RECIPE_ID, 'recipeId');
  }
}

/**
 * Validates mood ID format
 */
export function validateMoodId(id: string): boolean {
  return typeof id === 'string' && id.length > 0 && /^[a-z0-9_]+$/.test(id);
}

/**
 * Validates mood ID and throws error if invalid
 */
export function assertValidMoodId(id: unknown): asserts id is string {
  if (typeof id !== 'string' || !validateMoodId(id)) {
    throw new ValidationError(ERROR_MESSAGES.INVALID_MOOD_ID, 'moodId');
  }
}

/**
 * Validates ingredients list
 */
export function validateIngredients(ingredients: unknown): ingredients is string[] {
  return (
    Array.isArray(ingredients) &&
    ingredients.length > 0 &&
    ingredients.every((ing) => typeof ing === 'string' && ing.length > 0)
  );
}

/**
 * Validates ingredients list and throws error if invalid
 */
export function assertValidIngredients(ingredients: unknown): asserts ingredients is string[] {
  if (!validateIngredients(ingredients)) {
    throw new ValidationError(ERROR_MESSAGES.EMPTY_INGREDIENTS, 'ingredients');
  }
}

/**
 * Validates mood selection
 */
export function validateMood(mood: unknown): mood is string {
  return typeof mood === 'string' && mood.length > 0;
}

/**
 * Validates mood selection and throws error if invalid
 */
export function assertValidMood(mood: unknown): asserts mood is string {
  if (!validateMood(mood)) {
    throw new ValidationError(ERROR_MESSAGES.EMPTY_MOOD, 'mood');
  }
}

/**
 * Validates stored selections object
 */
export function validateStoredSelections(
  data: unknown
): data is { ingredients: string[]; mood: string; savedAt?: number } {
  if (typeof data !== 'object' || data === null) {
    return false;
  }

  const obj = data as Record<string, unknown>;
  return validateIngredients(obj.ingredients) && validateMood(obj.mood);
}

/**
 * Type guard for array of strings
 */
export function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string');
}

/**
 * Validates and sanitizes ingredient string
 */
export function sanitizeIngredient(ingredient: string): string {
  return ingredient.trim().toLowerCase();
}

/**
 * Validates and sanitizes array of ingredients
 */
export function sanitizeIngredients(ingredients: string[]): string[] {
  return ingredients
    .map((ing) => sanitizeIngredient(ing))
    .filter((ing) => ing.length > 0);
}
