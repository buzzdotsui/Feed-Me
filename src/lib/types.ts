// Shared types used by both recipes.ts and mockAI.ts

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
  id: string;
  name: string;
  emoji: string;
  time: number;
  requiredIngredients: string[];
  optionalIngredients: string[];
  description: string;
  steps: RecipeStep[];
  substitutions: Substitution[];
  moodFit: string[];
}

export interface AIResult {
  recipe: Recipe;
  matchScore: number;
  missingIngredients: string[];
  substitutions: Substitution[];
}

export interface MoodOption {
  id: string;
  label: string;
  emoji: string;
  description: string;
  maxMinutes: number;
}
