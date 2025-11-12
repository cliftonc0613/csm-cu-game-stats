/**
 * Unit tests for stats utility functions
 */

import { describe, it, expect } from '@jest/globals';
import { getOrdinalSuffix, createStatsFromValues, createOrdinalStats } from './stats';

describe('getOrdinalSuffix', () => {
  it('should return "st" for 1, 21, 31, etc.', () => {
    expect(getOrdinalSuffix(1)).toBe('st');
    expect(getOrdinalSuffix(21)).toBe('st');
    expect(getOrdinalSuffix(31)).toBe('st');
    expect(getOrdinalSuffix(101)).toBe('st');
  });

  it('should return "nd" for 2, 22, 32, etc.', () => {
    expect(getOrdinalSuffix(2)).toBe('nd');
    expect(getOrdinalSuffix(22)).toBe('nd');
    expect(getOrdinalSuffix(32)).toBe('nd');
    expect(getOrdinalSuffix(102)).toBe('nd');
  });

  it('should return "rd" for 3, 23, 33, etc.', () => {
    expect(getOrdinalSuffix(3)).toBe('rd');
    expect(getOrdinalSuffix(23)).toBe('rd');
    expect(getOrdinalSuffix(33)).toBe('rd');
    expect(getOrdinalSuffix(103)).toBe('rd');
  });

  it('should return "th" for 4-20', () => {
    expect(getOrdinalSuffix(4)).toBe('th');
    expect(getOrdinalSuffix(10)).toBe('th');
    expect(getOrdinalSuffix(11)).toBe('th');
    expect(getOrdinalSuffix(12)).toBe('th');
    expect(getOrdinalSuffix(13)).toBe('th');
    expect(getOrdinalSuffix(20)).toBe('th');
  });

  it('should return "th" for teens (11-13)', () => {
    expect(getOrdinalSuffix(11)).toBe('th');
    expect(getOrdinalSuffix(12)).toBe('th');
    expect(getOrdinalSuffix(13)).toBe('th');
    expect(getOrdinalSuffix(111)).toBe('th');
    expect(getOrdinalSuffix(112)).toBe('th');
    expect(getOrdinalSuffix(113)).toBe('th');
  });

  it('should handle large numbers', () => {
    expect(getOrdinalSuffix(1000)).toBe('th');
    expect(getOrdinalSuffix(1001)).toBe('st');
    expect(getOrdinalSuffix(1002)).toBe('nd');
    expect(getOrdinalSuffix(1003)).toBe('rd');
  });
});

describe('createStatsFromValues', () => {
  it('should create stat data from values', () => {
    const stats = [
      [42, 'Points Scored'],
      [350, 'Total Yards'],
      [7, 'Touchdowns'],
    ] as Array<[number, string]>;

    const result = createStatsFromValues(stats);

    expect(result).toEqual([
      { value: 42, label: 'Points Scored', description: undefined },
      { value: 350, label: 'Total Yards', description: undefined },
      { value: 7, label: 'Touchdowns', description: undefined },
    ]);
  });

  it('should handle string values', () => {
    const stats = [
      ['W 42-21', 'Final Score'],
      ['100%', 'Win Rate'],
    ] as Array<[string, string]>;

    const result = createStatsFromValues(stats);

    expect(result).toEqual([
      { value: 'W 42-21', label: 'Final Score', description: undefined },
      { value: '100%', label: 'Win Rate', description: undefined },
    ]);
  });

  it('should include descriptions when provided', () => {
    const stats = [
      [42, 'Points', 'of 134'],
      [1, 'Rank', 'in ACC'],
    ] as Array<[number, string, string]>;

    const result = createStatsFromValues(stats);

    expect(result).toEqual([
      { value: 42, label: 'Points', description: 'of 134' },
      { value: 1, label: 'Rank', description: 'in ACC' },
    ]);
  });

  it('should handle empty array', () => {
    const result = createStatsFromValues([]);
    expect(result).toEqual([]);
  });
});

describe('createOrdinalStats', () => {
  it('should create stats with ordinal suffixes', () => {
    const stats = [
      [1, 'Rank'],
      [2, 'Position'],
      [3, 'Place'],
    ] as Array<[number, string]>;

    const result = createOrdinalStats(stats);

    expect(result).toEqual([
      { value: 1, ordinal: 'st', label: 'Rank', description: undefined },
      { value: 2, ordinal: 'nd', label: 'Position', description: undefined },
      { value: 3, ordinal: 'rd', label: 'Place', description: undefined },
    ]);
  });

  it('should handle descriptions', () => {
    const stats = [
      [1, 'Rank', 'in ACC'],
      [42, 'Score', 'all-time'],
    ] as Array<[number, string, string]>;

    const result = createOrdinalStats(stats);

    expect(result).toEqual([
      { value: 1, ordinal: 'st', label: 'Rank', description: 'in ACC' },
      { value: 42, ordinal: 'nd', label: 'Score', description: 'all-time' },
    ]);
  });

  it('should handle empty array', () => {
    const result = createOrdinalStats([]);
    expect(result).toEqual([]);
  });

  it('should handle teens correctly', () => {
    const stats = [
      [11, 'Rank'],
      [12, 'Rank'],
      [13, 'Rank'],
    ] as Array<[number, string]>;

    const result = createOrdinalStats(stats);

    expect(result[0].ordinal).toBe('th');
    expect(result[1].ordinal).toBe('th');
    expect(result[2].ordinal).toBe('th');
  });
});
