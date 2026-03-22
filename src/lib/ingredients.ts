export interface Ingredient {
  id: string;
  name: string;
  emoji: string;
  color: string;
  glowColor: string;
  category: 'protein' | 'veggie' | 'carb' | 'dairy' | 'staple';
}

export const INGREDIENTS: Ingredient[] = [
  { id: 'egg', name: 'Egg', emoji: '🥚', color: '#FDE68A', glowColor: '#F59E0B', category: 'protein' },
  { id: 'chicken', name: 'Chicken', emoji: '🍗', color: '#FCA5A5', glowColor: '#EF4444', category: 'protein' },
  { id: 'onion', name: 'Onion', emoji: '🧅', color: '#C4B5FD', glowColor: '#7C3AED', category: 'veggie' },
  { id: 'tomato', name: 'Tomato', emoji: '🍅', color: '#FCA5A5', glowColor: '#EF4444', category: 'veggie' },
  { id: 'pasta', name: 'Pasta', emoji: '🍝', color: '#FDE68A', glowColor: '#D97706', category: 'carb' },
  { id: 'rice', name: 'Rice', emoji: '🍚', color: '#BAE6FD', glowColor: '#0284C7', category: 'carb' },
  { id: 'cheese', name: 'Cheese', emoji: '🧀', color: '#FDE68A', glowColor: '#F59E0B', category: 'dairy' },
  { id: 'spinach', name: 'Spinach', emoji: '🥬', color: '#A7F3D0', glowColor: '#059669', category: 'veggie' },
  { id: 'potato', name: 'Potato', emoji: '🥔', color: '#D4B896', glowColor: '#92400E', category: 'carb' },
  { id: 'bread', name: 'Bread', emoji: '🍞', color: '#FED7AA', glowColor: '#EA580C', category: 'carb' },
];

export const PANTRY_STAPLES: Ingredient[] = [
  { id: 'salt', name: 'Salt', emoji: '🧂', color: '#E5E7EB', glowColor: '#9CA3AF', category: 'staple' },
  { id: 'pepper', name: 'Pepper', emoji: '🌶️', color: '#FCA5A5', glowColor: '#DC2626', category: 'staple' },
  { id: 'oil', name: 'Oil', emoji: '🫙', color: '#FEF08A', glowColor: '#CA8A04', category: 'staple' },
  { id: 'butter', name: 'Butter', emoji: '🧈', color: '#FDE68A', glowColor: '#D97706', category: 'staple' },
  { id: 'garlic', name: 'Garlic', emoji: '🧄', color: '#F3F4F6', glowColor: '#6B7280', category: 'staple' },
  { id: 'vinegar', name: 'Vinegar', emoji: '🍶', color: '#BFDBFE', glowColor: '#2563EB', category: 'staple' },
  { id: 'sugar', name: 'Sugar', emoji: '🍬', color: '#FBCFE8', glowColor: '#DB2777', category: 'staple' },
  { id: 'flour', name: 'Flour', emoji: '🌾', color: '#FEF3C7', glowColor: '#D97706', category: 'staple' },
  { id: 'soy_sauce', name: 'Soy Sauce', emoji: '🍱', color: '#D1FAE5', glowColor: '#065F46', category: 'staple' },
  { id: 'lemon', name: 'Lemon', emoji: '🍋', color: '#FEF08A', glowColor: '#CA8A04', category: 'staple' },
];

export const ALL_INGREDIENTS = [...INGREDIENTS, ...PANTRY_STAPLES];
