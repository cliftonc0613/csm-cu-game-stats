/**
 * Unit tests for markdown parser
 */

import { describe, it, expect } from '@jest/globals';
import path from 'path';
import {
  generateSlug,
  generateGameSlug,
  extractExcerpt,
  parseMarkdownFile,
  parseMarkdownString,
  getMarkdownFiles,
  fileExists,
} from './parser';

describe('generateSlug', () => {
  it('should convert text to lowercase slug', () => {
    expect(generateSlug('Hello World')).toBe('hello-world');
  });

  it('should replace spaces with hyphens', () => {
    expect(generateSlug('Appalachian State')).toBe('appalachian-state');
  });

  it('should remove special characters', () => {
    expect(generateSlug('NC State #1 Team!')).toBe('nc-state-1-team');
  });

  it('should handle multiple consecutive spaces', () => {
    expect(generateSlug('Too   Many    Spaces')).toBe('too-many-spaces');
  });

  it('should remove leading and trailing hyphens', () => {
    expect(generateSlug('  Leading and Trailing  ')).toBe('leading-and-trailing');
  });
});

describe('generateGameSlug', () => {
  it('should generate slug in YYYY-MM-DD-opponent format', () => {
    const result = generateGameSlug('2024-09-07', 'Appalachian State');
    expect(result).toBe('2024-09-07-appalachian-state');
  });

  it('should handle different date formats', () => {
    const result = generateGameSlug('2024-11-02', 'Louisville');
    expect(result).toBe('2024-11-02-louisville');
  });

  it('should handle opponent names with special characters', () => {
    const result = generateGameSlug('2024-09-21', 'NC State #1');
    expect(result).toBe('2024-09-21-nc-state-1');
  });
});

describe('extractExcerpt', () => {
  it('should extract excerpt from markdown content', () => {
    const content = 'This is a test content with some text that should be excerpted.';
    const excerpt = extractExcerpt(content, 30);
    expect(excerpt.length).toBeLessThanOrEqual(33); // 30 + '...'
  });

  it('should remove markdown headers', () => {
    const content = '# Header\n\nSome content here';
    const excerpt = extractExcerpt(content);
    expect(excerpt).not.toContain('#');
  });

  it('should remove markdown formatting', () => {
    const content = 'This is **bold** and *italic* text';
    const excerpt = extractExcerpt(content);
    expect(excerpt).toBe('This is bold and italic text');
  });

  it('should convert links to text', () => {
    const content = 'Check out [this link](https://example.com)';
    const excerpt = extractExcerpt(content);
    expect(excerpt).toBe('Check out this link');
  });

  it('should truncate at word boundary', () => {
    const content = 'This is a very long sentence that needs to be truncated properly';
    const excerpt = extractExcerpt(content, 20);
    expect(excerpt).toMatch(/\.\.\.$|^.{0,23}$/);
    expect(excerpt).not.toContain('This is a very long s...'); // Should not cut mid-word
  });

  it('should return full content if shorter than max length', () => {
    const content = 'Short content';
    const excerpt = extractExcerpt(content, 100);
    expect(excerpt).toBe('Short content');
  });
});

describe('parseMarkdownString', () => {
  it('should parse valid markdown with frontmatter', async () => {
    const markdown = `---
game_date: "2024-09-07"
opponent: "Test Opponent"
score:
  clemson: 42
  opponent: 21
season: 2024
game_type: "regular_season"
content_type: "statistics"
home_away: "home"
---

# Game Overview

This is the game content.`;

    const result = await parseMarkdownString(markdown);
    expect(result.frontmatter.game_date).toBe('2024-09-07');
    expect(result.frontmatter.opponent).toBe('Test Opponent');
    expect(result.frontmatter.score.clemson).toBe(42);
    expect(result.frontmatter.score.opponent).toBe(21);
    expect(result.slug).toBe('2024-09-07-test-opponent');
  });

  it('should convert markdown to HTML', async () => {
    const markdown = `---
game_date: "2024-09-07"
opponent: "Test"
score:
  clemson: 42
  opponent: 21
season: 2024
game_type: "regular_season"
content_type: "statistics"
home_away: "home"
---

# Header

This is **bold** text.`;

    const result = await parseMarkdownString(markdown);
    expect(result.content).toContain('<h1>');
    expect(result.content).toContain('<strong>');
  });

  it('should generate excerpt by default', async () => {
    const markdown = `---
game_date: "2024-09-07"
opponent: "Test"
score:
  clemson: 42
  opponent: 21
season: 2024
game_type: "regular_season"
content_type: "statistics"
home_away: "home"
---

This is content for excerpt.`;

    const result = await parseMarkdownString(markdown);
    expect(result.excerpt).toBeDefined();
    expect(result.excerpt).toContain('This is content');
  });

  it('should use provided slug if available', async () => {
    const markdown = `---
game_date: "2024-09-07"
opponent: "Test"
slug: "custom-slug"
score:
  clemson: 42
  opponent: 21
season: 2024
game_type: "regular_season"
content_type: "statistics"
home_away: "home"
---

Content here.`;

    const result = await parseMarkdownString(markdown);
    expect(result.slug).toBe('custom-slug');
  });

  it('should throw error if game_date or opponent missing', async () => {
    const markdown = `---
score:
  clemson: 42
  opponent: 21
---

Content.`;

    await expect(parseMarkdownString(markdown)).rejects.toThrow();
  });
});

describe('parseMarkdownFile', () => {
  it('should parse existing markdown file', async () => {
    const filePath = path.join(process.cwd(), 'content/games/2024-09-07-appalachian-state.md');
    const result = await parseMarkdownFile(filePath);

    expect(result.frontmatter.game_date).toBe('2024-09-07');
    expect(result.frontmatter.opponent).toBe('Appalachian State');
    expect(result.frontmatter.score.clemson).toBe(66);
    expect(result.frontmatter.score.opponent).toBe(20);
    expect(result.slug).toBeDefined();
  });

  it('should throw error for non-existent file', async () => {
    const filePath = path.join(process.cwd(), 'content/games/non-existent.md');
    await expect(parseMarkdownFile(filePath)).rejects.toThrow('Failed to read file');
  });
});

describe('getMarkdownFiles', () => {
  it('should return markdown files in directory', () => {
    const gamesDir = path.join(process.cwd(), 'content/games');
    const files = getMarkdownFiles(gamesDir);

    expect(Array.isArray(files)).toBe(true);
    expect(files.length).toBeGreaterThan(0);
    files.forEach((file) => {
      expect(file).toMatch(/\.md$/);
    });
  });

  it('should return empty array for non-existent directory', () => {
    const files = getMarkdownFiles('/non/existent/path');
    expect(files).toEqual([]);
  });

  it('should only return .md files', () => {
    const gamesDir = path.join(process.cwd(), 'content/games');
    const files = getMarkdownFiles(gamesDir);

    files.forEach((file) => {
      expect(path.extname(file)).toBe('.md');
    });
  });
});

describe('fileExists', () => {
  it('should return true for existing file', () => {
    const filePath = path.join(process.cwd(), 'content/games/2024-09-07-appalachian-state.md');
    expect(fileExists(filePath)).toBe(true);
  });

  it('should return false for non-existent file', () => {
    const filePath = path.join(process.cwd(), 'content/games/non-existent.md');
    expect(fileExists(filePath)).toBe(false);
  });

  it('should return false for directory', () => {
    const dirPath = path.join(process.cwd(), 'content/games');
    expect(fileExists(dirPath)).toBe(false);
  });
});
