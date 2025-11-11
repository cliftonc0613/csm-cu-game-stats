/**
 * Unit tests for template enforcement
 */

import { describe, it, expect, beforeAll } from '@jest/globals';
import path from 'path';
import fs from 'fs';
import {
  extractSectionHeaders,
  loadTemplateStructure,
  validateAgainstTemplate,
  haveSameStructure,
  formatTemplateValidationErrors,
} from './template';

describe('extractSectionHeaders', () => {
  it('should extract h1 headers', () => {
    const content = '# Header 1\n\nContent\n\n# Header 2';
    const headers = extractSectionHeaders(content);
    expect(headers).toEqual(['Header 1', 'Header 2']);
  });

  it('should extract headers of different levels', () => {
    const content = '# H1\n## H2\n### H3\n#### H4';
    const headers = extractSectionHeaders(content);
    expect(headers).toEqual(['H1', 'H2', 'H3', 'H4']);
  });

  it('should trim whitespace from headers', () => {
    const content = '#   Header with spaces   ';
    const headers = extractSectionHeaders(content);
    expect(headers).toEqual(['Header with spaces']);
  });

  it('should handle empty content', () => {
    const headers = extractSectionHeaders('');
    expect(headers).toEqual([]);
  });

  it('should handle content without headers', () => {
    const content = 'Just some regular text without any headers';
    const headers = extractSectionHeaders(content);
    expect(headers).toEqual([]);
  });
});

describe('loadTemplateStructure', () => {
  const templatePath = path.join(process.cwd(), 'content/templates/game-stats-template.md');

  it('should load template structure', () => {
    const structure = loadTemplateStructure(templatePath);
    expect(structure).toBeDefined();
    expect(structure.requiredFields).toBeDefined();
    expect(structure.frontmatterSchema).toBeDefined();
    expect(structure.sectionHeaders).toBeDefined();
  });

  it('should extract frontmatter fields', () => {
    const structure = loadTemplateStructure(templatePath);
    expect(structure.requiredFields).toContain('game_date');
    expect(structure.requiredFields).toContain('opponent');
    expect(structure.requiredFields).toContain('score.clemson');
    expect(structure.requiredFields).toContain('score.opponent');
    expect(structure.requiredFields).toContain('season');
  });

  it('should extract section headers', () => {
    const structure = loadTemplateStructure(templatePath);
    expect(structure.sectionHeaders).toContain('Game Overview');
    expect(structure.sectionHeaders).toContain('Team Statistics');
    expect(structure.sectionHeaders).toContain('Individual Statistics');
  });

  it('should throw error for non-existent file', () => {
    const invalidPath = '/non/existent/template.md';
    expect(() => loadTemplateStructure(invalidPath)).toThrow('Failed to read template file');
  });
});

describe('validateAgainstTemplate', () => {
  const templatePath = path.join(process.cwd(), 'content/templates/game-stats-template.md');
  let template: ReturnType<typeof loadTemplateStructure>;

  beforeAll(() => {
    template = loadTemplateStructure(templatePath);
  });

  it('should validate compliant game file', () => {
    const gamePath = path.join(process.cwd(), 'content/games/2024-09-07-appalachian-state.md');
    const errors = validateAgainstTemplate(gamePath, template);

    // Should have no critical errors (missing fields)
    const criticalErrors = errors.filter((e) => e.message.includes('Missing required'));
    expect(criticalErrors.length).toBe(0);
  });

  it('should detect missing frontmatter fields', () => {
    // Create a temporary test file with missing fields
    const testContent = `---
game_date: "2024-09-07"
opponent: "Test"
season: 2024
---

# Game Overview

Test content`;

    const testPath = path.join(process.cwd(), 'content/games/test-missing-fields.md');
    fs.writeFileSync(testPath, testContent);

    try {
      const errors = validateAgainstTemplate(testPath, template);
      const missingFields = errors.filter((e) => e.message.includes('Missing required'));
      expect(missingFields.length).toBeGreaterThan(0);
    } finally {
      // Clean up test file
      if (fs.existsSync(testPath)) {
        fs.unlinkSync(testPath);
      }
    }
  });

  it('should detect missing section headers', () => {
    // Create a temporary test file with missing sections
    const testContent = `---
game_date: "2024-09-07"
opponent: "Test Opponent"
opponent_short: "TEST"
score:
  clemson: 42
  opponent: 21
season: 2024
game_type: "regular_season"
content_type: "statistics"
location: "Test Stadium"
home_away: "home"
---

# Game Overview

Just the overview, missing other sections.`;

    const testPath = path.join(process.cwd(), 'content/games/test-missing-sections.md');
    fs.writeFileSync(testPath, testContent);

    try {
      const errors = validateAgainstTemplate(testPath, template);
      const missingSections = errors.filter((e) => e.message.includes('Missing required section header'));
      expect(missingSections.length).toBeGreaterThan(0);
    } finally {
      // Clean up test file
      if (fs.existsSync(testPath)) {
        fs.unlinkSync(testPath);
      }
    }
  });

  it('should handle file read errors', () => {
    const invalidPath = '/non/existent/file.md';
    const errors = validateAgainstTemplate(invalidPath, template);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].message).toContain('Failed to read file');
  });
});

describe('haveSameStructure', () => {
  it('should return true for objects with same structure', () => {
    const obj1 = {
      game_date: '2024-09-07',
      opponent: 'Test',
      score: { clemson: 42, opponent: 21 },
    };

    const obj2 = {
      game_date: '2024-09-21',
      opponent: 'Other',
      score: { clemson: 35, opponent: 28 },
    };

    expect(haveSameStructure(obj1, obj2)).toBe(true);
  });

  it('should return false for objects with different structure', () => {
    const obj1 = {
      game_date: '2024-09-07',
      opponent: 'Test',
    };

    const obj2 = {
      game_date: '2024-09-21',
      opponent: 'Other',
      extra_field: 'value',
    };

    expect(haveSameStructure(obj1, obj2)).toBe(false);
  });

  it('should handle nested objects', () => {
    const obj1 = {
      score: { clemson: 42, opponent: 21 },
    };

    const obj2 = {
      score: { clemson: 35, opponent: 28 },
    };

    expect(haveSameStructure(obj1, obj2)).toBe(true);
  });

  it('should return false for different nesting levels', () => {
    const obj1 = {
      score: { clemson: 42 },
    };

    const obj2 = {
      score: { clemson: { value: 35 } },
    };

    expect(haveSameStructure(obj1, obj2)).toBe(false);
  });
});

describe('formatTemplateValidationErrors', () => {
  it('should format validation errors', () => {
    const errors = new Map([
      [
        'file1.md',
        [
          { field: 'game_date', message: 'Missing required field' },
          { field: 'opponent', message: 'Missing required field' },
        ],
      ],
      ['file2.md', [{ message: 'Failed to parse' }]],
    ]);

    const formatted = formatTemplateValidationErrors(errors);
    expect(formatted).toContain('file1.md');
    expect(formatted).toContain('file2.md');
    expect(formatted).toContain('[game_date]');
    expect(formatted).toContain('Missing required field');
  });

  it('should return success message for no errors', () => {
    const errors = new Map();
    const formatted = formatTemplateValidationErrors(errors);
    expect(formatted).toContain('All files match');
  });
});
