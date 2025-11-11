/**
 * Unit tests for validation schemas
 */

import { describe, it, expect } from '@jest/globals';
import {
  validateGameStatsFrontmatter,
  validateGameEvaluationFrontmatter,
  validateGameFrontmatter,
  validateGameFrontmatterStrict,
  isStatisticsFrontmatter,
  isEvaluationFrontmatter,
  formatValidationErrors,
} from './validator';
import type { GameStatsFrontmatter, GameEvaluationFrontmatter } from './types';

describe('validateGameStatsFrontmatter', () => {
  it('should validate valid statistics frontmatter', () => {
    const validData: GameStatsFrontmatter = {
      game_date: '2024-09-07',
      opponent: 'Test Opponent',
      score: {
        clemson: 42,
        opponent: 21,
      },
      season: 2024,
      game_type: 'regular_season',
      content_type: 'statistics',
      home_away: 'home',
    };

    const result = validateGameStatsFrontmatter(validData);
    expect(result.success).toBe(true);
    expect(result.data).toEqual(validData);
  });

  it('should reject invalid game_date format', () => {
    const invalidData = {
      game_date: '09/07/2024', // Wrong format
      opponent: 'Test',
      score: { clemson: 42, opponent: 21 },
      season: 2024,
      game_type: 'regular_season',
      content_type: 'statistics',
      home_away: 'home',
    };

    const result = validateGameStatsFrontmatter(invalidData);
    expect(result.success).toBe(false);
    expect(result.errors).toBeDefined();
    expect(result.errors![0].message).toContain('YYYY-MM-DD');
  });

  it('should reject missing required fields', () => {
    const invalidData = {
      game_date: '2024-09-07',
      // Missing opponent
      score: { clemson: 42, opponent: 21 },
      season: 2024,
      game_type: 'regular_season',
      content_type: 'statistics',
      home_away: 'home',
    };

    const result = validateGameStatsFrontmatter(invalidData);
    expect(result.success).toBe(false);
  });

  it('should reject negative scores', () => {
    const invalidData = {
      game_date: '2024-09-07',
      opponent: 'Test',
      score: { clemson: -10, opponent: 21 },
      season: 2024,
      game_type: 'regular_season',
      content_type: 'statistics',
      home_away: 'home',
    };

    const result = validateGameStatsFrontmatter(invalidData);
    expect(result.success).toBe(false);
  });

  it('should reject invalid game_type', () => {
    const invalidData = {
      game_date: '2024-09-07',
      opponent: 'Test',
      score: { clemson: 42, opponent: 21 },
      season: 2024,
      game_type: 'invalid_type',
      content_type: 'statistics',
      home_away: 'home',
    };

    const result = validateGameStatsFrontmatter(invalidData);
    expect(result.success).toBe(false);
  });

  it('should reject season before 1896', () => {
    const invalidData = {
      game_date: '2024-09-07',
      opponent: 'Test',
      score: { clemson: 42, opponent: 21 },
      season: 1895,
      game_type: 'regular_season',
      content_type: 'statistics',
      home_away: 'home',
    };

    const result = validateGameStatsFrontmatter(invalidData);
    expect(result.success).toBe(false);
    expect(result.errors![0].message).toContain('1896');
  });

  it('should accept optional fields', () => {
    const validData: GameStatsFrontmatter = {
      game_date: '2024-09-07',
      opponent: 'Test Opponent',
      opponent_short: 'TEST',
      score: { clemson: 42, opponent: 21 },
      season: 2024,
      game_type: 'bowl',
      content_type: 'statistics',
      location: 'Memorial Stadium',
      attendance: 80000,
      weather: 'Clear, 72°F',
      home_away: 'home',
      win_streak: 5,
      slug: 'custom-slug',
    };

    const result = validateGameStatsFrontmatter(validData);
    expect(result.success).toBe(true);
  });

  it('should reject wrong content_type', () => {
    const invalidData = {
      game_date: '2024-09-07',
      opponent: 'Test',
      score: { clemson: 42, opponent: 21 },
      season: 2024,
      game_type: 'regular_season',
      content_type: 'evaluation', // Should be 'statistics'
      home_away: 'home',
    };

    const result = validateGameStatsFrontmatter(invalidData);
    expect(result.success).toBe(false);
  });
});

describe('validateGameEvaluationFrontmatter', () => {
  it('should validate valid evaluation frontmatter', () => {
    const validData: GameEvaluationFrontmatter = {
      game_date: '2024-09-07',
      opponent: 'Test Opponent',
      score: { clemson: 42, opponent: 21 },
      season: 2024,
      game_type: 'regular_season',
      content_type: 'evaluation',
      home_away: 'home',
    };

    const result = validateGameEvaluationFrontmatter(validData);
    expect(result.success).toBe(true);
  });

  it('should reject statistics content_type', () => {
    const invalidData = {
      game_date: '2024-09-07',
      opponent: 'Test',
      score: { clemson: 42, opponent: 21 },
      season: 2024,
      game_type: 'regular_season',
      content_type: 'statistics', // Should be 'evaluation'
      home_away: 'home',
    };

    const result = validateGameEvaluationFrontmatter(invalidData);
    expect(result.success).toBe(false);
  });
});

describe('validateGameFrontmatter', () => {
  it('should validate statistics frontmatter', () => {
    const data: GameStatsFrontmatter = {
      game_date: '2024-09-07',
      opponent: 'Test',
      score: { clemson: 42, opponent: 21 },
      season: 2024,
      game_type: 'regular_season',
      content_type: 'statistics',
      home_away: 'home',
    };

    const result = validateGameFrontmatter(data);
    expect(result.success).toBe(true);
  });

  it('should validate evaluation frontmatter', () => {
    const data: GameEvaluationFrontmatter = {
      game_date: '2024-09-07',
      opponent: 'Test',
      score: { clemson: 42, opponent: 21 },
      season: 2024,
      game_type: 'regular_season',
      content_type: 'evaluation',
      home_away: 'home',
    };

    const result = validateGameFrontmatter(data);
    expect(result.success).toBe(true);
  });
});

describe('validateGameFrontmatterStrict', () => {
  it('should return data for valid frontmatter', () => {
    const validData: GameStatsFrontmatter = {
      game_date: '2024-09-07',
      opponent: 'Test',
      score: { clemson: 42, opponent: 21 },
      season: 2024,
      game_type: 'regular_season',
      content_type: 'statistics',
      home_away: 'home',
    };

    const result = validateGameFrontmatterStrict(validData);
    expect(result).toEqual(validData);
  });

  it('should throw error for invalid frontmatter', () => {
    const invalidData = {
      game_date: 'invalid-date',
      opponent: 'Test',
      score: { clemson: 42, opponent: 21 },
      season: 2024,
      game_type: 'regular_season',
      content_type: 'statistics',
      home_away: 'home',
    };

    expect(() => validateGameFrontmatterStrict(invalidData)).toThrow('Frontmatter validation failed');
  });
});

describe('Type guards', () => {
  it('isStatisticsFrontmatter should identify statistics', () => {
    const data: GameStatsFrontmatter = {
      game_date: '2024-09-07',
      opponent: 'Test',
      score: { clemson: 42, opponent: 21 },
      season: 2024,
      game_type: 'regular_season',
      content_type: 'statistics',
      home_away: 'home',
    };

    expect(isStatisticsFrontmatter(data)).toBe(true);
  });

  it('isEvaluationFrontmatter should identify evaluation', () => {
    const data: GameEvaluationFrontmatter = {
      game_date: '2024-09-07',
      opponent: 'Test',
      score: { clemson: 42, opponent: 21 },
      season: 2024,
      game_type: 'regular_season',
      content_type: 'evaluation',
      home_away: 'home',
    };

    expect(isEvaluationFrontmatter(data)).toBe(true);
  });
});

describe('formatValidationErrors', () => {
  it('should format errors as numbered list', () => {
    const errors = [
      { field: 'game_date', message: 'Invalid date format' },
      { field: 'opponent', message: 'Required field' },
    ];

    const formatted = formatValidationErrors(errors);
    expect(formatted).toContain('1.');
    expect(formatted).toContain('2.');
    expect(formatted).toContain('[game_date]');
    expect(formatted).toContain('[opponent]');
  });

  it('should handle empty errors array', () => {
    const formatted = formatValidationErrors([]);
    expect(formatted).toBe('No errors');
  });
});
