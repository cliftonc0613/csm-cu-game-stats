/**
 * TypeScript type definitions for game statistics and evaluations
 */

/**
 * Game score information
 */
export interface GameScore {
  clemson: number;
  opponent: number;
}

/**
 * Team information
 */
export interface TeamInfo {
  name: string;
  logo?: string;
  record?: string; // e.g., "10-2"
}

/**
 * Frontmatter schema for game statistics markdown files
 */
export interface GameStatsFrontmatter {
  game_date: string; // ISO 8601 date string (YYYY-MM-DD)
  opponent: string; // Opponent team name
  opponent_short?: string; // Short name for display
  score: GameScore; // Final scores
  season: number; // Year (e.g., 2024)
  game_type: 'regular_season' | 'bowl' | 'playoff' | 'championship'; // Type of game
  content_type: 'statistics'; // Content type discriminator
  location?: string; // Game location (e.g., "Memorial Stadium, Clemson, SC")
  attendance?: number; // Game attendance
  weather?: string; // Weather conditions
  home_away: 'home' | 'away' | 'neutral'; // Game location type
  win_streak?: number; // Current win streak after this game
  slug?: string; // URL slug (auto-generated if not provided)
}

/**
 * Frontmatter schema for game evaluation markdown files
 */
export interface GameEvaluationFrontmatter {
  game_date: string; // ISO 8601 date string (YYYY-MM-DD)
  opponent: string; // Opponent team name
  opponent_short?: string; // Short name for display
  score: GameScore; // Final scores
  season: number; // Year (e.g., 2024)
  game_type: 'regular_season' | 'bowl' | 'playoff' | 'championship'; // Type of game
  content_type: 'evaluation'; // Content type discriminator
  location?: string; // Game location
  home_away: 'home' | 'away' | 'neutral'; // Game location type
  slug?: string; // URL slug (auto-generated if not provided)
}

/**
 * Union type for all frontmatter types
 */
export type GameFrontmatter = GameStatsFrontmatter | GameEvaluationFrontmatter;

/**
 * Parsed game data structure returned by the parser
 */
export interface ParsedGame<T extends GameFrontmatter = GameFrontmatter> {
  frontmatter: T; // Validated frontmatter data
  content: string; // Processed HTML content from markdown
  rawContent: string; // Original markdown content (without frontmatter)
  slug: string; // URL-friendly slug derived from frontmatter or filename
  excerpt?: string; // Optional excerpt for preview
}

/**
 * Game list item for displaying in lists/grids
 */
export interface GameListItem {
  slug: string;
  opponent: string;
  opponentShort?: string;
  gameDate: Date;
  score: GameScore;
  season: number;
  gameType: string;
  contentType: 'statistics' | 'evaluation';
  homeAway: 'home' | 'away' | 'neutral';
  result: 'win' | 'loss' | 'tie';
}

/**
 * Template structure metadata
 */
export interface TemplateStructure {
  requiredFields: string[]; // Required frontmatter fields
  frontmatterSchema: Record<string, unknown>; // Expected frontmatter structure
  sectionHeaders: string[]; // Expected markdown section headers
}

/**
 * Validation error details
 */
export interface ValidationError {
  field?: string; // Field name that failed validation
  message: string; // Error message
  path?: string[]; // Path to the error in nested objects
  value?: unknown; // The invalid value
}

/**
 * Validation result
 */
export interface ValidationResult<T = unknown> {
  success: boolean;
  data?: T; // Validated data (if success)
  errors?: ValidationError[]; // Array of validation errors (if failed)
}

/**
 * Filter options for game queries
 */
export interface GameFilters {
  season?: number;
  opponent?: string;
  gameType?: string;
  contentType?: 'statistics' | 'evaluation';
  homeAway?: 'home' | 'away' | 'neutral';
  result?: 'win' | 'loss' | 'tie';
}

/**
 * Sort options for game lists
 */
export interface GameSortOptions {
  field: 'game_date' | 'opponent' | 'score' | 'season';
  order: 'asc' | 'desc';
}
