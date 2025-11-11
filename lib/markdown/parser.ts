/**
 * Markdown parser for game statistics and evaluations
 * Uses gray-matter for frontmatter extraction and remark for HTML conversion
 */

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import type { GameFrontmatter, ParsedGame } from './types';

/**
 * Default content directories
 */
export const CONTENT_DIRS = {
  games: path.join(process.cwd(), 'content', 'games'),
  evaluations: path.join(process.cwd(), 'content', 'evaluations'),
  templates: path.join(process.cwd(), 'content', 'templates'),
} as const;

/**
 * Generate a URL-friendly slug from a string
 * @param text - Text to convert to slug
 * @returns URL-friendly slug
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric chars with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

/**
 * Generate slug from game data
 * Format: YYYY-MM-DD-opponent-name
 * @param gameDate - Game date string
 * @param opponent - Opponent name
 * @returns Generated slug
 */
export function generateGameSlug(gameDate: string, opponent: string): string {
  const date = new Date(gameDate);
  const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD
  const opponentSlug = generateSlug(opponent);
  return `${dateStr}-${opponentSlug}`;
}

/**
 * Extract excerpt from markdown content
 * @param content - Markdown content
 * @param maxLength - Maximum excerpt length
 * @returns Excerpt string
 */
export function extractExcerpt(content: string, maxLength = 200): string {
  // Remove markdown syntax for a plain text excerpt
  const plainText = content
    .replace(/#{1,6}\s+/g, '') // Remove headers
    .replace(/[*_~`]/g, '') // Remove formatting
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Convert links to text
    .replace(/\n+/g, ' ') // Replace newlines with spaces
    .trim();

  if (plainText.length <= maxLength) {
    return plainText;
  }

  // Truncate at word boundary
  const truncated = plainText.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  return lastSpace > 0 ? truncated.substring(0, lastSpace) + '...' : truncated + '...';
}

/**
 * Parse markdown content to HTML
 * @param markdownContent - Raw markdown content
 * @returns Processed HTML string
 */
export async function markdownToHtml(markdownContent: string): Promise<string> {
  const result = await remark()
    .use(html, { sanitize: false }) // We trust our own content
    .process(markdownContent);

  return result.toString();
}

/**
 * Parse a markdown file and extract frontmatter and content
 * @param filePath - Absolute path to the markdown file
 * @param options - Parser options
 * @returns Parsed game data
 * @throws Error if file cannot be read or parsed
 */
export async function parseMarkdownFile<T extends GameFrontmatter = GameFrontmatter>(
  filePath: string,
  options: {
    generateExcerpt?: boolean;
    excerptLength?: number;
  } = {}
): Promise<ParsedGame<T>> {
  const { generateExcerpt: shouldGenerateExcerpt = true, excerptLength = 200 } = options;

  // Read the file
  let fileContents: string;
  try {
    fileContents = fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    throw new Error(`Failed to read file ${filePath}: ${error instanceof Error ? error.message : String(error)}`);
  }

  // Parse frontmatter and content
  let parsed: matter.GrayMatterFile<string>;
  try {
    parsed = matter(fileContents);
  } catch (error) {
    throw new Error(`Failed to parse frontmatter in ${filePath}: ${error instanceof Error ? error.message : String(error)}`);
  }

  const frontmatter = parsed.data as T;
  const rawContent = parsed.content;

  // Generate slug if not provided in frontmatter
  let slug: string;
  if (frontmatter.slug) {
    slug = frontmatter.slug;
  } else if (frontmatter.game_date && frontmatter.opponent) {
    slug = generateGameSlug(frontmatter.game_date, frontmatter.opponent);
    frontmatter.slug = slug;
  } else {
    // Fallback to filename
    const filename = path.basename(filePath, path.extname(filePath));
    slug = generateSlug(filename);
    frontmatter.slug = slug;
  }

  // Convert markdown to HTML
  let processedContent: string;
  try {
    processedContent = await markdownToHtml(rawContent);
  } catch (error) {
    throw new Error(`Failed to convert markdown to HTML in ${filePath}: ${error instanceof Error ? error.message : String(error)}`);
  }

  // Generate excerpt if requested
  const excerpt = shouldGenerateExcerpt ? extractExcerpt(rawContent, excerptLength) : undefined;

  return {
    frontmatter,
    content: processedContent,
    rawContent,
    slug,
    excerpt,
  };
}

/**
 * Parse markdown content from a string
 * @param markdownString - Markdown content as string
 * @param options - Parser options
 * @returns Parsed game data
 * @throws Error if content cannot be parsed
 */
export async function parseMarkdownString<T extends GameFrontmatter = GameFrontmatter>(
  markdownString: string,
  options: {
    generateExcerpt?: boolean;
    excerptLength?: number;
  } = {}
): Promise<ParsedGame<T>> {
  const { generateExcerpt: shouldGenerateExcerpt = true, excerptLength = 200 } = options;

  // Parse frontmatter and content
  let parsed: matter.GrayMatterFile<string>;
  try {
    parsed = matter(markdownString);
  } catch (error) {
    throw new Error(`Failed to parse frontmatter: ${error instanceof Error ? error.message : String(error)}`);
  }

  const frontmatter = parsed.data as T;
  const rawContent = parsed.content;

  // Generate slug
  let slug: string;
  if (frontmatter.slug) {
    slug = frontmatter.slug;
  } else if (frontmatter.game_date && frontmatter.opponent) {
    slug = generateGameSlug(frontmatter.game_date, frontmatter.opponent);
    frontmatter.slug = slug;
  } else {
    throw new Error('Cannot generate slug: missing game_date or opponent in frontmatter');
  }

  // Convert markdown to HTML
  let processedContent: string;
  try {
    processedContent = await markdownToHtml(rawContent);
  } catch (error) {
    throw new Error(`Failed to convert markdown to HTML: ${error instanceof Error ? error.message : String(error)}`);
  }

  // Generate excerpt if requested
  const excerpt = shouldGenerateExcerpt ? extractExcerpt(rawContent, excerptLength) : undefined;

  return {
    frontmatter,
    content: processedContent,
    rawContent,
    slug,
    excerpt,
  };
}

/**
 * Get all markdown files in a directory
 * @param directory - Directory path
 * @returns Array of file paths
 */
export function getMarkdownFiles(directory: string): string[] {
  try {
    if (!fs.existsSync(directory)) {
      return [];
    }

    const files = fs.readdirSync(directory);
    return files
      .filter((file) => file.endsWith('.md'))
      .map((file) => path.join(directory, file));
  } catch (error) {
    console.error(`Error reading directory ${directory}:`, error);
    return [];
  }
}

/**
 * Check if a file exists
 * @param filePath - File path to check
 * @returns True if file exists
 */
export function fileExists(filePath: string): boolean {
  try {
    return fs.existsSync(filePath) && fs.statSync(filePath).isFile();
  } catch {
    return false;
  }
}
