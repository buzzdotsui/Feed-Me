const PANTRY_KEY = 'feedme_pantry';
const FAVORITES_KEY = 'feedme_favorites';
const SELECTIONS_KEY = 'feedme_selections';

export const DEFAULT_PANTRY = ['salt', 'pepper', 'oil', 'butter', 'garlic'];

export function getPantryStaples(): string[] {
  if (typeof window === 'undefined') return DEFAULT_PANTRY;
  const stored = localStorage.getItem(PANTRY_KEY);
  return stored ? JSON.parse(stored) : DEFAULT_PANTRY;
}

export function setPantryStaples(staples: string[]): void {
  localStorage.setItem(PANTRY_KEY, JSON.stringify(staples));
}

export function getFavorites(): string[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(FAVORITES_KEY);
  return stored ? JSON.parse(stored) : [];
}

export function toggleFavorite(recipeId: string): string[] {
  const favorites = getFavorites();
  const updated = favorites.includes(recipeId)
    ? favorites.filter((id) => id !== recipeId)
    : [...favorites, recipeId];
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
  return updated;
}

export function isFavorite(recipeId: string): boolean {
  return getFavorites().includes(recipeId);
}

export function saveSelections(
  ingredients: string[],
  mood: string
): void {
  localStorage.setItem(
    SELECTIONS_KEY,
    JSON.stringify({ ingredients, mood })
  );
}

export function getSelections(): { ingredients: string[]; mood: string } | null {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem(SELECTIONS_KEY);
  return stored ? JSON.parse(stored) : null;
}
