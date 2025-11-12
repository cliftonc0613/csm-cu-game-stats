# Task List: Recharts Visualizations for Single Game Pages

## Relevant Files

- `app/games/[slug]/page.tsx` - Main single game page that will integrate new chart components
- `components/game/TeamStatsChart.tsx` - New component for team statistics comparison visualization (to be created)
- `components/game/TeamStatsChart.test.tsx` - Unit tests for TeamStatsChart
- `components/game/ScoringProgressionChart.tsx` - New component for quarter-by-quarter scoring visualization (to be created)
- `components/game/ScoringProgressionChart.test.tsx` - Unit tests for ScoringProgressionChart
- `components/game/PlayerStatsChart.tsx` - New component for individual player statistics (to be created)
- `components/game/PlayerStatsChart.test.tsx` - Unit tests for PlayerStatsChart
- `components/game/HistoricalChart.tsx` - Existing chart component that may need updates for consistency
- `lib/utils/chartData.ts` - New utility functions for transforming markdown table data into Recharts-compatible format (to be created)
- `lib/utils/chartData.test.ts` - Unit tests for chart data utilities
- `lib/constants/colors.ts` - Existing color constants (Clemson orange/purple palette)
- `lib/markdown/getGameBySlug.ts` - May need updates to extract structured data from markdown tables
- `lib/markdown/tableParser.ts` - New utility for parsing markdown tables from content (to be created)

### Notes

- Unit tests should typically be placed alongside the code files they are testing (e.g., `MyComponent.tsx` and `MyComponent.test.tsx` in the same directory).
- Use `npx jest [optional/path/to/test/file]` to run tests. Running without a path executes all tests found by the Jest configuration.

## Tasks

- [ ] 1.0 Create Team Statistics Comparison Chart Component
  - [ ] 1.1 Create `TeamStatsChart.tsx` component with TypeScript interface
    - Define props: `data`, `title`, `height`, `showLegend`, `chartType`
    - Accept team statistics data (First Downs, Total Yards, Passing/Rushing Yards, Turnovers, Penalties, Time of Possession)
    - Use Recharts `BarChart` component with horizontal bars for side-by-side comparison
    - Apply Clemson orange (#F56600) for Clemson data, purple (#522D80) for opponent
    - Include custom tooltip showing precise values on hover
    - Use ResponsiveContainer for responsive sizing
    - Implement GSAP scroll reveal animation matching `HistoricalChart.tsx` pattern
  - [ ] 1.2 Style component with TailwindCSS
    - Add title in uppercase with consistent spacing
    - Use `prose` classes for typography where appropriate
    - Ensure proper spacing/padding for mobile, tablet, desktop
    - Apply `CLEMSON_COLORS` constants from `lib/constants/colors.ts`
  - [ ] 1.3 Create unit tests in `TeamStatsChart.test.tsx`
    - Test component renders without errors
    - Test data transformation and bar rendering
    - Test responsive behavior
    - Test tooltip display
    - Mock GSAP animations
  - [ ] 1.4 Create `TeamStatsChartLazy.tsx` for lazy loading
    - Use React `lazy()` and `Suspense` for code splitting
    - Add loading skeleton/spinner
    - Follow pattern from `HistoricalChartLazy.tsx`

- [ ] 2.0 Create Scoring Progression Chart Component
  - [ ] 2.1 Create `ScoringProgressionChart.tsx` component
    - Define props: `data`, `title`, `height`, `showGrid`, `showLegend`
    - Accept quarter-by-quarter scoring data (1st, 2nd, 3rd, 4th quarters)
    - Use Recharts `LineChart` or `AreaChart` showing cumulative score progression
    - Display both teams' scores on same chart (orange/purple color coding)
    - Include grid lines showing quarter boundaries
    - Add custom tooltip showing quarter and scores
    - Implement progressive drawing animation (like `HistoricalChart.tsx`)
  - [ ] 2.2 Style component with design system
    - Match visual aesthetic of existing `HistoricalChart`
    - Use consistent axis labels, legend, grid styling
    - Responsive design for all breakpoints
  - [ ] 2.3 Create unit tests in `ScoringProgressionChart.test.tsx`
    - Test rendering with sample scoring data
    - Test cumulative score calculation
    - Test chart type switching (line vs. area)
    - Test animation initialization
  - [ ] 2.4 Create lazy-loaded variant `ScoringProgressionChartLazy.tsx`

- [ ] 3.0 Create Player Statistics Chart Components
  - [ ] 3.1 Create `PassingStatsChart.tsx` for passing statistics
    - Use Recharts `RadarChart` or `BarChart` for multi-metric visualization
    - Display: Completions, Attempts, Yards, TDs, INTs, Rating
    - Support multiple players (Clemson QB vs Opponent QB comparison)
    - Apply orange/purple color scheme
    - Add custom tooltip with player name and stats
  - [ ] 3.2 Create `RushingStatsChart.tsx` for rushing statistics
    - Use `BarChart` for per-player comparison
    - Display: Attempts, Yards, Average, TDs, Long
    - Support multiple players (top 3 rushers per team)
    - Group bars by player with color-coded teams
  - [ ] 3.3 Create `ReceivingStatsChart.tsx` for receiving statistics
    - Similar to rushing, use `BarChart` for comparison
    - Display: Receptions, Yards, Average, TDs, Long
    - Top 3-4 receivers per team
  - [ ] 3.4 Create `DefenseStatsChart.tsx` for defensive statistics
    - Use `RadarChart` for multi-dimensional defense metrics
    - Display: Tackles, Sacks, TFL, INTs, Pass Deflections
    - Compare top defenders from each team
  - [ ] 3.5 Create unit tests for all player chart components
    - Test data rendering and transformations
    - Test multi-player support
    - Test responsive behavior
    - Test tooltip content
  - [ ] 3.6 Create lazy-loaded variants for all player charts

- [ ] 4.0 Build Chart Data Transformation Utilities
  - [ ] 4.1 Create `lib/markdown/tableParser.ts`
    - Function `parseMarkdownTable(content: string, tableTitle: string): any[]`
    - Extract tables from markdown content by searching for headers
    - Parse table rows into structured objects
    - Handle edge cases (missing data, malformed tables)
    - Return array of row objects with column keys
  - [ ] 4.2 Create `lib/utils/chartData.ts` with transformation functions
    - `transformTeamStats(tableData: any[]): TeamStatsData`
      - Convert Team Stats Comparison table into Recharts-compatible format
      - Structure: `[{ stat: 'First Downs', clemson: 32, opponent: 26 }, ...]`
    - `transformScoringData(tableData: any[]): ScoringProgressionData`
      - Convert Scoring Summary table into cumulative progression
      - Calculate running totals per quarter
      - Structure: `[{ quarter: '1st', clemson: 14, opponent: 14 }, ...]`
    - `transformPassingStats(tableData: any[], team: 'clemson' | 'opponent'): PassingData[]`
      - Parse passing statistics table for specific team
      - Extract player name and all stat columns
    - `transformRushingStats(tableData: any[], team: 'clemson' | 'opponent'): RushingData[]`
      - Parse rushing statistics table
    - `transformReceivingStats(tableData: any[], team: 'clemson' | 'opponent'): ReceivingData[]`
      - Parse receiving statistics table
    - `transformDefenseStats(tableData: any[], team: 'clemson' | 'opponent'): DefenseData[]`
      - Parse defense statistics table
  - [ ] 4.3 Create unit tests in `chartData.test.ts`
    - Test each transformation function with sample markdown content
    - Test edge cases (empty tables, missing columns, invalid data)
    - Test data type conversions (string to number)
    - Use fixture data from actual game markdown files
  - [ ] 4.4 Create unit tests in `tableParser.test.ts`
    - Test markdown table parsing with various table formats
    - Test extraction of specific tables by title
    - Test error handling for malformed tables

- [ ] 5.0 Integrate Charts into Single Game Page
  - [ ] 5.1 Update `lib/markdown/getGameBySlug.ts`
    - Add optional `parseTableData` parameter to function
    - When enabled, extract and parse all tables from content
    - Add parsed data to return object: `{ frontmatter, content, tableData }`
    - Keep backward compatibility (default to not parsing tables)
  - [ ] 5.2 Update `app/games/[slug]/page.tsx` to include chart sections
    - Import all new chart components (lazy-loaded versions)
    - Call `getGameBySlug` with `parseTableData: true`
    - Transform table data using `chartData.ts` utilities
    - Add chart sections after GameMetadata and before markdown content:
      1. **Scoring Progression** - Show quarter-by-quarter scoring chart
      2. **Team Statistics Comparison** - Show team stats bar chart
      3. **Passing Performance** - Show passing stats chart (if data available)
      4. **Rushing Leaders** - Show top rushers chart (if data available)
      5. **Receiving Leaders** - Show top receivers chart (if data available)
      6. **Defensive Standouts** - Show defensive stats chart (if data available)
    - Wrap each chart in a section with proper spacing and titles
    - Use conditional rendering (only show charts if data exists)
  - [ ] 5.3 Add chart toggle/collapsible sections (optional enhancement)
    - Allow users to expand/collapse individual chart sections
    - Save preference to localStorage
    - Use Shadcn UI `Collapsible` component

- [ ] 6.0 Ensure Responsive Design and Accessibility
  - [ ] 6.1 Test all charts on mobile (320px-768px)
    - Verify horizontal scrolling doesn't break layout
    - Test touch interactions on charts
    - Ensure tooltips work on mobile (tap to show)
    - Verify font sizes are readable on small screens
  - [ ] 6.2 Test on tablet (768px-1024px)
    - Verify 2-column chart layouts work properly
    - Test orientation changes (portrait/landscape)
  - [ ] 6.3 Test on desktop (1024px+)
    - Verify full-width charts render correctly
    - Test hover states and animations
  - [ ] 6.4 Accessibility audit
    - Add ARIA labels to all charts (`aria-label` on ResponsiveContainer)
    - Ensure keyboard navigation works for interactive elements
    - Test with screen reader (VoiceOver/NVDA)
    - Verify color contrast meets WCAG 2.1 AA (orange/purple on white)
    - Add `alt` text descriptions for chart visualizations
    - Ensure focus indicators are visible

- [ ] 7.0 Test and Validate All Visualizations
  - [ ] 7.1 Run all unit tests
    - Execute `npx jest` to run full test suite
    - Verify all new tests pass
    - Ensure code coverage is adequate (aim for 80%+ on chart components)
  - [ ] 7.2 Manual visual testing
    - Load multiple game pages (at least 3 different games)
    - Verify all charts render correctly with different data
    - Test animations and scroll reveals
    - Verify tooltips show accurate data
    - Test lazy loading behavior (check network tab for code splitting)
  - [ ] 7.3 Performance testing
    - Run Lighthouse audit on game detail pages
    - Verify performance score remains > 90
    - Check Core Web Vitals (LCP, FID, CLS)
    - Test page load time (should be < 2 seconds on 4G)
    - Verify bundle size hasn't increased significantly
  - [ ] 7.4 Cross-browser testing
    - Test on Chrome, Firefox, Safari, Edge
    - Verify Recharts renders consistently across browsers
    - Test GSAP animations work on all browsers
  - [ ] 7.5 Create visual regression tests (optional)
    - Use Playwright or Percy for screenshot comparisons
    - Capture baseline images of charts
    - Set up automated visual diff checks

## Implementation Notes

### How Markdown Parser Identifies Data for Charts

#### Current Parser Behavior (Before Recharts Integration)

The existing markdown parser (`lib/markdown/parser.ts`) performs these operations:

1. **Extracts YAML frontmatter** (game metadata like date, opponent, score)
2. **Converts markdown content to HTML** using `remark` and `remark-html`
3. **Returns**: `{ frontmatter, content, rawContent, slug, excerpt }`

**The Problem**: Statistics tables exist inside the `content` string as HTML markup (`<table><tr><td>...`), making them unusable for Recharts, which requires structured JavaScript objects.

#### Proposed Solution: Multi-Step Table Extraction

**Step 1: Leverage Raw Markdown Content**

The parser already returns `rawContent` (original markdown before HTML conversion). This is crucial because **markdown tables are significantly easier to parse than HTML tables**.

Example raw markdown table:
```markdown
### Scoring Summary

| Quarter | Clemson | Opponent |
|---------|---------|----------|
| 1st     | 14      | 14       |
| 2nd     | 21      | 7        |
| 3rd     | 10      | 7        |
| 4th     | 14      | 7        |
```

**Step 2: Create Heading-Based Table Parser** (`lib/markdown/tableParser.ts`)

The parser will use **section heading identification** to locate specific tables:

```typescript
function parseTableByHeading(rawContent: string, headingText: string): any[] {
  // 1. Find heading that matches the table title
  //    Search for: "### Scoring Summary" or "## Team Stats Comparison"

  // 2. Extract everything between that heading and the next heading
  //    This isolates the table markdown

  // 3. Parse the markdown table:
  //    - First row = column headers (e.g., "Quarter", "Clemson", "Opponent")
  //    - Subsequent rows = data values

  // 4. Convert to array of objects:
  //    [
  //      { quarter: "1st", clemson: 14, opponent: 14 },
  //      { quarter: "2nd", clemson: 21, opponent: 7 },
  //      ...
  //    ]

  return parsedData;
}
```

**Step 3: Map Table Headings to Chart Components**

The parser uses **standardized section headings** from markdown game files:

| Markdown Heading | Chart Component | Data Fields |
|-----------------|-----------------|-------------|
| `### Scoring Summary` | `ScoringProgressionChart` | Quarter, Clemson score, Opponent score |
| `### Team Stats Comparison` | `TeamStatsChart` | First Downs, Total Yards, Passing/Rushing Yards, Turnovers, Penalties, Time of Possession |
| `### Passing` (under **Clemson**) | `PassingStatsChart` | Player, Comp-Att, Yards, TD, INT, Rating |
| `### Rushing` (under **Clemson**) | `RushingStatsChart` | Player, Attempts, Yards, Avg, TD, Long |
| `### Receiving` (under **Clemson**) | `ReceivingStatsChart` | Player, Receptions, Yards, Avg, TD, Long |
| `### Defense` (under **Clemson**) | `DefenseStatsChart` | Player, Tackles, Sacks, TFL, INT, PD |

**Step 4: Transform Table Data to Recharts Format**

Transformation functions in `lib/utils/chartData.ts` convert parsed tables into Recharts-compatible shapes:

```typescript
// Example: Scoring Summary → ScoringProgressionChart
const scoringTable = [
  { quarter: "1st", clemson: "14", opponent: "14" },
  { quarter: "2nd", clemson: "21", opponent: "7" },
  { quarter: "3rd", clemson: "10", opponent: "7" },
  { quarter: "4th", clemson: "14", opponent: "7" }
];

function transformScoringData(table) {
  let clemsonTotal = 0;
  let opponentTotal = 0;

  return table.map(row => {
    clemsonTotal += parseInt(row.clemson);
    opponentTotal += parseInt(row.opponent);

    return {
      quarter: row.quarter,
      clemson: clemsonTotal,  // Cumulative scores
      opponent: opponentTotal // Cumulative scores
    };
  });
}

// Result for Recharts LineChart
[
  { quarter: "1st", clemson: 14, opponent: 14 },
  { quarter: "2nd", clemson: 35, opponent: 21 },
  { quarter: "3rd", clemson: 45, opponent: 28 },
  { quarter: "4th", clemson: 59, opponent: 35 }
]
```

#### Complete Data Flow Diagram

```
┌─────────────────────────────────────────┐
│ Markdown File (2024-09-21-nc-state.md) │
│  • YAML frontmatter (game metadata)     │
│  • Markdown content (tables, text)      │
└────────────────┬────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│  parseMarkdownFile() [parser.ts]        │
│  • Extracts frontmatter with gray-matter│
│  • Keeps rawContent (original markdown) │
│  • Converts to HTML for prose display   │
└────────────────┬────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│  getGameBySlug(slug, {                  │
│    parseTableData: true  ← NEW OPTION   │
│  }) [getGameBySlug.ts]                  │
└────────────────┬────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│  tableParser.ts [NEW FILE]              │
│  • parseTableByHeading("Scoring         │
│    Summary") → scoring table rows       │
│  • parseTableByHeading("Team Stats      │
│    Comparison") → team stats rows       │
│  • parseTableByHeading("Passing",       │
│    team: "clemson") → passing stats     │
│  • [Repeat for all table types]        │
└────────────────┬────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│  chartData.ts [NEW FILE]                │
│  Transformation functions:              │
│  • transformScoringData()               │
│  • transformTeamStats()                 │
│  • transformPassingStats()              │
│  • transformRushingStats()              │
│  • transformReceivingStats()            │
│  • transformDefenseStats()              │
└────────────────┬────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│  app/games/[slug]/page.tsx              │
│  • Receives { frontmatter, content,     │
│    tableData }                          │
│  • Applies transformations              │
│  • Passes structured data to charts     │
└────────────────┬────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│  Chart Components (Recharts)            │
│  • <ScoringProgressionChart             │
│    data={scoringData} />                │
│  • <TeamStatsChart                      │
│    data={teamStatsData} />              │
│  • [All other chart components]         │
└─────────────────────────────────────────┘
```

#### Example Implementation in Game Page

```typescript
// In app/games/[slug]/page.tsx
import { transformScoringData, transformTeamStats } from '@/lib/utils/chartData';

export default async function GameDetailPage({ params }) {
  const { slug } = await params;

  // Fetch game with table parsing enabled
  const game = await getGameBySlug(slug, {
    validate: true,
    parseTableData: true  // ← NEW OPTION
  });

  // game now includes structured table data:
  // {
  //   frontmatter: { game_date, opponent, score, ... },
  //   content: "<html>...</html>",
  //   rawContent: "# Game Overview...",
  //   tableData: {
  //     scoring: [...],
  //     teamStats: [...],
  //     passingClemson: [...],
  //     passingOpponent: [...],
  //     rushingClemson: [...],
  //     rushingOpponent: [...],
  //     receivingClemson: [...],
  //     receivingOpponent: [...],
  //     defenseClemson: [...],
  //     defenseOpponent: [...]
  //   }
  // }

  // Transform data for Recharts
  const scoringChartData = game.tableData?.scoring
    ? transformScoringData(game.tableData.scoring)
    : null;

  const teamStatsChartData = game.tableData?.teamStats
    ? transformTeamStats(game.tableData.teamStats)
    : null;

  return (
    <div>
      {/* Existing header/metadata components */}

      {/* NEW: Chart sections */}
      {scoringChartData && (
        <ScoringProgressionChart data={scoringChartData} />
      )}

      {teamStatsChartData && (
        <TeamStatsChart data={teamStatsChartData} />
      )}

      {/* Existing markdown content */}
    </div>
  );
}
```

#### Key Design Decisions

**1. Heading-Based Identification (Most Reliable)**

The parser locates tables by searching for markdown headings because:
- ✅ Headings are consistent across all game files (enforced by template)
- ✅ Easy to identify with regex: `/###\s+Scoring Summary/`
- ✅ Resilient to minor table format changes
- ✅ Works even if table column order changes

**2. Fallback Strategy for Missing Tables**

If a table isn't found under an expected heading:
- Parser returns `null` or empty array for that table type
- Chart component checks data existence: `if (!data || data.length === 0) return null;`
- No chart is rendered (graceful degradation)
- Page continues to function normally with other available data

**3. Team-Specific Parsing for Player Statistics**

Player stats tables (Passing, Rushing, Receiving, Defense) appear twice per game:
- Once under `**Clemson**` subheading
- Once under `**Opponent**` subheading

Parser handles this by:
```markdown
### Passing

**Clemson**
| Player | Comp-Att | Yards | TD | INT | Rating |
| ...    | ...      | ...   | .. | ... | ...    |

**Opponent**
| Player | Comp-Att | Yards | TD | INT | Rating |
| ...    | ...      | ...   | .. | ... | ...    |
```

The parser function accepts a `team` parameter:
```typescript
parseTableByHeading(content, "Passing", { team: "clemson" })
parseTableByHeading(content, "Passing", { team: "opponent" })
```

**4. Data Type Conversions**

Transformation utilities handle common conversions:
- **String → Number**: `"14"` → `14`
- **Compound values**: `"28-38"` → `{ completions: 28, attempts: 38 }`
- **Time format**: `"32:18"` → `32.3` (minutes as decimal for charts)
- **Penalties format**: `"6-48"` → `{ count: 6, yards: 48 }`

**5. Build-Time Parsing (SSG Performance)**

Since this is a Next.js SSG site:
- All table parsing happens at **build time**, not runtime
- No performance impact on page load
- Parsed data is serialized into the static HTML payload
- Charts render immediately on page load with pre-processed data

### Data Flow Summary

1. Markdown file → `getGameBySlug()` → Frontmatter + Content + Raw Content
2. Raw Content → `tableParser.ts` → Extracted table data (arrays of objects)
3. Table data → `chartData.ts` transformations → Recharts-compatible format
4. Chart components → Render visualizations on game page

### Design Consistency
- All charts should follow the existing `HistoricalChart.tsx` pattern
- Use `CLEMSON_COLORS` constants for orange/purple
- Apply GSAP `fadeInUp` animations consistently
- Match typography hierarchy from PRD (uppercase titles, consistent spacing)
- Use `ResponsiveContainer` for all Recharts components

### Testing Strategy
- Unit tests for data transformations (critical for accuracy)
- Unit tests for component rendering (verify props and data flow)
- Manual testing for visual design and interactions
- Performance testing to ensure charts don't slow down page load
- Accessibility testing for WCAG 2.1 AA compliance

### Performance Considerations
- Use lazy loading for all chart components (code splitting)
- Consider virtualizing long lists of players (if > 10 players)
- Optimize GSAP animations (use `will-change` sparingly)
- Ensure Recharts doesn't re-render unnecessarily (memoization)
- Test bundle size impact (Recharts is already installed, minimal increase expected)

## Success Criteria

✅ **Functional Requirements Met**
- All game statistics tables are visualized with appropriate chart types
- Charts are interactive with hover tooltips showing precise values
- All charts follow Clemson color scheme (orange/purple)
- Data transformations are accurate and tested

✅ **Design Requirements Met**
- Visual design matches existing `HistoricalChart` aesthetic
- Responsive design works on mobile, tablet, desktop (320px-2560px)
- GSAP animations are smooth and performant
- Typography hierarchy follows PRD specifications

✅ **Performance Requirements Met**
- Page load time remains under 2 seconds
- Lighthouse performance score remains > 90
- Core Web Vitals within acceptable ranges
- Code splitting implemented for chart components

✅ **Quality Requirements Met**
- All unit tests pass with adequate coverage (80%+)
- No console errors or warnings
- Accessibility audit passes (WCAG 2.1 AA)
- Cross-browser compatibility verified

## Timeline Estimate

- **Task 1.0**: 4-6 hours
- **Task 2.0**: 3-4 hours
- **Task 3.0**: 8-10 hours (multiple chart types)
- **Task 4.0**: 6-8 hours (data parsing and transformations)
- **Task 5.0**: 3-4 hours (integration)
- **Task 6.0**: 3-4 hours (responsive/accessibility)
- **Task 7.0**: 4-5 hours (testing and validation)

**Total Estimated Time**: 31-41 hours (approximately 4-5 days of full-time work)

## Dependencies

- Recharts: `^3.4.1` (already installed ✓)
- GSAP: (already installed ✓)
- TailwindCSS: (already configured ✓)
- Jest: (already configured ✓)
- React Testing Library: (likely installed for component tests)

## Future Enhancements (Post-Implementation)

- Add "Download Chart as PNG" button for each visualization
- Implement chart comparison across multiple games
- Add animated transitions when switching between chart types
- Create dashboard view showing aggregate statistics across season
- Add dark mode support for charts
- Implement chart customization options (user preferences)
