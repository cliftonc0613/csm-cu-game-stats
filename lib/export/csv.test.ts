/**
 * Unit tests for CSV export utilities
 */

import { describe, it, expect } from '@jest/globals';
import {
  escapeCSVValue,
  flattenObject,
  arrayToCSV,
  gameMetadataToCSV,
  extractTablesFromMarkdown,
  gameToCSV,
  gamesToCSV,
  createCSVDownload,
} from './csv';
import type { ParsedGame, GameStatsFrontmatter } from '@/lib/markdown/types';

describe('escapeCSVValue', () => {
  it('should return empty string for null or undefined', () => {
    expect(escapeCSVValue(null)).toBe('');
    expect(escapeCSVValue(undefined)).toBe('');
  });

  it('should convert numbers to strings', () => {
    expect(escapeCSVValue(42)).toBe('42');
    expect(escapeCSVValue(3.14)).toBe('3.14');
  });

  it('should not quote simple strings', () => {
    expect(escapeCSVValue('hello')).toBe('hello');
    expect(escapeCSVValue('world123')).toBe('world123');
  });

  it('should quote strings containing delimiter', () => {
    expect(escapeCSVValue('hello, world')).toBe('"hello, world"');
    expect(escapeCSVValue('a,b,c')).toBe('"a,b,c"');
  });

  it('should quote strings containing newlines', () => {
    expect(escapeCSVValue('line1\nline2')).toBe('"line1\nline2"');
    expect(escapeCSVValue('line1\r\nline2')).toBe('"line1\r\nline2"');
  });

  it('should escape quote characters by doubling them', () => {
    expect(escapeCSVValue('say "hello"')).toBe('"say ""hello"""');
    expect(escapeCSVValue('it\'s a "test"')).toBe('"it\'s a ""test"""');
  });

  it('should handle custom delimiter and quote char', () => {
    expect(escapeCSVValue('hello;world', ';', "'")).toBe("'hello;world'");
    expect(escapeCSVValue("it's", ';', "'")).toBe("'it''s'");
  });
});

describe('flattenObject', () => {
  it('should flatten nested objects with dot notation', () => {
    const input = {
      name: 'Clemson',
      score: {
        clemson: 42,
        opponent: 21,
      },
    };

    const expected = {
      name: 'Clemson',
      'score.clemson': 42,
      'score.opponent': 21,
    };

    expect(flattenObject(input)).toEqual(expected);
  });

  it('should handle deeply nested objects', () => {
    const input = {
      a: {
        b: {
          c: {
            d: 'value',
          },
        },
      },
    };

    expect(flattenObject(input)).toEqual({
      'a.b.c.d': 'value',
    });
  });

  it('should convert arrays to JSON strings', () => {
    const input = {
      tags: ['offense', 'defense'],
      nested: {
        items: [1, 2, 3],
      },
    };

    const result = flattenObject(input);
    expect(result.tags).toBe('["offense","defense"]');
    expect(result['nested.items']).toBe('[1,2,3]');
  });

  it('should handle Date objects without flattening', () => {
    const date = new Date('2024-09-07');
    const input = {
      gameDate: date,
    };

    const result = flattenObject(input);
    expect(result.gameDate).toBe(date);
  });

  it('should use custom separator', () => {
    const input = {
      a: {
        b: 1,
      },
    };

    expect(flattenObject(input, '', '_')).toEqual({
      a_b: 1,
    });
  });

  it('should handle empty objects', () => {
    expect(flattenObject({})).toEqual({});
  });
});

describe('arrayToCSV', () => {
  it('should convert array of objects to CSV', () => {
    const data = [
      { name: 'John', age: 30, city: 'Clemson' },
      { name: 'Jane', age: 25, city: 'Anderson' },
    ];

    const csv = arrayToCSV(data);
    const lines = csv.split('\n');

    expect(lines[0]).toBe('name,age,city');
    expect(lines[1]).toBe('John,30,Clemson');
    expect(lines[2]).toBe('Jane,25,Anderson');
  });

  it('should handle empty array', () => {
    expect(arrayToCSV([])).toBe('');
  });

  it('should exclude headers when includeHeaders is false', () => {
    const data = [{ name: 'John', age: 30 }];
    const csv = arrayToCSV(data, { includeHeaders: false });

    expect(csv).toBe('John,30');
  });

  it('should use custom delimiter', () => {
    const data = [{ a: 1, b: 2 }];
    const csv = arrayToCSV(data, { delimiter: ';' });

    const lines = csv.split('\n');
    expect(lines[0]).toBe('a;b');
    expect(lines[1]).toBe('1;2');
  });

  it('should use custom line ending', () => {
    const data = [
      { a: 1 },
      { a: 2 },
    ];
    const csv = arrayToCSV(data, { lineEnding: '\r\n' });

    expect(csv).toContain('\r\n');
    expect(csv.split('\r\n')).toHaveLength(3); // header + 2 rows
  });

  it('should flatten nested objects when flattenNested is true', () => {
    const data = [
      {
        name: 'Game1',
        score: {
          clemson: 42,
          opponent: 21,
        },
      },
    ];

    const csv = arrayToCSV(data, { flattenNested: true });
    expect(csv).toContain('score.clemson');
    expect(csv).toContain('score.opponent');
  });

  it('should not flatten when flattenNested is false', () => {
    const data = [
      {
        name: 'Game1',
        score: {
          clemson: 42,
          opponent: 21,
        },
      },
    ];

    const csv = arrayToCSV(data, { flattenNested: false });
    expect(csv).toContain('score');
    expect(csv).not.toContain('score.clemson');
  });

  it('should handle objects with different keys', () => {
    const data = [
      { a: 1, b: 2 },
      { a: 3, c: 4 },
      { b: 5, c: 6 },
    ];

    const csv = arrayToCSV(data);
    const lines = csv.split('\n');

    // Header should contain all keys
    expect(lines[0]).toContain('a');
    expect(lines[0]).toContain('b');
    expect(lines[0]).toContain('c');

    // Missing values should be empty
    expect(lines[2]).toContain('3,,4'); // Row with a=3, no b, c=4
  });

  it('should properly escape special characters', () => {
    const data = [
      { name: 'Test, Inc.', description: 'Line 1\nLine 2' },
    ];

    const csv = arrayToCSV(data);
    expect(csv).toContain('"Test, Inc."');
    expect(csv).toContain('"Line 1\nLine 2"');
  });
});

describe('gameMetadataToCSV', () => {
  const mockGame: ParsedGame = {
    slug: '2024-09-07-appalachian-state',
    frontmatter: {
      game_date: '2024-09-07',
      opponent: 'Appalachian State',
      opponent_short: 'APP ST',
      score: {
        clemson: 66,
        opponent: 20,
      },
      season: 2024,
      game_type: 'regular_season',
      content_type: 'statistics',
      home_away: 'home',
      location: 'Memorial Stadium, Clemson, SC',
      attendance: 81500,
      weather: 'Partly cloudy, 78°F',
      win_streak: 2,
    } as GameStatsFrontmatter,
    content: '<p>Game content</p>',
    rawContent: 'Game content',
    excerpt: 'Excerpt',
  };

  it('should convert single game metadata to CSV', () => {
    const csv = gameMetadataToCSV(mockGame);
    const lines = csv.split('\n');

    // Should have header + 1 data row
    expect(lines.length).toBe(2);

    // Check headers
    expect(lines[0]).toContain('slug');
    expect(lines[0]).toContain('opponent');
    expect(lines[0]).toContain('clemson_score');
    expect(lines[0]).toContain('result');

    // Check data
    expect(lines[1]).toContain('2024-09-07-appalachian-state');
    expect(lines[1]).toContain('Appalachian State');
    expect(lines[1]).toContain('66');
    expect(lines[1]).toContain('20');
    expect(lines[1]).toContain('W'); // Win
  });

  it('should convert array of games to CSV', () => {
    const game2: ParsedGame = {
      ...mockGame,
      slug: '2024-09-21-nc-state',
      frontmatter: {
        ...mockGame.frontmatter,
        game_date: '2024-09-21',
        opponent: 'NC State',
        score: {
          clemson: 59,
          opponent: 35,
        },
      } as GameStatsFrontmatter,
    };

    const csv = gameMetadataToCSV([mockGame, game2]);
    const lines = csv.split('\n');

    // Should have header + 2 data rows
    expect(lines.length).toBe(3);
    expect(lines[1]).toContain('Appalachian State');
    expect(lines[2]).toContain('NC State');
  });

  it('should calculate result correctly (W/L/T)', () => {
    const winGame = { ...mockGame };
    const lossGame: ParsedGame = {
      ...mockGame,
      frontmatter: {
        ...mockGame.frontmatter,
        score: { clemson: 20, opponent: 30 },
      } as GameStatsFrontmatter,
    };
    const tieGame: ParsedGame = {
      ...mockGame,
      frontmatter: {
        ...mockGame.frontmatter,
        score: { clemson: 21, opponent: 21 },
      } as GameStatsFrontmatter,
    };

    expect(gameMetadataToCSV(winGame)).toContain(',W,');
    expect(gameMetadataToCSV(lossGame)).toContain(',L,');
    expect(gameMetadataToCSV(tieGame)).toContain(',T,');
  });

  it('should handle missing optional fields', () => {
    const minimalGame: ParsedGame = {
      slug: '2024-test',
      frontmatter: {
        game_date: '2024-09-07',
        opponent: 'Test Team',
        score: { clemson: 42, opponent: 21 },
        season: 2024,
        game_type: 'regular_season',
        content_type: 'statistics',
        home_away: 'home',
      } as GameStatsFrontmatter,
      content: '',
      rawContent: '',
    };

    const csv = gameMetadataToCSV(minimalGame);
    // Should not throw and should handle missing fields gracefully
    expect(csv).toContain('Test Team');
    expect(csv).toBeTruthy();
  });
});

describe('extractTablesFromMarkdown', () => {
  it('should extract a single table from markdown', () => {
    const markdown = `
# Heading

| Name | Age |
|------|-----|
| John | 30  |
| Jane | 25  |

Some text
    `;

    const tables = extractTablesFromMarkdown(markdown);
    expect(tables).toHaveLength(1);
    expect(tables[0]).toContain('Name,Age');
    expect(tables[0]).toContain('John,30');
    expect(tables[0]).toContain('Jane,25');
  });

  it('should extract multiple tables from markdown', () => {
    const markdown = `
| Table 1 | Value |
|---------|-------|
| A       | 1     |

Some text

| Table 2 | Value |
|---------|-------|
| B       | 2     |
    `;

    const tables = extractTablesFromMarkdown(markdown);
    expect(tables).toHaveLength(2);
    expect(tables[0]).toContain('Table 1');
    expect(tables[1]).toContain('Table 2');
  });

  it('should skip separator rows', () => {
    const markdown = `
| Name | Age |
|------|-----|
| John | 30  |
    `;

    const tables = extractTablesFromMarkdown(markdown);
    expect(tables[0]).not.toContain('---');
    expect(tables[0].split('\n')).toHaveLength(2); // Header + 1 row
  });

  it('should handle tables with different column counts', () => {
    const markdown = `
| A | B | C |
|---|---|---|
| 1 | 2 | 3 |
    `;

    const tables = extractTablesFromMarkdown(markdown);
    expect(tables[0]).toContain('A,B,C');
    expect(tables[0]).toContain('1,2,3');
  });

  it('should return empty array for markdown without tables', () => {
    const markdown = 'Just some text without tables';
    const tables = extractTablesFromMarkdown(markdown);
    expect(tables).toHaveLength(0);
  });

  it('should trim cell whitespace', () => {
    const markdown = `
| Name  |  Age  |
|-------|-------|
|  John |  30   |
    `;

    const tables = extractTablesFromMarkdown(markdown);
    expect(tables[0]).toContain('Name,Age');
    expect(tables[0]).toContain('John,30');
  });
});

describe('gameToCSV', () => {
  const mockGame: ParsedGame = {
    slug: '2024-test',
    frontmatter: {
      game_date: '2024-09-07',
      opponent: 'Test Team',
      score: { clemson: 42, opponent: 21 },
      season: 2024,
      game_type: 'regular_season',
      content_type: 'statistics',
      home_away: 'home',
    } as GameStatsFrontmatter,
    content: '<table>...</table>',
    rawContent: `
# Stats

| Player | Yards |
|--------|-------|
| Smith  | 100   |
    `,
  };

  it('should return both metadata and tables', () => {
    const result = gameToCSV(mockGame);

    expect(result.metadata).toBeTruthy();
    expect(result.tables).toHaveLength(1);
    expect(result.metadata).toContain('Test Team');
    expect(result.tables[0]).toContain('Player,Yards');
  });
});

describe('gamesToCSV', () => {
  it('should combine multiple games into single CSV', () => {
    const games: ParsedGame[] = [
      {
        slug: 'game1',
        frontmatter: {
          game_date: '2024-09-07',
          opponent: 'Team 1',
          score: { clemson: 42, opponent: 21 },
          season: 2024,
          game_type: 'regular_season',
          content_type: 'statistics',
          home_away: 'home',
        } as GameStatsFrontmatter,
        content: '',
        rawContent: '',
      },
      {
        slug: 'game2',
        frontmatter: {
          game_date: '2024-09-14',
          opponent: 'Team 2',
          score: { clemson: 35, opponent: 28 },
          season: 2024,
          game_type: 'regular_season',
          content_type: 'statistics',
          home_away: 'away',
        } as GameStatsFrontmatter,
        content: '',
        rawContent: '',
      },
    ];

    const csv = gamesToCSV(games);
    const lines = csv.split('\n');

    expect(lines).toHaveLength(3); // Header + 2 games
    expect(csv).toContain('Team 1');
    expect(csv).toContain('Team 2');
  });
});

describe('createCSVDownload', () => {
  it('should add BOM for Excel compatibility', () => {
    const result = createCSVDownload('header\ndata');
    expect(result.content.charCodeAt(0)).toBe(0xfeff); // BOM character
  });

  it('should set correct mime type', () => {
    const result = createCSVDownload('data');
    expect(result.mimeType).toBe('text/csv;charset=utf-8;');
    expect(result.headers['Content-Type']).toBe('text/csv;charset=utf-8');
  });

  it('should set content disposition with filename', () => {
    const result = createCSVDownload('data', 'test.csv');
    expect(result.headers['Content-Disposition']).toBe('attachment; filename="test.csv"');
  });

  it('should use default filename', () => {
    const result = createCSVDownload('data');
    expect(result.filename).toBe('export.csv');
  });

  it('should include original content after BOM', () => {
    const content = 'header,value\nrow1,data1';
    const result = createCSVDownload(content);
    expect(result.content.substring(1)).toBe(content); // Skip BOM
  });
});
