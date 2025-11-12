/**
 * Unit tests for chart utility functions
 */

import { describe, it, expect } from '@jest/globals';
import { createChartData, formatGameDataForChart } from './charts';

describe('createChartData', () => {
  it('should create chart data from parallel arrays', () => {
    const years = [2020, 2021, 2022];
    const clemsonScores = [42, 35, 28];
    const opponentScores = [21, 14, 31];

    const result = createChartData(years, clemsonScores, opponentScores);

    expect(result).toEqual([
      { year: 2020, clemson: 42, opponent: 21 },
      { year: 2021, clemson: 35, opponent: 14 },
      { year: 2022, clemson: 28, opponent: 31 },
    ]);
  });

  it('should handle missing scores with 0', () => {
    const years = [2020, 2021, 2022];
    const clemsonScores = [42, 35]; // Missing one
    const opponentScores = [21]; // Missing two

    const result = createChartData(years, clemsonScores, opponentScores);

    expect(result).toEqual([
      { year: 2020, clemson: 42, opponent: 21 },
      { year: 2021, clemson: 35, opponent: 0 },
      { year: 2022, clemson: 0, opponent: 0 },
    ]);
  });

  it('should handle empty arrays', () => {
    const result = createChartData([], [], []);
    expect(result).toEqual([]);
  });

  it('should handle single data point', () => {
    const result = createChartData([2024], [42], [21]);
    expect(result).toEqual([{ year: 2024, clemson: 42, opponent: 21 }]);
  });
});

describe('formatGameDataForChart', () => {
  it('should format game data for charts', () => {
    const games = [
      { year: 2020, clemsonScore: 42, opponentScore: 21 },
      { year: 2021, clemsonScore: 35, opponentScore: 14 },
      { year: 2022, clemsonScore: 28, opponentScore: 31 },
    ];

    const result = formatGameDataForChart(games);

    expect(result).toEqual([
      { year: 2020, clemson: 42, opponent: 21 },
      { year: 2021, clemson: 35, opponent: 14 },
      { year: 2022, clemson: 28, opponent: 31 },
    ]);
  });

  it('should handle empty array', () => {
    const result = formatGameDataForChart([]);
    expect(result).toEqual([]);
  });

  it('should handle single game', () => {
    const games = [{ year: 2024, clemsonScore: 66, opponentScore: 20 }];
    const result = formatGameDataForChart(games);

    expect(result).toEqual([{ year: 2024, clemson: 66, opponent: 20 }]);
  });

  it('should handle zero scores', () => {
    const games = [{ year: 2024, clemsonScore: 0, opponentScore: 0 }];
    const result = formatGameDataForChart(games);

    expect(result).toEqual([{ year: 2024, clemson: 0, opponent: 0 }]);
  });
});
