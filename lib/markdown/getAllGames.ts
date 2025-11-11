/**
 * Helper function to retrieve all game statistics and evaluations
 */

import path from 'path';
import { parseMarkdownFile, getMarkdownFiles, CONTENT_DIRS } from './parser';
import { validateGameFrontmatterStrict } from './validator';
import type { ParsedGame, GameFrontmatter, GameListItem, GameFilters, GameSortOptions } from './types';

/**
 * Get all games from both statistics and evaluations directories
 * @param options - Options for filtering and sorting
 * @returns Array of parsed games
 */
export async function getAllGames(options: {
  validate?: boolean;
  includeEvaluations?: boolean;
  filters?: GameFilters;
  sort?: GameSortOptions;
} = {}): Promise<ParsedGame[]> {
  const { validate = true, includeEvaluations = false, filters, sort } = options;

  const games: ParsedGame[] = [];
  const errors: Array<{ file: string; error: string }> = [];

  // Get all game statistics files
  const gameFiles = getMarkdownFiles(CONTENT_DIRS.games);

  // Optionally include evaluations
  const evaluationFiles = includeEvaluations ? getMarkdownFiles(CONTENT_DIRS.evaluations) : [];

  const allFiles = [...gameFiles, ...evaluationFiles];

  // Parse each file
  for (const filePath of allFiles) {
    try {
      const parsed = await parseMarkdownFile(filePath);

      // Validate frontmatter if requested
      if (validate) {
        validateGameFrontmatterStrict(parsed.frontmatter);
      }

      games.push(parsed);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      errors.push({ file: filePath, error: errorMessage });
      console.error(`Error parsing ${filePath}:`, errorMessage);
    }
  }

  // Log errors summary if any
  if (errors.length > 0) {
    console.warn(`Failed to parse ${errors.length} of ${allFiles.length} game files`);
  }

  // Apply filters if provided
  let filteredGames = games;
  if (filters) {
    filteredGames = filterGames(games, filters);
  }

  // Apply sorting if provided
  if (sort) {
    filteredGames = sortGames(filteredGames, sort);
  } else {
    // Default sort: most recent first
    filteredGames = sortGames(filteredGames, { field: 'game_date', order: 'desc' });
  }

  return filteredGames;
}

/**
 * Get all games as list items (simplified format for lists/grids)
 * @param options - Options for filtering and sorting
 * @returns Array of game list items
 */
export async function getAllGamesAsListItems(options: {
  validate?: boolean;
  includeEvaluations?: boolean;
  filters?: GameFilters;
  sort?: GameSortOptions;
} = {}): Promise<GameListItem[]> {
  const games = await getAllGames(options);
  return games.map(gameToListItem);
}

/**
 * Convert a parsed game to a list item
 * @param game - Parsed game
 * @returns Game list item
 */
function gameToListItem(game: ParsedGame): GameListItem {
  const { frontmatter, slug } = game;
  const clemsonScore = frontmatter.score.clemson;
  const opponentScore = frontmatter.score.opponent;

  let result: 'win' | 'loss' | 'tie';
  if (clemsonScore > opponentScore) {
    result = 'win';
  } else if (clemsonScore < opponentScore) {
    result = 'loss';
  } else {
    result = 'tie';
  }

  return {
    slug,
    opponent: frontmatter.opponent,
    opponentShort: frontmatter.opponent_short,
    gameDate: new Date(frontmatter.game_date),
    score: frontmatter.score,
    season: frontmatter.season,
    gameType: frontmatter.game_type,
    contentType: frontmatter.content_type,
    homeAway: frontmatter.home_away,
    result,
  };
}

/**
 * Filter games based on provided criteria
 * @param games - Array of games to filter
 * @param filters - Filter criteria
 * @returns Filtered array of games
 */
function filterGames(games: ParsedGame[], filters: GameFilters): ParsedGame[] {
  return games.filter((game) => {
    const { frontmatter } = game;

    // Season filter
    if (filters.season !== undefined && frontmatter.season !== filters.season) {
      return false;
    }

    // Opponent filter
    if (filters.opponent !== undefined && frontmatter.opponent !== filters.opponent) {
      return false;
    }

    // Game type filter
    if (filters.gameType !== undefined && frontmatter.game_type !== filters.gameType) {
      return false;
    }

    // Content type filter
    if (filters.contentType !== undefined && frontmatter.content_type !== filters.contentType) {
      return false;
    }

    // Home/Away filter
    if (filters.homeAway !== undefined && frontmatter.home_away !== filters.homeAway) {
      return false;
    }

    // Result filter (win/loss/tie)
    if (filters.result !== undefined) {
      const clemsonScore = frontmatter.score.clemson;
      const opponentScore = frontmatter.score.opponent;
      let result: 'win' | 'loss' | 'tie';

      if (clemsonScore > opponentScore) {
        result = 'win';
      } else if (clemsonScore < opponentScore) {
        result = 'loss';
      } else {
        result = 'tie';
      }

      if (result !== filters.result) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Sort games based on provided criteria
 * @param games - Array of games to sort
 * @param sort - Sort options
 * @returns Sorted array of games
 */
function sortGames(games: ParsedGame[], sort: GameSortOptions): ParsedGame[] {
  const { field, order } = sort;
  const multiplier = order === 'asc' ? 1 : -1;

  return [...games].sort((a, b) => {
    let valueA: string | number;
    let valueB: string | number;

    switch (field) {
      case 'game_date':
        valueA = new Date(a.frontmatter.game_date).getTime();
        valueB = new Date(b.frontmatter.game_date).getTime();
        break;
      case 'opponent':
        valueA = a.frontmatter.opponent.toLowerCase();
        valueB = b.frontmatter.opponent.toLowerCase();
        break;
      case 'score':
        valueA = a.frontmatter.score.clemson - a.frontmatter.score.opponent;
        valueB = b.frontmatter.score.clemson - b.frontmatter.score.opponent;
        break;
      case 'season':
        valueA = a.frontmatter.season;
        valueB = b.frontmatter.season;
        break;
      default:
        return 0;
    }

    if (valueA < valueB) {
      return -1 * multiplier;
    }
    if (valueA > valueB) {
      return 1 * multiplier;
    }
    return 0;
  });
}

/**
 * Get games for a specific season
 * @param season - Season year
 * @param options - Additional options
 * @returns Array of games for the season
 */
export async function getGamesBySeason(
  season: number,
  options: {
    validate?: boolean;
    includeEvaluations?: boolean;
    sort?: GameSortOptions;
  } = {}
): Promise<ParsedGame[]> {
  return getAllGames({
    ...options,
    filters: { season },
  });
}

/**
 * Get games against a specific opponent
 * @param opponent - Opponent name
 * @param options - Additional options
 * @returns Array of games against the opponent
 */
export async function getGamesByOpponent(
  opponent: string,
  options: {
    validate?: boolean;
    includeEvaluations?: boolean;
    sort?: GameSortOptions;
  } = {}
): Promise<ParsedGame[]> {
  return getAllGames({
    ...options,
    filters: { opponent },
  });
}

/**
 * Get unique seasons from all games
 * @returns Array of season years (sorted descending)
 */
export async function getAllSeasons(): Promise<number[]> {
  const games = await getAllGames({ validate: false });
  const seasons = new Set(games.map((game) => game.frontmatter.season));
  return Array.from(seasons).sort((a, b) => b - a);
}

/**
 * Get unique opponents from all games
 * @returns Array of opponent names (sorted alphabetically)
 */
export async function getAllOpponents(): Promise<string[]> {
  const games = await getAllGames({ validate: false });
  const opponents = new Set(games.map((game) => game.frontmatter.opponent));
  return Array.from(opponents).sort();
}

/**
 * Get game statistics (wins, losses, total games, etc.)
 * @param filters - Optional filters to apply
 * @returns Statistics object
 */
export async function getGameStatistics(filters?: GameFilters): Promise<{
  totalGames: number;
  wins: number;
  losses: number;
  ties: number;
  winPercentage: number;
  totalPointsScored: number;
  totalPointsAllowed: number;
  averagePointsScored: number;
  averagePointsAllowed: number;
}> {
  const games = await getAllGames({ validate: false, filters });

  let wins = 0;
  let losses = 0;
  let ties = 0;
  let totalPointsScored = 0;
  let totalPointsAllowed = 0;

  for (const game of games) {
    const clemsonScore = game.frontmatter.score.clemson;
    const opponentScore = game.frontmatter.score.opponent;

    totalPointsScored += clemsonScore;
    totalPointsAllowed += opponentScore;

    if (clemsonScore > opponentScore) {
      wins++;
    } else if (clemsonScore < opponentScore) {
      losses++;
    } else {
      ties++;
    }
  }

  const totalGames = games.length;
  const winPercentage = totalGames > 0 ? (wins / totalGames) * 100 : 0;
  const averagePointsScored = totalGames > 0 ? totalPointsScored / totalGames : 0;
  const averagePointsAllowed = totalGames > 0 ? totalPointsAllowed / totalGames : 0;

  return {
    totalGames,
    wins,
    losses,
    ties,
    winPercentage,
    totalPointsScored,
    totalPointsAllowed,
    averagePointsScored,
    averagePointsAllowed,
  };
}
