/**
 * Core type definitions for the Feed Me application
 */

/** UUID type for unique identifiers */
export type UUID = string;

/** Branded type for recipe IDs */
export type RecipeId = string;

/** Branded type for ingredient IDs */
export type IngredientId = string;

/** Branded type for mood IDs */
export type MoodId = string;

export interface RecipeStep {
  id: number;
  title: string;
  instruction: string;
  timerSeconds: number | null;
}

export interface Substitution {
  missing: string;
  have: string;
  advice: string;
}

export interface Recipe {
  id: RecipeId;
  name: string;
  emoji: string;
  time: number;
  requiredIngredients: string[];
  optionalIngredients: string[];
  description: string;
  steps: RecipeStep[];
  substitutions: Substitution[];
  moodFit: MoodId[];
}

export interface AIResult {
  recipe: Recipe;
  matchScore: number;
  missingIngredients: string[];
  substitutions: Substitution[];
}

export interface MoodOption {
  id: MoodId;
  label: string;
  emoji: string;
  description: string;
  maxMinutes: number;
}

/**
 * API Response Types
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: number;
}

export interface StoredSelections {
  ingredients: string[];
  mood: string;
  savedAt: number;
}

/**
 * Error Types
 */
export interface AppError {
  code: string;
  message: string;
  details?: unknown;
}

export class ValidationError extends Error {
  constructor(message: string, public code: string = 'VALIDATION_ERROR') {
    super(message);
    this.name = 'ValidationError';
  }
}

export class StorageError extends Error {
  constructor(message: string, public code: string = 'STORAGE_ERROR') {
    super(message);
    this.name = 'StorageError';
  }
}
