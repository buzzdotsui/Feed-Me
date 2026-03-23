/**
 * Custom error classes and error handling utilities for the Feed Me application
 */

/**
 * Base class for all application errors
 */
export class AppError extends Error {
  constructor(public code: string, message: string) {
    super(message);
    this.name = 'AppError';
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

/**
 * Thrown when input validation fails
 */
export class ValidationError extends AppError {
  constructor(message: string, public fieldName?: string) {
    super('VALIDATION_ERROR', message);
    this.name = 'ValidationError';
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

/**
 * Thrown when localStorage operations fail
 */
export class StorageError extends AppError {
  constructor(message: string, public operation?: string) {
    super('STORAGE_ERROR', message);
    this.name = 'StorageError';
    Object.setPrototypeOf(this, StorageError.prototype);
  }
}

/**
 * Thrown when JSON serialization/deserialization fails
 */
export class SerializationError extends AppError {
  constructor(message: string, public data?: unknown) {
    super('SERIALIZATION_ERROR', message);
    this.name = 'SerializationError';
    Object.setPrototypeOf(this, SerializationError.prototype);
  }
}

/**
 * Thrown when data recovery is needed
 */
export class DataRecoveryError extends AppError {
  constructor(message: string, public fallbackData?: unknown) {
    super('DATA_RECOVERY_ERROR', message);
    this.name = 'DataRecoveryError';
    Object.setPrototypeOf(this, DataRecoveryError.prototype);
  }
}

/**
 * Error messages constants
 */
export const ERROR_MESSAGES = {
  INVALID_INGREDIENT_ID: 'Invalid ingredient ID format',
  INVALID_RECIPE_ID: 'Invalid recipe ID format',
  INVALID_MOOD_ID: 'Invalid mood ID format',
  EMPTY_INGREDIENTS: 'At least one ingredient is required',
  EMPTY_MOOD: 'A mood selection is required',
  STORAGE_UNAVAILABLE: 'Local storage is not available',
  CORRUPTED_DATA: 'Stored data is corrupted and cannot be recovered',
  JSON_PARSE_ERROR: 'Failed to parse stored data',
  JSON_STRINGIFY_ERROR: 'Failed to serialize data',
} as const;

/**
 * Safely serializes data to JSON string with error handling
 */
export function safeStringify<T>(data: T): string {
  try {
    return JSON.stringify(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    throw new SerializationError(ERROR_MESSAGES.JSON_STRINGIFY_ERROR, {
      originalError: message,
      data,
    });
  }
}

/**
 * Safely parses JSON string with error handling and validation
 */
export function safeParse<T>(
  json: string,
  validator?: (data: unknown) => data is T
): T {
  try {
    const data = JSON.parse(json);

    if (validator && !validator(data)) {
      throw new ValidationError('Parsed data does not match expected schema');
    }

    return data as T;
  } catch (error) {
    if (error instanceof ValidationError) {
      throw error;
    }

    const message = error instanceof Error ? error.message : 'Unknown error';
    throw new SerializationError(ERROR_MESSAGES.JSON_PARSE_ERROR, {
      originalError: message,
      json,
    });
  }
}

/**
 * Handles errors and returns user-friendly messages
 */
export function getUserFriendlyErrorMessage(error: unknown): string {
  if (error instanceof ValidationError) {
    return error.message;
  }

  if (error instanceof StorageError) {
    return 'Unable to save your preferences. Please try again.';
  }

  if (error instanceof SerializationError) {
    return 'Data error. Please refresh the page.';
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'An unexpected error occurred. Please try again.';
}

/**
 * Logs error with context for debugging
 */
export function logError(error: unknown, context?: Record<string, unknown>): void {
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    console.error('App Error:', {
      error,
      context,
      timestamp: new Date().toISOString(),
    });
  }
}
