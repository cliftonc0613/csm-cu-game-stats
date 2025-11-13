/**
 * Markdown Table Parser
 *
 * Utilities for extracting and parsing markdown tables from game content.
 * Tables are identified by their section headings and parsed into structured objects.
 */

export interface TableRow {
  [key: string]: string | number;
}

export interface ParsedTable {
  title: string;
  headers: string[];
  rows: TableRow[];
}

/**
 * Parse a markdown table into structured data
 *
 * @param content - Full markdown content
 * @param tableTitle - Title/heading of the table to extract (e.g., "Scoring Summary", "Team Stats Comparison")
 * @returns Array of row objects with column keys, or empty array if table not found
 *
 * @example
 * ```ts
 * const content = `
 * ## Team Statistics
 *
 * ### Scoring Summary
 *
 * | Quarter | Clemson | Opponent |
 * |---------|---------|----------|
 * | 1st     | 10      | 0        |
 * | 2nd     | 7       | 7        |
 * `;
 *
 * const data = parseMarkdownTable(content, "Scoring Summary");
 * // Returns: [
 * //   { quarter: "1st", clemson: 10, opponent: 0 },
 * //   { quarter: "2nd", clemson: 7, opponent: 7 }
 * // ]
 * ```
 */
export function parseMarkdownTable(
  content: string,
  tableTitle: string
): TableRow[] {
  try {
    const lines = content.split('\n');

    // Find the table by its heading
    const titlePattern = new RegExp(`^#{1,6}\\s+${escapeRegex(tableTitle)}\\s*$`, 'i');
    let titleIndex = -1;

    for (let i = 0; i < lines.length; i++) {
      if (titlePattern.test(lines[i].trim())) {
        titleIndex = i;
        break;
      }
    }

    if (titleIndex === -1) {
      return [];
    }

    // Find the start of the table (first line with pipes)
    let tableStartIndex = -1;
    for (let i = titleIndex + 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line.startsWith('|') && line.endsWith('|')) {
        tableStartIndex = i;
        break;
      }
      // Stop if we hit another heading
      if (line.startsWith('#')) {
        break;
      }
    }

    if (tableStartIndex === -1) {
      return [];
    }

    // Parse table headers
    const headerLine = lines[tableStartIndex].trim();
    const headers = parseTableRow(headerLine);

    if (headers.length === 0) {
      return [];
    }

    // Skip separator line (the line with dashes)
    const separatorIndex = tableStartIndex + 1;
    if (separatorIndex >= lines.length) {
      return [];
    }

    // Parse data rows
    const rows: TableRow[] = [];
    let currentIndex = separatorIndex + 1;

    while (currentIndex < lines.length) {
      const line = lines[currentIndex].trim();

      // Stop if we hit an empty line, another heading, or non-table content
      if (!line || line.startsWith('#') || !line.startsWith('|')) {
        break;
      }

      const values = parseTableRow(line);

      if (values.length === headers.length) {
        const rowObject: TableRow = {};
        headers.forEach((header, index) => {
          const normalizedHeader = normalizeHeaderName(header);
          const value = values[index];
          rowObject[normalizedHeader] = convertValue(value);
        });
        rows.push(rowObject);
      }

      currentIndex++;
    }

    return rows;
  } catch (error) {
    console.error(`Error parsing table "${tableTitle}":`, error);
    return [];
  }
}

/**
 * Parse a single table row (pipe-delimited)
 *
 * @param line - Single line of markdown table
 * @returns Array of cell values (trimmed)
 */
function parseTableRow(line: string): string[] {
  return line
    .split('|')
    .slice(1, -1) // Remove leading and trailing empty strings from split
    .map((cell) => cell.trim())
    .filter((cell) => cell !== ''); // Remove empty cells
}

/**
 * Normalize header names to camelCase for object keys
 *
 * @param header - Raw header text
 * @returns Normalized key name
 *
 * @example
 * "First Downs" -> "firstDowns"
 * "Comp-Att" -> "compAtt"
 * "Time of Possession" -> "timeOfPossession"
 */
function normalizeHeaderName(header: string): string {
  // Remove markdown formatting (bold, italic)
  let normalized = header.replace(/\*\*/g, '').replace(/\*/g, '').replace(/_/g, '');

  // Convert to camelCase
  normalized = normalized
    .toLowerCase()
    .replace(/[^a-z0-9]+(.)/g, (_, char) => char.toUpperCase())
    .replace(/^./, (char) => char.toLowerCase());

  return normalized || 'value';
}

/**
 * Convert string value to appropriate type (number or string)
 *
 * @param value - Raw cell value
 * @returns Converted value (number if numeric, otherwise string)
 */
function convertValue(value: string): string | number {
  // Remove markdown formatting
  const cleaned = value.replace(/\*\*/g, '').replace(/\*/g, '').trim();

  // Keep as string if it contains special characters that indicate compound values
  // Examples: "5-40" (penalties-yards), "24-38" (comp-att), "34:42" (time)
  if (cleaned.includes('-') || cleaned.includes(':') || cleaned.includes('/')) {
    return cleaned;
  }

  // Check if it's a pure number
  const num = parseFloat(cleaned);
  if (!isNaN(num) && cleaned !== '' && cleaned === num.toString()) {
    return num;
  }

  return cleaned;
}

/**
 * Escape special regex characters in a string
 */
function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Parse a table with team-specific subsections (e.g., Passing, Rushing)
 * Returns separate arrays for Clemson and Opponent data
 *
 * @param content - Full markdown content
 * @param sectionTitle - Section heading (e.g., "Passing", "Rushing")
 * @returns Object with clemson and opponent data arrays
 *
 * @example
 * ```ts
 * const data = parseTeamSectionTable(content, "Passing");
 * // Returns: {
 * //   clemson: [{ player: "Cade Klubnik", ... }],
 * //   opponent: [{ player: "Tyler Shough", ... }]
 * // }
 * ```
 */
export function parseTeamSectionTable(
  content: string,
  sectionTitle: string
): { clemson: TableRow[]; opponent: TableRow[] } {
  const result = { clemson: [] as TableRow[], opponent: [] as TableRow[] };

  try {
    const lines = content.split('\n');

    // Find the section heading
    const sectionPattern = new RegExp(`^#{1,6}\\s+${escapeRegex(sectionTitle)}\\s*$`, 'i');
    let sectionIndex = -1;

    for (let i = 0; i < lines.length; i++) {
      if (sectionPattern.test(lines[i].trim())) {
        sectionIndex = i;
        break;
      }
    }

    if (sectionIndex === -1) {
      return result;
    }

    // Find next section to know where to stop
    let nextSectionIndex = lines.length;
    for (let i = sectionIndex + 1; i < lines.length; i++) {
      if (/^#{1,6}\s+/.test(lines[i].trim())) {
        // Check if it's a peer-level or higher-level heading
        const currentLevel = (lines[sectionIndex].match(/^#+/) || [''])[0].length;
        const nextLevel = (lines[i].match(/^#+/) || [''])[0].length;
        if (nextLevel <= currentLevel) {
          nextSectionIndex = i;
          break;
        }
      }
    }

    const sectionContent = lines.slice(sectionIndex, nextSectionIndex).join('\n');

    // Parse Clemson subsection
    const clemsonMatch = sectionContent.match(/\*\*Clemson\*\*/i);
    if (clemsonMatch) {
      const clemsonStart = sectionContent.indexOf(clemsonMatch[0]);
      const clemsonSection = sectionContent.substring(clemsonStart);
      result.clemson = parseFirstTableInSection(clemsonSection);
    }

    // Parse Opponent subsection
    const opponentMatch = sectionContent.match(/\*\*Opponent\*\*/i);
    if (opponentMatch) {
      const opponentStart = sectionContent.indexOf(opponentMatch[0]);
      const opponentSection = sectionContent.substring(opponentStart);
      result.opponent = parseFirstTableInSection(opponentSection);
    }

    return result;
  } catch (error) {
    console.error(`Error parsing team section "${sectionTitle}":`, error);
    return result;
  }
}

/**
 * Parse the first table found in a section of content
 */
function parseFirstTableInSection(content: string): TableRow[] {
  const lines = content.split('\n');

  // Find first table
  let tableStartIndex = -1;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.startsWith('|') && line.endsWith('|')) {
      tableStartIndex = i;
      break;
    }
  }

  if (tableStartIndex === -1) {
    return [];
  }

  // Parse headers
  const headerLine = lines[tableStartIndex].trim();
  const headers = parseTableRow(headerLine);

  if (headers.length === 0) {
    return [];
  }

  // Skip separator
  const dataStartIndex = tableStartIndex + 2;
  const rows: TableRow[] = [];

  for (let i = dataStartIndex; i < lines.length; i++) {
    const line = lines[i].trim();

    // Stop at empty line, another heading, or another bold subsection
    if (!line || line.startsWith('#') || line.startsWith('**') || !line.startsWith('|')) {
      break;
    }

    const values = parseTableRow(line);

    if (values.length === headers.length) {
      const rowObject: TableRow = {};
      headers.forEach((header, index) => {
        const normalizedHeader = normalizeHeaderName(header);
        const value = values[index];
        rowObject[normalizedHeader] = convertValue(value);
      });
      rows.push(rowObject);
    }
  }

  return rows;
}

/**
 * Get all table titles from markdown content
 * Useful for discovering available tables
 *
 * @param content - Full markdown content
 * @returns Array of table titles found in the content
 */
export function getAvailableTables(content: string): string[] {
  const titles: string[] = [];
  const lines = content.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Check if it's a heading
    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      const title = headingMatch[2].trim();

      // Look ahead to see if there's a table after this heading
      for (let j = i + 1; j < Math.min(i + 10, lines.length); j++) {
        const nextLine = lines[j].trim();
        if (nextLine.startsWith('|') && nextLine.endsWith('|')) {
          titles.push(title);
          break;
        }
        if (nextLine.startsWith('#')) {
          break;
        }
      }
    }
  }

  return titles;
}
