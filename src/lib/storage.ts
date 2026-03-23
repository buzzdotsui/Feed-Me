/**
 * LocalStorage utilities with comprehensive error handling and data validation
 * @module storage
 */

import { StorageError, SerializationError, logError } from './errors';
import {
  validateStoredSelections,
  validateIngredients,
  validateMood,
  sanitizeIngredients,
} from './validation';
import type { StoredSelections } from './types';

const PANTRY_KEY = 'feedme_pantry';
const FAVORITES_KEY = 'feedme_favorites';
const SELECTIONS_KEY = 'feedme_selections';

export const DEFAULT_PANTRY = ['salt', 'pepper', 'oil', 'butter', 'garlic'];

/**
 * Checks if localStorage is available
 * @returns true if localStorage is available and working
 */
function isStorageAvailable(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const test = '__storage_test__';
    window.localStorage.setItem(test, test);
    window.localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}

/**
 * Safely retrieves and parses data from localStorage
 * @param key - The storage key
 * @param fallback - Fallback value if retrieval fails
 * @returns Parsed data or fallback value
 */
function getStorageItem<T>(key: string, fallback: T): T {
  if (!isStorageAvailable()) {
    logError('Storage is not available');
    return fallback;
  }

  try {
    const stored = window.localStorage.getItem(key);
    if (!stored) {
      return fallback;
    }

    return JSON.parse(stored) as T;
  } catch (error) {
    logError(error, { key, operation: 'getStorageItem' });

    // Attempt recovery by removing corrupted data
    try {
      window.localStorage.removeItem(key);
    } catch (removeError) {
      logError(removeError, { key, operation: 'removeCorruptedData' });
    }

    return fallback;
  }
}

/**
 * Safely stores data to localStorage with validation
 * @param key - The storage key
 * @param value - The value to store
 * @throws {StorageError} If storage operation fails
 */
function setStorageItem<T>(key: string, value: T): void {
  if (!isStorageAvailable()) {
    throw new StorageError('Storage is not available', 'setItem');
  }

  try {
    const serialized = JSON.stringify(value);
    window.localStorage.setItem(key, serialized);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    logError(error, { key, operation: 'setStorageItem' });
    throw new StorageError(`Failed to save data: ${message}`, 'setItem');
  }
}

/**
 * Gets pantry staples from storage with fallback to defaults
 * @returns Array of pantry staple ingredient names
 */
export function getPantryStaples(): string[] {
  const staples = getStorageItem<string[]>(PANTRY_KEY, DEFAULT_PANTRY);

  // Validate retrieved data
  if (!Array.isArray(staples) || staples.length === 0) {
    return DEFAULT_PANTRY;
  }

  return staples;
}

/**
 * Sets pantry staples with validation
 * @param staples - Array of ingredient names to set as pantry staples
 * @throws {StorageError} If storage operation fails
 */
export function setPantryStaples(staples: string[]): void {
  // Validate input
  if (!validateIngredients(staples)) {
    throw new SerializationError('Invalid pantry staples format');
  }

  const sanitized = sanitizeIngredients(staples);
  setStorageItem(PANTRY_KEY, sanitized);
}

/**
 * Gets favorite recipe IDs from storage
 * @returns Array of favorite recipe IDs
 */
export function getFavorites(): string[] {
  return getStorageItem<string[]>(FAVORITES_KEY, []);
}

/**
 * Toggles a recipe's favorite status
 * @param recipeId - The recipe ID to toggle
 * @returns Updated array of favorite recipe IDs
 * @throws {StorageError} If storage operation fails
 */
export function toggleFavorite(recipeId: string): string[] {
  if (typeof recipeId !== 'string' || recipeId.length === 0) {
    throw new SerializationError('Invalid recipe ID');
  }

  const favorites = getFavorites();
  const updated = favorites.includes(recipeId)
    ? favorites.filter((id) => id !== recipeId)
    : [...favorites, recipeId];

  setStorageItem(FAVORITES_KEY, updated);
  return updated;
}

/**
 * Checks if a recipe is favorited
 * @param recipeId - The recipe ID to check
 * @returns true if recipe is favorited
 */
export function isFavorite(recipeId: string): boolean {
  return getFavorites().includes(recipeId);
}

/**
 * Saves user selections (ingredients and mood) with timestamp
 * @param ingredients - Array of selected ingredient names
 * @param mood - Selected mood ID
 * @throws {SerializationError} If inputs are invalid
 * @throws {StorageError} If storage operation fails
 */
export function saveSelections(ingredients: string[], mood: string): void {
  // Validate inputs
  if (!validateIngredients(ingredients)) {
    throw new SerializationError('Invalid ingredients format');
  }

  if (!validateMood(mood)) {
    throw new SerializationError('Invalid mood format');
  }

  const selections: StoredSelections = {
    ingredients: sanitizeIngredients(ingredients),
    mood,
    savedAt: Date.now(),
  };

  setStorageItem(SELECTIONS_KEY, selections);
}

/**
 * Retrieves saved user selections with validation and recovery
 * @returns Stored selections object or null if not found
 */
export function getSelections(): StoredSelections | null {
  const stored = getStorageItem<unknown>(SELECTIONS_KEY, null);

  if (stored === null) {
    return null;
  }

  // Validate structure
  if (!validateStoredSelections(stored)) {
    logError('Stored selections validation failed', { stored });

    // Attempt recovery with minimal data
    try {
      if (
        typeof stored === 'object' &&
        stored !== null &&
        'ingredients' in stored &&
        'mood' in stored &&
        Array.isArray((stored as Record<string, unknown>).ingredients) &&
        typeof (stored as Record<string, unknown>).mood === 'string'
      ) {
        const recovered: StoredSelections = {
          ingredients: (stored as Record<string, unknown>).ingredients as string[],
          mood: (stored as Record<string, unknown>).mood as string,
          savedAt: typeof (stored as Record<string, unknown>).savedAt === 'number'
            ? ((stored as Record<string, unknown>).savedAt as number)
            : Date.now(),
        };

        if (validateStoredSelections(recovered)) {
          return recovered;
        }
      }
    } catch (error) {
      logError(error, { operation: 'recoverSelections' });
    }

    return null;
  }

  return {
    ...stored,
    savedAt: stored.savedAt ?? Date.now(),
  };
}

/**
 * Clears all stored data
 * @throws {StorageError} If storage operation fails
 */
export function clearStorage(): void {
  if (!isStorageAvailable()) {
    throw new StorageError('Storage is not available', 'clear');
  }

  try {
    window.localStorage.removeItem(PANTRY_KEY);
    window.localStorage.removeItem(FAVORITES_KEY);
    window.localStorage.removeItem(SELECTIONS_KEY);
  } catch (error) {
    logError(error, { operation: 'clearStorage' });
    throw new StorageError('Failed to clear storage', 'clear');
  }
}

/**
 * Exports storage state for debugging
 * @returns Object containing all stored data
 */
export function exportStorageState(): Record<string, unknown> {
  if (!isStorageAvailable()) {
    return {};
  }

  try {
    return {
      pantry: getPantryStaples(),
      favorites: getFavorites(),
      selections: getSelections(),
    };
  } catch (error) {
    logError(error, { operation: 'exportStorageState' });
    return {};
  }
}
