/**
 * CSV Export Utilities
 *
 * Provides functions to convert game statistics data to CSV format with:
 * - Proper CSV escaping and formatting
 * - Nested data structure flattening
 * - Header generation
 * - Multiple export formats (metadata, tables, full game data)
 */

import type { ParsedGame } from '@/lib/markdown/types';

/**
 * CSV Export Options
 */
export interface CSVExportOptions {
  /**
   * Include headers in CSV output
   * @default true
   */
  includeHeaders?: boolean;
  /**
   * Delimiter to use between columns
   * @default ','
   */
  delimiter?: string;
  /**
   * Quote character for escaping values
   * @default '"'
   */
  quoteChar?: string;
  /**
   * Line ending character(s)
   * @default '\n'
   */
  lineEnding?: string;
  /**
   * Whether to flatten nested objects
   * @default true
   */
  flattenNested?: boolean;
}

/**
 * Default CSV export options
 */
const DEFAULT_OPTIONS: Required<CSVExportOptions> = {
  includeHeaders: true,
  delimiter: ',',
  quoteChar: '"',
  lineEnding: '\n',
  flattenNested: true,
};

/**
 * Escapes a CSV value by:
 * 1. Converting to string
 * 2. Wrapping in quotes if it contains delimiter, quote char, or newlines
 * 3. Escaping internal quote characters by doubling them
 */
export function escapeCSVValue(
  value: unknown,
  delimiter: string = ',',
  quoteChar: string = '"'
): string {
  // Handle null/undefined
  if (value === null || value === undefined) {
    return '';
  }

  // Convert to string
  let strValue = String(value);

  // Check if value needs to be quoted
  const needsQuoting =
    strValue.includes(delimiter) ||
    strValue.includes(quoteChar) ||
    strValue.includes('\n') ||
    strValue.includes('\r');

  if (needsQuoting) {
    // Escape quote characters by doubling them
    strValue = strValue.replace(new RegExp(quoteChar, 'g'), quoteChar + quoteChar);
    // Wrap in quotes
    return `${quoteChar}${strValue}${quoteChar}`;
  }

  return strValue;
}

/**
 * Flattens a nested object into a single-level object with dot notation keys
 *
 * @example
 * flattenObject({ a: { b: 1, c: 2 } }) => { 'a.b': 1, 'a.c': 2 }
 */
export function flattenObject(
  obj: Record<string, unknown>,
  prefix: string = '',
  separator: string = '.'
): Record<string, unknown> {
  const result: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(obj)) {
    const newKey = prefix ? `${prefix}${separator}${key}` : key;

    if (
      value !== null &&
      typeof value === 'object' &&
      !Array.isArray(value) &&
      !(value instanceof Date)
    ) {
      // Recursively flatten nested objects
      Object.assign(result, flattenObject(value as Record<string, unknown>, newKey, separator));
    } else if (Array.isArray(value)) {
      // Convert arrays to JSON strings
      result[newKey] = JSON.stringify(value);
    } else {
      result[newKey] = value;
    }
  }

  return result;
}

/**
 * Converts an array of objects to CSV format
 *
 * @param data - Array of objects to convert
 * @param options - CSV export options
 * @returns CSV string
 */
export function arrayToCSV<T extends Record<string, unknown>>(
  data: T[],
  options: CSVExportOptions = {}
): string {
  const opts = { ...DEFAULT_OPTIONS, ...options };

  if (data.length === 0) {
    return '';
  }

  // Flatten data if requested
  const processedData = opts.flattenNested
    ? data.map((item) => flattenObject(item) as T)
    : data;

  // Get all unique keys from all objects
  const allKeys = Array.from(
    new Set(processedData.flatMap((item) => Object.keys(item)))
  );

  const lines: string[] = [];

  // Add headers if requested
  if (opts.includeHeaders) {
    const headerLine = allKeys
      .map((key) => escapeCSVValue(key, opts.delimiter, opts.quoteChar))
      .join(opts.delimiter);
    lines.push(headerLine);
  }

  // Add data rows
  for (const item of processedData) {
    const rowValues = allKeys.map((key) =>
      escapeCSVValue(item[key], opts.delimiter, opts.quoteChar)
    );
    lines.push(rowValues.join(opts.delimiter));
  }

  return lines.join(opts.lineEnding);
}

/**
 * Converts game metadata (frontmatter) to CSV format
 *
 * @param games - Array of parsed games or single game
 * @param options - CSV export options
 * @returns CSV string with game metadata
 */
export function gameMetadataToCSV(
  games: ParsedGame | ParsedGame[],
  options: CSVExportOptions = {}
): string {
  const gamesArray = Array.isArray(games) ? games : [games];

  const metadata = gamesArray.map((game) => ({
    slug: game.slug,
    game_date: game.frontmatter.game_date,
    opponent: game.frontmatter.opponent,
    opponent_short: (game.frontmatter as any).opponent_short || '',
    clemson_score: game.frontmatter.score.clemson,
    opponent_score: game.frontmatter.score.opponent,
    result:
      game.frontmatter.score.clemson > game.frontmatter.score.opponent
        ? 'W'
        : game.frontmatter.score.clemson < game.frontmatter.score.opponent
        ? 'L'
        : 'T',
    season: game.frontmatter.season,
    game_type: game.frontmatter.game_type,
    content_type: game.frontmatter.content_type,
    home_away: game.frontmatter.home_away,
    location: (game.frontmatter as any).location || '',
    attendance: (game.frontmatter as any).attendance || '',
    weather: (game.frontmatter as any).weather || '',
    win_streak: (game.frontmatter as any).win_streak || '',
  }));

  return arrayToCSV(metadata, options);
}

/**
 * Extracts tables from markdown content and converts them to CSV
 *
 * @param markdownContent - Raw markdown content
 * @returns Array of CSV strings (one per table found)
 */
export function extractTablesFromMarkdown(markdownContent: string): string[] {
  const csvTables: string[] = [];
  const lines = markdownContent.split('\n');

  let inTable = false;
  let currentTable: string[] = [];

  for (const line of lines) {
    const trimmedLine = line.trim();

    // Check if line is a table row (starts with |)
    if (trimmedLine.startsWith('|')) {
      inTable = true;

      // Skip separator rows (like |---|---|)
      if (trimmedLine.match(/^\|[\s\-:|]+\|$/)) {
        continue;
      }

      // Parse table row
      const cells = trimmedLine
        .split('|')
        .slice(1, -1) // Remove first and last empty elements
        .map((cell) => cell.trim());

      currentTable.push(cells.join(','));
    } else if (inTable && trimmedLine === '') {
      // End of table
      if (currentTable.length > 0) {
        csvTables.push(currentTable.join('\n'));
        currentTable = [];
      }
      inTable = false;
    }
  }

  // Add last table if exists
  if (currentTable.length > 0) {
    csvTables.push(currentTable.join('\n'));
  }

  return csvTables;
}

/**
 * Converts a single game's full data to CSV format
 * Includes metadata and all tables from the content
 *
 * @param game - Parsed game data
 * @param options - CSV export options
 * @returns Object containing metadata CSV and array of table CSVs
 */
export function gameToCSV(
  game: ParsedGame,
  options: CSVExportOptions = {}
): {
  metadata: string;
  tables: string[];
} {
  return {
    metadata: gameMetadataToCSV(game, options),
    tables: extractTablesFromMarkdown(game.rawContent),
  };
}

/**
 * Converts multiple games to a combined CSV export
 * Useful for exporting a season or filtered set of games
 *
 * @param games - Array of parsed games
 * @param options - CSV export options
 * @returns CSV string with all games' metadata
 */
export function gamesToCSV(games: ParsedGame[], options: CSVExportOptions = {}): string {
  return gameMetadataToCSV(games, options);
}

/**
 * Creates a downloadable CSV file content with proper headers
 *
 * @param csvContent - CSV string content
 * @param filename - Suggested filename for download
 * @returns Object with CSV content and download headers
 */
export function createCSVDownload(csvContent: string, filename: string = 'export.csv') {
  // Add BOM for Excel compatibility with UTF-8
  const bom = '\uFEFF';
  const content = bom + csvContent;

  return {
    content,
    filename,
    mimeType: 'text/csv;charset=utf-8;',
    headers: {
      'Content-Type': 'text/csv;charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  };
}
