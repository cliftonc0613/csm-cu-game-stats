import {
  parseMarkdownTable,
  parseTeamSectionTable,
  getAvailableTables,
} from './tableParser';

describe('tableParser', () => {
  const sampleMarkdown = `
# Game Overview

Some game description here.

## Team Statistics

### Scoring Summary

| Quarter | Clemson | Opponent |
|---------|---------|----------|
| 1st     | 10      | 0        |
| 2nd     | 7       | 7        |
| 3rd     | 14      | 7        |
| 4th     | 3       | 7        |
| **Final** | **34** | **21**  |

### Team Stats Comparison

| Statistic | Clemson | Opponent |
|-----------|---------|----------|
| First Downs | 24 | 19 |
| Total Yards | 428 | 312 |
| Passing Yards | 228 | 244 |
| Rushing Yards | 200 | 68 |
| Turnovers | 0 | 1 |
| Penalties-Yards | 5-40 | 8-65 |
| Time of Possession | 34:42 | 25:18 |

## Individual Statistics

### Passing

**Clemson**

| Player | Comp-Att | Yards | TD | INT | Rating |
|--------|----------|-------|----|----|--------|
| Cade Klubnik | 18-26 | 228 | 2 | 0 | 158.2 |

**Opponent**

| Player | Comp-Att | Yards | TD | INT | Rating |
|--------|----------|-------|----|----|--------|
| Tyler Shough | 24-38 | 244 | 2 | 1 | 122.4 |

### Rushing

**Clemson**

| Player | Attempts | Yards | Avg | TD | Long |
|--------|----------|-------|-----|----|----|
| Phil Mafah | 24 | 156 | 6.5 | 1 | 38 |
| Jay Haynes | 11 | 38 | 3.5 | 0 | 12 |

**Opponent**

| Player | Attempts | Yards | Avg | TD | Long |
|--------|----------|-------|-----|----|----|
| Isaac Brown | 12 | 44 | 3.7 | 0 | 14 |
`;

  describe('parseMarkdownTable', () => {
    it('should parse a simple table by title', () => {
      const result = parseMarkdownTable(sampleMarkdown, 'Scoring Summary');

      expect(result).toHaveLength(5);
      expect(result[0]).toEqual({
        quarter: '1st',
        clemson: 10,
        opponent: 0,
      });
      expect(result[1]).toEqual({
        quarter: '2nd',
        clemson: 7,
        opponent: 7,
      });
    });

    it('should handle table with various column types', () => {
      const result = parseMarkdownTable(sampleMarkdown, 'Team Stats Comparison');

      expect(result).toHaveLength(7);
      expect(result[0]).toEqual({
        statistic: 'First Downs',
        clemson: 24,
        opponent: 19,
      });
      expect(result[2]).toEqual({
        statistic: 'Passing Yards',
        clemson: 228,
        opponent: 244,
      });
      expect(result[5]).toEqual({
        statistic: 'Penalties-Yards',
        clemson: '5-40',
        opponent: '8-65',
      });
    });

    it('should return empty array when table not found', () => {
      const result = parseMarkdownTable(sampleMarkdown, 'Nonexistent Table');

      expect(result).toEqual([]);
    });

    it('should handle case-insensitive title matching', () => {
      const result = parseMarkdownTable(sampleMarkdown, 'scoring summary');

      expect(result).toHaveLength(5);
    });

    it('should normalize header names to camelCase', () => {
      const result = parseMarkdownTable(sampleMarkdown, 'Team Stats Comparison');

      expect(result[0]).toHaveProperty('statistic');
      expect(result[0]).toHaveProperty('clemson');
      expect(result[0]).toHaveProperty('opponent');
    });

    it('should convert numeric strings to numbers', () => {
      const result = parseMarkdownTable(sampleMarkdown, 'Scoring Summary');

      expect(typeof result[0].clemson).toBe('number');
      expect(typeof result[0].opponent).toBe('number');
      expect(result[0].clemson).toBe(10);
    });

    it('should handle bold formatting in cells', () => {
      const result = parseMarkdownTable(sampleMarkdown, 'Scoring Summary');

      const finalRow = result[4];
      expect(finalRow.quarter).toBe('Final');
      expect(finalRow.clemson).toBe(34);
      expect(finalRow.opponent).toBe(21);
    });

    it('should handle empty or malformed markdown', () => {
      const result = parseMarkdownTable('', 'Any Table');
      expect(result).toEqual([]);

      const result2 = parseMarkdownTable('# No Tables Here\n\nJust text.', 'Table');
      expect(result2).toEqual([]);
    });

    it('should handle tables with hyphenated headers', () => {
      const result = parseMarkdownTable(sampleMarkdown, 'Team Stats Comparison');

      const penaltiesRow = result.find((row) => row.statistic === 'Penalties-Yards');
      expect(penaltiesRow).toBeDefined();
    });

    it('should stop parsing at next heading', () => {
      const result = parseMarkdownTable(sampleMarkdown, 'Team Stats Comparison');

      // Should not include data from the next section
      expect(result).toHaveLength(7);
      expect(result.every((row) => row.statistic)).toBe(true);
    });
  });

  describe('parseTeamSectionTable', () => {
    it('should parse Clemson passing stats', () => {
      const result = parseTeamSectionTable(sampleMarkdown, 'Passing');

      expect(result.clemson).toHaveLength(1);
      expect(result.clemson[0]).toEqual({
        player: 'Cade Klubnik',
        compAtt: '18-26',
        yards: 228,
        td: 2,
        int: 0,
        rating: 158.2,
      });
    });

    it('should parse Opponent passing stats', () => {
      const result = parseTeamSectionTable(sampleMarkdown, 'Passing');

      expect(result.opponent).toHaveLength(1);
      expect(result.opponent[0]).toEqual({
        player: 'Tyler Shough',
        compAtt: '24-38',
        yards: 244,
        td: 2,
        int: 1,
        rating: 122.4,
      });
    });

    it('should parse both teams rushing stats', () => {
      const result = parseTeamSectionTable(sampleMarkdown, 'Rushing');

      expect(result.clemson).toHaveLength(2);
      expect(result.clemson[0]).toEqual({
        player: 'Phil Mafah',
        attempts: 24,
        yards: 156,
        avg: 6.5,
        td: 1,
        long: 38,
      });

      expect(result.opponent).toHaveLength(1);
      expect(result.opponent[0]).toEqual({
        player: 'Isaac Brown',
        attempts: 12,
        yards: 44,
        avg: 3.7,
        td: 0,
        long: 14,
      });
    });

    it('should return empty arrays when section not found', () => {
      const result = parseTeamSectionTable(sampleMarkdown, 'Defense');

      expect(result.clemson).toEqual([]);
      expect(result.opponent).toEqual([]);
    });

    it('should handle section with only one team', () => {
      const partialMarkdown = `
### Passing

**Clemson**

| Player | Yards |
|--------|-------|
| QB1    | 250   |
`;

      const result = parseTeamSectionTable(partialMarkdown, 'Passing');

      expect(result.clemson).toHaveLength(1);
      expect(result.opponent).toEqual([]);
    });

    it('should handle case-insensitive section matching', () => {
      const result = parseTeamSectionTable(sampleMarkdown, 'passing');

      expect(result.clemson).toHaveLength(1);
      expect(result.opponent).toHaveLength(1);
    });
  });

  describe('getAvailableTables', () => {
    it('should find all table titles in markdown', () => {
      const titles = getAvailableTables(sampleMarkdown);

      expect(titles).toContain('Scoring Summary');
      expect(titles).toContain('Team Stats Comparison');
      expect(titles).toContain('Passing');
      expect(titles).toContain('Rushing');
    });

    it('should return empty array for markdown without tables', () => {
      const noTables = '# Heading\n\nSome text\n\n## Another Heading\n\nMore text';
      const titles = getAvailableTables(noTables);

      expect(titles).toEqual([]);
    });

    it('should not duplicate titles', () => {
      const titles = getAvailableTables(sampleMarkdown);
      const uniqueTitles = [...new Set(titles)];

      expect(titles.length).toBe(uniqueTitles.length);
    });
  });

  describe('Edge Cases', () => {
    it('should handle tables with extra whitespace', () => {
      const messyTable = `
### Test Table

|  Column1  |  Column2  |
|-----------|-----------|
|  Value1   |  Value2   |
`;

      const result = parseMarkdownTable(messyTable, 'Test Table');

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        column1: 'Value1',
        column2: 'Value2',
      });
    });

    it('should handle tables with missing cells', () => {
      const incompleteTable = `
### Incomplete

| Col1 | Col2 | Col3 |
|------|------|------|
| A    | B    | C    |
| D    | E    |
| F    |
`;

      const result = parseMarkdownTable(incompleteTable, 'Incomplete');

      // Should only parse complete rows
      expect(result).toHaveLength(1);
    });

    it('should handle decimal numbers correctly', () => {
      const decimalTable = `
### Stats

| Player | Average |
|--------|---------|
| Player1 | 6.5 |
| Player2 | 12.3 |
`;

      const result = parseMarkdownTable(decimalTable, 'Stats');

      expect(result[0].average).toBe(6.5);
      expect(result[1].average).toBe(12.3);
      expect(typeof result[0].average).toBe('number');
    });

    it('should handle special characters in values', () => {
      const specialChars = `
### Data

| Name | Value |
|------|-------|
| Test | 5-40 |
| Test2 | 34:42 |
`;

      const result = parseMarkdownTable(specialChars, 'Data');

      expect(result[0].value).toBe('5-40');
      expect(result[1].value).toBe('34:42');
    });
  });
});
