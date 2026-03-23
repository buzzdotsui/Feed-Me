/**
 * App state utilities for managing ingredients, mood, and pantry
 * Data is persisted to localStorage using the storage module
 */

import { useCallback } from 'react';
import type { AIResult } from '@/lib/types';
import * as storage from '@/lib/storage';

/**
 * App state interface
 */
export interface AppState {
  selectedIngredients: string[];
  selectedMood: string | null;
  favorites: string[];
  pantryStaples: string[];
  recipeResults: AIResult[];
  isLoading: boolean;
}

/**
 * Hook to manage selected ingredients
 */
export const useSelectedIngredients = () => {
  const toggleIngredient = useCallback((ingredient: string, current: string[]) => {
    return current.includes(ingredient)
      ? current.filter((i) => i !== ingredient)
      : [...current, ingredient];
  }, []);

  return { toggleIngredient };
};

/**
 * Hook to manage favorite recipes
 */
export const useFavorites = () => {
  const toggleFavorite = useCallback((recipeId: string): string[] => {
    try {
      return storage.toggleFavorite(recipeId);
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
      return storage.getFavorites();
    }
  }, []);

  return { toggleFavorite, getFavorites: storage.getFavorites, isFavorite: storage.isFavorite };
};

/**
 * Hook to manage pantry staples
 */
export const usePantryStaples = () => {
  const setPantry = useCallback((staples: string[]) => {
    try {
      storage.setPantryStaples(staples);
      return staples;
    } catch (error) {
      console.error('Failed to save pantry staples:', error);
      return storage.getPantryStaples();
    }
  }, []);

  const toggleStaple = useCallback((staple: string, current: string[]) => {
    const updated = current.includes(staple)
      ? current.filter((s) => s !== staple)
      : [...current, staple];

    try {
      storage.setPantryStaples(updated);
    } catch (error) {
      console.error('Failed to update pantry staple:', error);
    }

    return updated;
  }, []);

  return { setPantry, toggleStaple, getPantryStaples: storage.getPantryStaples };
};

/**
 * Hook to manage selections (ingredients + mood)
 */
export const useSelections = () => {
  const save = useCallback((ingredients: string[], mood: string) => {
    try {
      storage.saveSelections(ingredients, mood);
    } catch (error) {
      console.error('Failed to save selections:', error);
    }
  }, []);

  const load = useCallback(() => {
    try {
      return storage.getSelections();
    } catch (error) {
      console.error('Failed to load selections:', error);
      return null;
    }
  }, []);

  return { save, load, getSelections: storage.getSelections };
};
