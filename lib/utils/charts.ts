/**
 * Utility functions for chart data manipulation
 */

import type { ChartDataPoint } from '@/components/game/HistoricalChart';

/**
 * Helper function to generate chart data from arrays
 * @param years - Array of years
 * @param clemsonScores - Array of Clemson scores
 * @param opponentScores - Array of opponent scores
 * @returns Chart data points
 */
export function createChartData(
  years: number[],
  clemsonScores: number[],
  opponentScores: number[]
): ChartDataPoint[] {
  return years.map((year, index) => ({
    year,
    clemson: clemsonScores[index] || 0,
    opponent: opponentScores[index] || 0,
  }));
}

/**
 * Helper function to format game data for historical charts
 * @param games - Array of game objects with year, clemsonScore, opponentScore
 * @returns Chart data points
 */
export function formatGameDataForChart(
  games: Array<{ year: number; clemsonScore: number; opponentScore: number }>
): ChartDataPoint[] {
  return games.map((game) => ({
    year: game.year,
    clemson: game.clemsonScore,
    opponent: game.opponentScore,
  }));
}
