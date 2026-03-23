/**
 * Centralized constants for the Feed Me application
 */

export const APP = {
  NAME: 'Feed Me',
  DESCRIPTION: "AI-powered cooking assistant. Tell us what's in your fridge, get 3 perfect recipes in seconds.",
  VERSION: '1.0.0',
} as const;

export const UI = {
  DEFAULT_PADDING: 'p-4',
  MAX_WIDTH: 'max-w-md',
  BORDER_RADIUS: 'rounded-lg',
  TRANSITION: 'transition-all duration-200',
} as const;

export const COLORS = {
  PRIMARY: '#FF6B00', // neon-orange
  SECONDARY: '#FFB800', // neon-amber
  SUCCESS: '#00E88F', // neon-emerald
  INFO: '#00B8FF', // neon-blue
  DANGER: '#EF4444',
  WARNING: '#F59E0B',
} as const;

export const ANIMATION = {
  DURATION_SHORT: '200ms',
  DURATION_NORMAL: '300ms',
  DURATION_LONG: '500ms',
  EASING_EASE_IN_OUT: 'cubic-bezier(0.4, 0, 0.2, 1)',
} as const;

export const TIME_LIMITS = {
  BRAIN_DEAD_MAX_MINUTES: 10,
  QUICK_WIN_MAX_MINUTES: 20,
  PROPER_COOKING_MAX_MINUTES: 45,
  IMPRESS_SOMEONE_MAX_MINUTES: 90,
} as const;

export const RECIPE_SCORING = {
  REQUIRED_COVERAGE_WEIGHT: 0.7,
  OPTIONAL_COVERAGE_WEIGHT: 0.3,
  MIN_REQUIRED_MATCHES: 1,
} as const;

export const STORAGE_KEYS = {
  PANTRY: 'feedme_pantry',
  FAVORITES: 'feedme_favorites',
  SELECTIONS: 'feedme_selections',
} as const;

export const TOAST_CONFIG = {
  DURATION: 3000,
  POSITION: 'bottom-center' as const,
} as const;

/**
 * Loading messages for the AI result screen
 */
export const LOADING_MESSAGES = [
  'Consulting the Spice Gods…',
  'Negotiating with your leftovers…',
  'Dinner destiny loading…',
  'Checking the back of your pantry…',
  'Bribing the fridge magnets…',
  'Calculating deliciousness…',
  'Asking your grandma (virtually)…',
  'Matching vibes with your veggies…',
] as const;

/**
 * Error messages
 */
export const ERROR_MESSAGES = {
  GENERIC: 'Something went wrong. Please try again.',
  STORAGE: 'Unable to save preferences. Please try again.',
  NETWORK: 'Network error. Please check your connection.',
  VALIDATION: 'Please check your input and try again.',
  NOT_FOUND: 'The page you are looking for could not be found.',
} as const;
