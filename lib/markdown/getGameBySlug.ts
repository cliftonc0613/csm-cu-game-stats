/**
 * Helper function to retrieve a single game by its slug
 */

import { parseMarkdownFile, getMarkdownFiles, CONTENT_DIRS } from './parser';
import { validateGameFrontmatterStrict } from './validator';
import type { ParsedGame } from './types';

/**
 * Get a single game by its slug
 * @param slug - URL slug for the game
 * @param options - Options for validation and search
 * @returns Parsed game or null if not found
 */
export async function getGameBySlug(
  slug: string,
  options: {
    validate?: boolean;
    includeEvaluations?: boolean;
  } = {}
): Promise<ParsedGame | null> {
  const { validate = true, includeEvaluations = false } = options;

  // Get all game files
  const gameFiles = getMarkdownFiles(CONTENT_DIRS.games);
  const evaluationFiles = includeEvaluations ? getMarkdownFiles(CONTENT_DIRS.evaluations) : [];
  const allFiles = [...gameFiles, ...evaluationFiles];

  // Try to find the game by slug
  for (const filePath of allFiles) {
    try {
      const parsed = await parseMarkdownFile(filePath);

      // Check if this is the game we're looking for
      if (parsed.slug === slug) {
        // Validate frontmatter if requested
        if (validate) {
          validateGameFrontmatterStrict(parsed.frontmatter);
        }

        return parsed;
      }
    } catch (error) {
      // Log error but continue searching
      console.error(`Error parsing ${filePath}:`, error instanceof Error ? error.message : String(error));
    }
  }

  // Game not found
  return null;
}

/**
 * Get a single game by its slug (strict mode - throws if not found)
 * @param slug - URL slug for the game
 * @param options - Options for validation and search
 * @returns Parsed game
 * @throws Error if game is not found
 */
export async function getGameBySlugStrict(
  slug: string,
  options: {
    validate?: boolean;
    includeEvaluations?: boolean;
  } = {}
): Promise<ParsedGame> {
  const game = await getGameBySlug(slug, options);

  if (!game) {
    throw new Error(`Game not found: ${slug}`);
  }

  return game;
}

/**
 * Check if a game exists by slug
 * @param slug - URL slug for the game
 * @param options - Options for search
 * @returns True if game exists
 */
export async function gameExists(
  slug: string,
  options: {
    includeEvaluations?: boolean;
  } = {}
): Promise<boolean> {
  const game = await getGameBySlug(slug, { validate: false, ...options });
  return game !== null;
}

/**
 * Get all game slugs
 * @param options - Options for search
 * @returns Array of all game slugs
 */
export async function getAllGameSlugs(
  options: {
    includeEvaluations?: boolean;
  } = {}
): Promise<string[]> {
  const { includeEvaluations = false } = options;

  const slugs: string[] = [];
  const gameFiles = getMarkdownFiles(CONTENT_DIRS.games);
  const evaluationFiles = includeEvaluations ? getMarkdownFiles(CONTENT_DIRS.evaluations) : [];
  const allFiles = [...gameFiles, ...evaluationFiles];

  for (const filePath of allFiles) {
    try {
      const parsed = await parseMarkdownFile(filePath, { generateExcerpt: false });
      slugs.push(parsed.slug);
    } catch (error) {
      console.error(`Error parsing ${filePath}:`, error instanceof Error ? error.message : String(error));
    }
  }

  return slugs;
}

/**
 * Get game by date and opponent (alternative lookup method)
 * @param gameDate - Game date in YYYY-MM-DD format
 * @param opponent - Opponent name
 * @param options - Options for validation and search
 * @returns Parsed game or null if not found
 */
export async function getGameByDateAndOpponent(
  gameDate: string,
  opponent: string,
  options: {
    validate?: boolean;
    includeEvaluations?: boolean;
  } = {}
): Promise<ParsedGame | null> {
  const { validate = true, includeEvaluations = false } = options;

  const gameFiles = getMarkdownFiles(CONTENT_DIRS.games);
  const evaluationFiles = includeEvaluations ? getMarkdownFiles(CONTENT_DIRS.evaluations) : [];
  const allFiles = [...gameFiles, ...evaluationFiles];

  for (const filePath of allFiles) {
    try {
      const parsed = await parseMarkdownFile(filePath);

      // Check if this is the game we're looking for
      if (parsed.frontmatter.game_date === gameDate && parsed.frontmatter.opponent === opponent) {
        // Validate frontmatter if requested
        if (validate) {
          validateGameFrontmatterStrict(parsed.frontmatter);
        }

        return parsed;
      }
    } catch (error) {
      console.error(`Error parsing ${filePath}:`, error instanceof Error ? error.message : String(error));
    }
  }

  return null;
}

/**
 * Get recent games (most recent first)
 * @param limit - Number of games to return
 * @param options - Options for validation and search
 * @returns Array of recent games
 */
export async function getRecentGames(
  limit = 5,
  options: {
    validate?: boolean;
    includeEvaluations?: boolean;
  } = {}
): Promise<ParsedGame[]> {
  const { validate = true, includeEvaluations = false } = options;

  const games: ParsedGame[] = [];
  const gameFiles = getMarkdownFiles(CONTENT_DIRS.games);
  const evaluationFiles = includeEvaluations ? getMarkdownFiles(CONTENT_DIRS.evaluations) : [];
  const allFiles = [...gameFiles, ...evaluationFiles];

  for (const filePath of allFiles) {
    try {
      const parsed = await parseMarkdownFile(filePath);

      if (validate) {
        validateGameFrontmatterStrict(parsed.frontmatter);
      }

      games.push(parsed);
    } catch (error) {
      console.error(`Error parsing ${filePath}:`, error instanceof Error ? error.message : String(error));
    }
  }

  // Sort by date (most recent first) and limit
  return games
    .sort((a, b) => {
      const dateA = new Date(a.frontmatter.game_date).getTime();
      const dateB = new Date(b.frontmatter.game_date).getTime();
      return dateB - dateA;
    })
    .slice(0, limit);
}

/**
 * Get related games (same opponent, same season, etc.)
 * @param slug - Current game slug
 * @param options - Options for finding related games
 * @returns Array of related games
 */
export async function getRelatedGames(
  slug: string,
  options: {
    limit?: number;
    sameOpponent?: boolean;
    sameSeason?: boolean;
    validate?: boolean;
  } = {}
): Promise<ParsedGame[]> {
  const { limit = 5, sameOpponent = true, sameSeason = false, validate = false } = options;

  // Get the current game
  const currentGame = await getGameBySlug(slug, { validate: false });
  if (!currentGame) {
    return [];
  }

  const related: ParsedGame[] = [];
  const gameFiles = getMarkdownFiles(CONTENT_DIRS.games);

  for (const filePath of gameFiles) {
    try {
      const parsed = await parseMarkdownFile(filePath, { generateExcerpt: false });

      // Skip the current game
      if (parsed.slug === slug) {
        continue;
      }

      // Check if it matches criteria
      let isRelated = false;

      if (sameOpponent && parsed.frontmatter.opponent === currentGame.frontmatter.opponent) {
        isRelated = true;
      }

      if (sameSeason && parsed.frontmatter.season === currentGame.frontmatter.season) {
        isRelated = true;
      }

      if (isRelated) {
        if (validate) {
          validateGameFrontmatterStrict(parsed.frontmatter);
        }
        related.push(parsed);
      }
    } catch (error) {
      console.error(`Error parsing ${filePath}:`, error instanceof Error ? error.message : String(error));
    }
  }

  // Sort by date (most recent first) and limit
  return related
    .sort((a, b) => {
      const dateA = new Date(a.frontmatter.game_date).getTime();
      const dateB = new Date(b.frontmatter.game_date).getTime();
      return dateB - dateA;
    })
    .slice(0, limit);
}
