/**
 * Utility functions for creating stat data
 */

import type { StatData } from '@/components/game/StatCardGrid';

/**
 * Helper function to get ordinal suffix for a number
 * @param n - Number to get ordinal suffix for
 * @returns Ordinal suffix (st, nd, rd, th)
 */
export function getOrdinalSuffix(n: number): string {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
}

/**
 * Helper function to create stat data from simple values
 * @param stats - Array of [value, label, description?] tuples
 * @returns Array of StatData objects
 */
export function createStatsFromValues(
  stats: Array<[number | string, string, string?]>
): StatData[] {
  return stats.map(([value, label, description]) => ({
    value,
    label,
    description,
  }));
}

/**
 * Helper function to create ordinal stats
 * @param stats - Array of [value, label, description?] tuples (value must be number)
 * @returns Array of StatData objects with ordinals
 */
export function createOrdinalStats(
  stats: Array<[number, string, string?]>
): StatData[] {
  return stats.map(([value, label, description]) => ({
    value,
    ordinal: getOrdinalSuffix(value),
    label,
    description,
  }));
}
