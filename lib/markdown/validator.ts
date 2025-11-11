/**
 * Zod validation schemas for game statistics and evaluations frontmatter
 */

import { z } from 'zod';
import type {
  GameStatsFrontmatter,
  GameEvaluationFrontmatter,
  GameFrontmatter,
  ValidationResult,
  ValidationError,
} from './types';

/**
 * Schema for game score object
 */
const GameScoreSchema = z.object({
  clemson: z.number().int().min(0, 'Clemson score must be a non-negative integer'),
  opponent: z.number().int().min(0, 'Opponent score must be a non-negative integer'),
});

/**
 * Validation schema for game statistics frontmatter
 */
export const GameStatsFrontmatterSchema = z.object({
  game_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'game_date must be in YYYY-MM-DD format')
    .refine((date) => !isNaN(Date.parse(date)), 'game_date must be a valid date'),
  opponent: z.string().min(1, 'opponent is required and cannot be empty'),
  opponent_short: z.string().optional(),
  score: GameScoreSchema,
  season: z
    .number()
    .int()
    .min(1896, 'season must be 1896 or later') // Clemson football started in 1896
    .max(new Date().getFullYear() + 1, 'season cannot be more than one year in the future'),
  game_type: z.enum(['regular_season', 'bowl', 'playoff', 'championship']),
  content_type: z.literal('statistics'),
  location: z.string().optional(),
  attendance: z.number().int().min(0).optional(),
  weather: z.string().optional(),
  home_away: z.enum(['home', 'away', 'neutral']),
  win_streak: z.number().int().min(0).optional(),
  slug: z.string().optional(),
});

/**
 * Validation schema for game evaluation frontmatter
 */
export const GameEvaluationFrontmatterSchema = z.object({
  game_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'game_date must be in YYYY-MM-DD format')
    .refine((date) => !isNaN(Date.parse(date)), 'game_date must be a valid date'),
  opponent: z.string().min(1, 'opponent is required and cannot be empty'),
  opponent_short: z.string().optional(),
  score: GameScoreSchema,
  season: z
    .number()
    .int()
    .min(1896, 'season must be 1896 or later')
    .max(new Date().getFullYear() + 1, 'season cannot be more than one year in the future'),
  game_type: z.enum(['regular_season', 'bowl', 'playoff', 'championship']),
  content_type: z.literal('evaluation'),
  location: z.string().optional(),
  home_away: z.enum(['home', 'away', 'neutral']),
  slug: z.string().optional(),
});

/**
 * Union schema for any game frontmatter
 */
export const GameFrontmatterSchema = z.union([GameStatsFrontmatterSchema, GameEvaluationFrontmatterSchema]);

/**
 * Convert Zod errors to our ValidationError format
 * @param zodError - Zod validation error
 * @returns Array of ValidationError objects
 */
function zodErrorToValidationErrors(zodError: z.ZodError): ValidationError[] {
  return zodError.issues.map((error) => ({
    field: error.path.join('.'),
    message: error.message,
    path: error.path.map(String),
    value: 'expected' in error ? error.expected : undefined,
  }));
}

/**
 * Validate game statistics frontmatter
 * @param data - Data to validate
 * @returns Validation result with typed data or errors
 */
export function validateGameStatsFrontmatter(data: unknown): ValidationResult<GameStatsFrontmatter> {
  const result = GameStatsFrontmatterSchema.safeParse(data);

  if (result.success) {
    return {
      success: true,
      data: result.data,
    };
  }

  return {
    success: false,
    errors: zodErrorToValidationErrors(result.error),
  };
}

/**
 * Validate game evaluation frontmatter
 * @param data - Data to validate
 * @returns Validation result with typed data or errors
 */
export function validateGameEvaluationFrontmatter(data: unknown): ValidationResult<GameEvaluationFrontmatter> {
  const result = GameEvaluationFrontmatterSchema.safeParse(data);

  if (result.success) {
    return {
      success: true,
      data: result.data,
    };
  }

  return {
    success: false,
    errors: zodErrorToValidationErrors(result.error),
  };
}

/**
 * Validate any game frontmatter (auto-detects type)
 * @param data - Data to validate
 * @returns Validation result with typed data or errors
 */
export function validateGameFrontmatter(data: unknown): ValidationResult<GameFrontmatter> {
  const result = GameFrontmatterSchema.safeParse(data);

  if (result.success) {
    return {
      success: true,
      data: result.data,
    };
  }

  return {
    success: false,
    errors: zodErrorToValidationErrors(result.error),
  };
}

/**
 * Validate frontmatter and throw on error (useful for parsing pipelines)
 * @param data - Data to validate
 * @returns Validated and typed frontmatter
 * @throws Error with validation details if validation fails
 */
export function validateGameFrontmatterStrict(data: unknown): GameFrontmatter {
  const result = validateGameFrontmatter(data);

  if (!result.success) {
    const errorMessages = result.errors?.map((err) => `  - ${err.field}: ${err.message}`).join('\n') || 'Unknown error';
    throw new Error(`Frontmatter validation failed:\n${errorMessages}`);
  }

  // TypeScript doesn't narrow the type automatically, so we need to assert
  if (!result.data) {
    throw new Error('Validation succeeded but no data was returned');
  }

  return result.data;
}

/**
 * Type guard to check if frontmatter is for statistics
 * @param frontmatter - Frontmatter to check
 * @returns True if frontmatter is for statistics
 */
export function isStatisticsFrontmatter(frontmatter: GameFrontmatter): frontmatter is GameStatsFrontmatter {
  return frontmatter.content_type === 'statistics';
}

/**
 * Type guard to check if frontmatter is for evaluation
 * @param frontmatter - Frontmatter to check
 * @returns True if frontmatter is for evaluation
 */
export function isEvaluationFrontmatter(frontmatter: GameFrontmatter): frontmatter is GameEvaluationFrontmatter {
  return frontmatter.content_type === 'evaluation';
}

/**
 * Format validation errors for display
 * @param errors - Array of validation errors
 * @returns Formatted error message
 */
export function formatValidationErrors(errors: ValidationError[]): string {
  if (errors.length === 0) {
    return 'No errors';
  }

  return errors.map((err, idx) => `${idx + 1}. ${err.field ? `[${err.field}]` : ''} ${err.message}`).join('\n');
}
