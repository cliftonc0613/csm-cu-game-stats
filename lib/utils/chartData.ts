/**
 * Chart Data Transformation Utilities
 *
 * Functions to transform parsed markdown table data into Recharts-compatible formats.
 * Each function takes raw table data from tableParser and returns typed chart data.
 */

import type { TableRow } from '@/lib/markdown/tableParser';
import type { TeamStatsData } from '@/components/game/TeamStatsChart';
import type { ScoringProgressionData } from '@/components/game/ScoringProgressionChart';
import type { PassingStatsData } from '@/components/game/PassingStatsChart';
import type { RushingStatsData } from '@/components/game/RushingStatsChart';
import type { ReceivingStatsData } from '@/components/game/ReceivingStatsChart';
import type { DefenseStatsData } from '@/components/game/DefenseStatsChart';

/**
 * Transform Team Stats Comparison table into chart data
 *
 * @param tableData - Raw table rows from parseMarkdownTable
 * @returns Array of team statistics formatted for TeamStatsChart
 *
 * @example
 * ```ts
 * const rawData = parseMarkdownTable(content, "Team Stats Comparison");
 * const chartData = transformTeamStats(rawData);
 * // Returns: [
 * //   { stat: 'First Downs', clemson: 24, opponent: 19 },
 * //   { stat: 'Total Yards', clemson: 428, opponent: 312 },
 * //   ...
 * // ]
 * ```
 */
export function transformTeamStats(tableData: TableRow[]): TeamStatsData[] {
  return tableData
    .map((row) => {
      const stat = String(row.statistic || row.stat || '');
      const clemson = parseNumber(row.clemson);
      const opponent = parseNumber(row.opponent);

      // Only include rows with valid stat name and numeric values
      if (!stat || isNaN(clemson) || isNaN(opponent)) {
        return null;
      }

      return {
        stat,
        clemson,
        opponent,
      };
    })
    .filter((row): row is TeamStatsData => row !== null);
}

/**
 * Transform Scoring Summary table into cumulative progression data
 *
 * @param tableData - Raw scoring table rows (quarter-by-quarter scores)
 * @returns Array of cumulative scoring data for ScoringProgressionChart
 *
 * @example
 * ```ts
 * const rawData = parseMarkdownTable(content, "Scoring Summary");
 * const chartData = transformScoringData(rawData);
 * // Input:  [{ quarter: "1st", clemson: 10, opponent: 0 }, ...]
 * // Output: [{ quarter: "1st", clemson: 10, opponent: 0 },
 * //          { quarter: "2nd", clemson: 17, opponent: 7 }, ...]
 * ```
 */
export function transformScoringData(tableData: TableRow[]): ScoringProgressionData[] {
  let clemsonTotal = 0;
  let opponentTotal = 0;

  return tableData
    .map((row) => {
      const quarter = String(row.quarter || '');
      const clemsonScore = parseNumber(row.clemson);
      const opponentScore = parseNumber(row.opponent);

      // Skip invalid rows or final/total rows (non-quarter labels)
      if (!quarter || isNaN(clemsonScore) || isNaN(opponentScore)) {
        return null;
      }

      // Skip "Final" or "Total" rows (we want quarters only)
      if (quarter.toLowerCase().includes('final') || quarter.toLowerCase().includes('total')) {
        return null;
      }

      // Calculate cumulative totals
      clemsonTotal += clemsonScore;
      opponentTotal += opponentScore;

      return {
        quarter,
        clemson: clemsonTotal,
        opponent: opponentTotal,
      };
    })
    .filter((row): row is ScoringProgressionData => row !== null);
}

/**
 * Transform passing statistics table into chart data
 *
 * @param tableData - Raw passing stats rows from parseTeamSectionTable
 * @param team - Team identifier ('clemson' or 'opponent')
 * @returns Array of passing statistics for PassingStatsChart
 *
 * @example
 * ```ts
 * const { clemson, opponent } = parseTeamSectionTable(content, "Passing");
 * const clemsonData = transformPassingStats(clemson, 'clemson');
 * // Returns: [{ player: "Cade Klubnik", completions: 24, attempts: 35, ... }]
 * ```
 */
export function transformPassingStats(
  tableData: TableRow[],
  team: 'clemson' | 'opponent'
): PassingStatsData[] {
  return tableData
    .map((row) => {
      const player = String(row.player || '');

      // Parse Comp-Att format (e.g., "24-38")
      const compAtt = String(row.compAtt || row.completionAttempts || '');
      const [completionsStr, attemptsStr] = compAtt.split('-');
      const completions = parseInt(completionsStr, 10);
      const attempts = parseInt(attemptsStr, 10);

      const yards = parseNumber(row.yards);
      const touchdowns = parseNumber(row.td || row.touchdowns);
      const interceptions = parseNumber(row.int || row.interceptions);
      const rating = parseNumber(row.rating || row.passerRating);

      // Validate required fields
      if (!player || isNaN(completions) || isNaN(attempts) || isNaN(yards)) {
        return null;
      }

      return {
        player,
        completions,
        attempts,
        yards,
        touchdowns: isNaN(touchdowns) ? 0 : touchdowns,
        interceptions: isNaN(interceptions) ? 0 : interceptions,
        rating: isNaN(rating) ? 0 : rating,
        team,
      };
    })
    .filter((row): row is PassingStatsData => row !== null);
}

/**
 * Transform rushing statistics table into chart data
 *
 * @param tableData - Raw rushing stats rows from parseTeamSectionTable
 * @param team - Team identifier ('clemson' or 'opponent')
 * @returns Array of rushing statistics for RushingStatsChart
 */
export function transformRushingStats(
  tableData: TableRow[],
  team: 'clemson' | 'opponent'
): RushingStatsData[] {
  return tableData
    .map((row) => {
      const player = String(row.player || '');
      const attempts = parseNumber(row.attempts || row.att);
      const yards = parseNumber(row.yards || row.yds);
      const average = parseNumber(row.avg || row.average);
      const touchdowns = parseNumber(row.td || row.touchdowns);
      const long = parseNumber(row.long || row.lng);

      // Validate required fields
      if (!player || isNaN(attempts) || isNaN(yards)) {
        return null;
      }

      return {
        player,
        attempts,
        yards,
        average: isNaN(average) ? yards / attempts : average,
        touchdowns: isNaN(touchdowns) ? 0 : touchdowns,
        long: isNaN(long) ? 0 : long,
        team,
      };
    })
    .filter((row): row is RushingStatsData => row !== null);
}

/**
 * Transform receiving statistics table into chart data
 *
 * @param tableData - Raw receiving stats rows from parseTeamSectionTable
 * @param team - Team identifier ('clemson' or 'opponent')
 * @returns Array of receiving statistics for ReceivingStatsChart
 */
export function transformReceivingStats(
  tableData: TableRow[],
  team: 'clemson' | 'opponent'
): ReceivingStatsData[] {
  return tableData
    .map((row) => {
      const player = String(row.player || '');
      const receptions = parseNumber(row.receptions || row.rec);
      const targets = parseNumber(row.targets || row.tgt);
      const yards = parseNumber(row.yards || row.yds);
      const average = parseNumber(row.avg || row.average);
      const touchdowns = parseNumber(row.td || row.touchdowns);
      const long = parseNumber(row.long || row.lng);

      // Validate required fields
      if (!player || isNaN(receptions) || isNaN(yards)) {
        return null;
      }

      return {
        player,
        receptions,
        targets: isNaN(targets) ? receptions : targets,
        yards,
        average: isNaN(average) ? yards / receptions : average,
        touchdowns: isNaN(touchdowns) ? 0 : touchdowns,
        long: isNaN(long) ? 0 : long,
        team,
      };
    })
    .filter((row): row is ReceivingStatsData => row !== null);
}

/**
 * Transform defensive statistics table into chart data
 *
 * @param tableData - Raw defense stats rows from parseTeamSectionTable
 * @param team - Team identifier ('clemson' or 'opponent')
 * @returns Array of defensive statistics for DefenseStatsChart
 */
export function transformDefenseStats(
  tableData: TableRow[],
  team: 'clemson' | 'opponent'
): DefenseStatsData[] {
  return tableData
    .map((row) => {
      const player = String(row.player || '');
      const tackles = parseNumber(row.tackles || row.tacTotal);
      const soloTackles = parseNumber(row.solo || row.soloTackles);
      const tacklesForLoss = parseNumber(row.tfl || row.tacklesForLoss);
      const sacks = parseNumber(row.sacks || row.sack);
      const interceptions = parseNumber(row.int || row.interceptions);
      const passesDefended = parseNumber(row.pd || row.passesDefended);
      const fumblesRecovered = parseNumber(row.fr || row.fumblesRecovered || row.fumRec);

      // Validate required fields
      if (!player || isNaN(tackles)) {
        return null;
      }

      // Calculate solo tackles from total if not provided
      const calculatedSolo = isNaN(soloTackles) ? tackles : soloTackles;

      return {
        player,
        tackles,
        soloTackles: calculatedSolo,
        tacklesForLoss: isNaN(tacklesForLoss) ? 0 : tacklesForLoss,
        sacks: isNaN(sacks) ? 0 : sacks,
        interceptions: isNaN(interceptions) ? 0 : interceptions,
        passesDefended: isNaN(passesDefended) ? 0 : passesDefended,
        fumblesRecovered: isNaN(fumblesRecovered) ? 0 : fumblesRecovered,
        team,
      };
    })
    .filter((row): row is DefenseStatsData => row !== null);
}

/**
 * Parse a value to a number, handling various input types
 *
 * @param value - Value to parse (can be string, number, or other)
 * @returns Parsed number or NaN if invalid
 */
function parseNumber(value: unknown): number {
  if (typeof value === 'number') {
    return value;
  }

  if (typeof value === 'string') {
    const cleaned = value.trim();
    const num = parseFloat(cleaned);
    return isNaN(num) ? NaN : num;
  }

  return NaN;
}

/**
 * Combine Clemson and Opponent player stats into a single array
 * Useful for charts that display both teams together
 *
 * @param clemsonData - Clemson player data
 * @param opponentData - Opponent player data
 * @returns Combined array with both teams
 */
export function combinePlayers<T extends { team: 'clemson' | 'opponent' }>(
  clemsonData: T[],
  opponentData: T[]
): T[] {
  return [...clemsonData, ...opponentData];
}

/**
 * Filter top N players by a specific stat
 *
 * @param data - Player data array
 * @param statKey - Key to sort by (e.g., 'yards', 'tackles')
 * @param limit - Number of players to return
 * @returns Top N players sorted by stat
 */
export function filterTopPlayers<T extends Record<string, unknown>>(
  data: T[],
  statKey: keyof T,
  limit: number = 5
): T[] {
  return [...data]
    .sort((a, b) => {
      const aVal = typeof a[statKey] === 'number' ? a[statKey] : 0;
      const bVal = typeof b[statKey] === 'number' ? b[statKey] : 0;
      return (bVal as number) - (aVal as number);
    })
    .slice(0, limit);
}
