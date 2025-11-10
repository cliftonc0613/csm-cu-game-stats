# Task List: Clemson Sports Statistics Website

**Based on**: [0001-prd-statistics-website.md](./0001-prd-statistics-website.md)

**Current State Assessment**:
- This is a greenfield project with no existing Next.js application
- Repository contains documentation and Claude Code configuration only
- Will build from scratch using Next.js 14+ App Router, TailwindCSS, Shadcn UI, and GSAP
- Design references provided show score comparison bars, historical charts, and stat card grids
- Color palette: #F56600 (orange), #522D80 (purple), #FFFFFF (white), #333333 (dark gray)

---

## Relevant Files

**Initial setup and configuration:**
- `package.json` - Project dependencies and scripts (created in Task 1.1, updated in 1.2, 1.4, 1.6)
- `next.config.ts` - Next.js configuration for SSG optimization (created in Task 1.1)
- `tailwind.config.ts` - Custom Clemson color palette and design tokens (will be created)
- `tsconfig.json` - TypeScript configuration with strict mode and additional strict options (created in Task 1.1, enhanced in Task 1.5)
- `eslint.config.mjs` - ESLint configuration with Next.js best practices (created in Task 1.1)
- `.prettierrc` - Prettier configuration for code formatting (created in Task 1.6)
- `.prettierignore` - Prettier ignore patterns (created in Task 1.6)
- `postcss.config.mjs` - PostCSS configuration for TailwindCSS (created in Task 1.1)

**Application structure:**
- `app/layout.tsx` - Root layout with brand colors and typography (created in Task 1.1)
- `app/page.tsx` - Homepage with game list and filters (created in Task 1.1)
- `app/globals.css` - Global styles with Shadcn CSS variables (updated in Task 1.3)
- `app/favicon.ico` - Site favicon (created in Task 1.1)
- `app/games/[slug]/page.tsx` - Dynamic game detail page (SSG)
- `components/ui/*` - Shadcn UI components (Button, Card, Table, etc.)
- `lib/utils.ts` - Class name utility function using clsx and tailwind-merge (created in Task 1.3)
- `components.json` - Shadcn UI configuration (created in Task 1.3)

**Markdown parsing and validation:**
- `lib/markdown/parser.ts` - Markdown file parsing with gray-matter
- `lib/markdown/validator.ts` - Zod schema validation for frontmatter
- `lib/markdown/template.ts` - Template structure enforcement logic
- `lib/markdown/types.ts` - TypeScript types for game data

**Visual components (based on reference images):**
- `components/game/ScoreComparisonBar.tsx` - Horizontal score bar with team logos
- `components/game/StatCard.tsx` - Individual stat card with orange/purple backgrounds
- `components/game/StatCardGrid.tsx` - Grid layout for multiple stat cards
- `components/game/HistoricalChart.tsx` - Line/area charts with Recharts
- `components/game/GameTable.tsx` - Sortable statistics tables

**Layout and navigation:**
- `components/layout/Header.tsx` - Site header with navigation
- `components/layout/Footer.tsx` - Site footer
- `components/layout/Breadcrumbs.tsx` - Breadcrumb navigation
- `components/search/SearchBar.tsx` - Game search functionality
- `components/filters/FilterPanel.tsx` - Season/opponent/type filters

**Utilities and helpers:**
- `lib/utils/cn.ts` - Class name utility (from Shadcn)
- `lib/utils/colors.ts` - Color utility functions
- `lib/utils/animations.ts` - GSAP animation helpers
- `lib/constants/colors.ts` - Clemson brand color constants

**Data and content:**
- `content/games/` - Directory for game statistics markdown files (created in Task 1.7)
- `content/evaluations/` - Directory for game evaluation markdown files (created in Task 1.7)
- `content/templates/` - Directory for template reference files (created in Task 1.7)
- `content/games/*.md` - Markdown files for game statistics (will be created)
- `content/evaluations/*.md` - Markdown files for game evaluations (will be created)
- `content/templates/game-stats-template.md` - Template structure reference (will be created)
- `public/images/logos/*.svg` - Team logos (Clemson and opponents) (will be created)

**Export functionality:**
- `lib/export/csv.ts` - CSV export logic
- `lib/export/pdf.ts` - PDF export logic (future enhancement)
- `app/api/export/route.ts` - API route for data export

**Testing:**
- `lib/markdown/parser.test.ts` - Markdown parser tests
- `lib/markdown/validator.test.ts` - Schema validation tests
- `components/game/StatCard.test.tsx` - Component tests
- `jest.config.js` - Jest configuration
- `jest.setup.js` - Jest setup file

**Performance and optimization:**
- `next-sitemap.config.js` - Sitemap generation (optional)
- `lib/utils/performance.ts` - Performance monitoring utilities

### Notes

- Unit tests should be placed alongside the code files they are testing
- Use `npm run test` or `npx jest [optional/path/to/test/file]` to run tests
- Next.js App Router uses `app/` directory for routing
- Static generation happens at build time for all game pages

---

## Tasks

- [ ] 1.0 **Project Initialization and Setup**
  - [x] 1.1 Initialize Next.js 14+ project with TypeScript using `npx create-next-app@latest` with App Router enabled
  - [x] 1.2 Install core dependencies: `tailwindcss`, `postcss`, `autoprefixer`, `gsap`, `gray-matter`, `remark`, `remark-html`, `recharts`
  - [x] 1.3 Install Shadcn UI CLI and initialize: `npx shadcn-ui@latest init`
  - [x] 1.4 Install development dependencies: `@types/node`, `@types/react`, `eslint`, `prettier`, `jest`, `@testing-library/react`, `@testing-library/jest-dom`
  - [x] 1.5 Configure TypeScript with strict mode in `tsconfig.json`
  - [x] 1.6 Set up ESLint and Prettier configurations for code quality
  - [x] 1.7 Create project directory structure: `app/`, `components/`, `lib/`, `content/`, `public/`
  - [x] 1.8 Initialize Git repository and create `.gitignore` for Next.js (if not already done)
  - [ ] 1.9 Install Zod for schema validation: `npm install zod`
  - [ ] 1.10 Verify development server runs successfully: `npm run dev`

- [ ] 2.0 **Design System and Component Library Foundation**
  - [ ] 2.1 Configure Tailwind with Clemson brand colors in `tailwind.config.ts`:
    - Add custom colors: `clemson-orange: '#F56600'`, `clemson-purple: '#522D80'`, `clemson-dark: '#333333'`
    - Configure responsive breakpoints to match PRD specs
  - [ ] 2.2 Create `lib/constants/colors.ts` with brand color constants and utility functions
  - [ ] 2.3 Set up global typography system in `app/globals.css`:
    - Configure sans-serif font stack
    - Define display number styles (80-120px, ultra-bold)
    - Create ordinal superscript styles
    - Set base font sizes (14-16px body, 12-14px metadata)
  - [ ] 2.4 Install base Shadcn UI components: `npx shadcn-ui@latest add button card table input`
  - [ ] 2.5 Customize Shadcn component themes to use Clemson colors in `components/ui/` files
  - [ ] 2.6 Create utility class helpers in `lib/utils/cn.ts` for conditional class names
  - [ ] 2.7 Set up CSS custom properties for consistent spacing and shadows
  - [ ] 2.8 Create `components/ui/Container.tsx` for max-width content wrapper
  - [ ] 2.9 Test responsive design at all breakpoints (320px-2560px)

- [ ] 3.0 **Markdown Parsing Engine and Content Infrastructure**
  - [ ] 3.1 Create TypeScript types in `lib/markdown/types.ts`:
    - `GameStatsFrontmatter` interface (game_date, opponent, scores, season, game_type, content_type)
    - `GameEvaluationFrontmatter` interface
    - `ParsedGame` type with frontmatter and content
  - [ ] 3.2 Build Markdown parser in `lib/markdown/parser.ts`:
    - Use `gray-matter` to extract frontmatter
    - Use `remark` and `remark-html` to process content
    - Return typed `ParsedGame` objects
  - [ ] 3.3 Create Zod validation schemas in `lib/markdown/validator.ts`:
    - Schema for game statistics frontmatter
    - Schema for game evaluations frontmatter
    - Validation error handling with clear messages
  - [ ] 3.4 Build template enforcement logic in `lib/markdown/template.ts`:
    - Load first Markdown file as template
    - Compare subsequent files against template structure
    - Generate validation errors for mismatches
  - [ ] 3.5 Create content directories: `content/games/`, `content/evaluations/`, `content/templates/`
  - [ ] 3.6 Create initial template file `content/templates/game-stats-template.md` with example frontmatter and structure
  - [ ] 3.7 Add sample game Markdown files for testing (2-3 games)
  - [ ] 3.8 Create helper function to get all games: `lib/markdown/getAllGames.ts`
  - [ ] 3.9 Create helper function to get game by slug: `lib/markdown/getGameBySlug.ts`
  - [ ] 3.10 Write unit tests for parser, validator, and template enforcement

- [ ] 4.0 **Core Visual Components (Score Bar, Stat Cards, Charts)**
  - [ ] 4.1 Create `components/game/ScoreComparisonBar.tsx`:
    - Team logos in circular containers on left/right edges
    - Win-loss records displayed prominently
    - Horizontal progress bar showing score distribution (orange vs purple sections)
    - Calculate percentage widths based on scores
    - Current win streak text centered below bar
    - "Full Games List Page" CTA button
    - Fully responsive design
  - [ ] 4.2 Create `components/game/StatCard.tsx`:
    - Support alternating orange/purple backgrounds via props
    - Large display number (80-120px) with ultra-bold weight
    - Ordinal suffix in superscript matching number font
    - Small descriptor text (uppercase) above number
    - Secondary descriptor text below (e.g., "of 134")
    - White text on colored backgrounds
    - Consistent padding using Tailwind
  - [ ] 4.3 Create `components/game/StatCardGrid.tsx`:
    - Responsive grid layout: 1 col (mobile), 2 cols (tablet), 3-4 cols (desktop)
    - Accept array of stat objects as props
    - Automatically alternate orange/purple backgrounds
    - Map stat data to StatCard components
  - [ ] 4.4 Create `components/game/HistoricalChart.tsx`:
    - Install and configure Recharts
    - Line/area chart with dual-color overlays (orange for Clemson, purple for opponent)
    - Semi-transparent area fills for overlap visibility
    - Subtle grid lines for readability
    - Clear axis labels with years
    - Chart title in uppercase with consistent spacing
    - Responsive sizing
    - Hover tooltips showing precise values
  - [ ] 4.5 Create `components/game/GameTable.tsx`:
    - Use Shadcn Table component as base
    - Accept table data as props (columns and rows)
    - Implement sortable columns with sort indicators
    - Clemson brand styling (borders, text colors)
    - Responsive horizontal scroll on mobile
  - [ ] 4.6 Add team logo assets to `public/images/logos/` (Clemson paw, opponent logos)
  - [ ] 4.7 Create `components/ui/TeamLogo.tsx` component for consistent logo rendering
  - [ ] 4.8 Test all components in isolation with sample data
  - [ ] 4.9 Write component tests for StatCard, StatCardGrid, and ScoreComparisonBar

- [ ] 5.0 **Game List, Navigation, and Search Features**
  - [ ] 5.1 Create `components/layout/Header.tsx`:
    - Clemson Sports branding/logo
    - Navigation links (Home, Games, About)
    - Responsive mobile menu (hamburger)
    - Link to Clemson Sports Media (https://clemsonsportsmedia.com/)
  - [ ] 5.2 Create `components/layout/Footer.tsx`:
    - Copyright information
    - Links to Clemson Sports Media
    - Social media links (if applicable)
  - [ ] 5.3 Create `components/layout/Breadcrumbs.tsx`:
    - Accept path array as props
    - Render navigable breadcrumb trail
    - Clemson color scheme for active/inactive states
  - [ ] 5.4 Create `components/search/SearchBar.tsx`:
    - Input field with search icon
    - Client-side search functionality (filter games by opponent, date, keywords)
    - Debounced search input for performance
    - Display search results dynamically
  - [ ] 5.5 Create `components/filters/FilterPanel.tsx`:
    - Filter by season/year (dropdown or buttons)
    - Filter by opponent (multi-select)
    - Filter by game type (regular season, bowl)
    - Filter by content type (statistics vs evaluation)
    - "Clear Filters" button
    - Apply filters to game list dynamically
  - [ ] 5.6 Create `components/game/GameListItem.tsx`:
    - Card layout showing game preview
    - Opponent name and logos
    - Game date and score
    - Link to full game detail page
    - Clemson brand styling
  - [ ] 5.7 Build homepage `app/page.tsx`:
    - Render Header and Footer
    - Display SearchBar and FilterPanel
    - Fetch all games using `getAllGames()`
    - Map games to GameListItem components
    - Implement search and filter logic
    - Show empty state when no games match filters
  - [ ] 5.8 Add loading states and error boundaries
  - [ ] 5.9 Test navigation flow and filter interactions

- [ ] 6.0 **Game Detail Pages with SSG**
  - [ ] 6.1 Create dynamic route `app/games/[slug]/page.tsx`:
    - Implement `generateStaticParams()` to pre-render all game pages at build time
    - Fetch game data using `getGameBySlug(slug)`
    - Handle 404 for invalid slugs with Next.js `notFound()`
  - [ ] 6.2 Design game detail page layout:
    - Breadcrumbs at top
    - ScoreComparisonBar component
    - Game metadata (date, location, attendance)
    - StatCardGrid for key statistics
    - HistoricalChart if head-to-head data available
    - GameTable for detailed player/team statistics
    - Markdown content rendered as HTML (evaluations/notes)
  - [ ] 6.3 Create `components/game/GameDetailHeader.tsx`:
    - Opponent name and logos
    - Game date, time, location
    - Final score prominently displayed
  - [ ] 6.4 Create `components/game/GameMetadata.tsx`:
    - Display attendance, weather, etc. (if available in Markdown)
    - Styled as metadata cards or list
  - [ ] 6.5 Implement Markdown content rendering with proper HTML sanitization
  - [ ] 6.6 Add SEO metadata using Next.js `metadata` API:
    - Dynamic page titles: "Clemson vs [Opponent] - [Date]"
    - Meta descriptions with game summary
    - Open Graph tags for social sharing (optional for v1)
  - [ ] 6.7 Configure Next.js for optimal SSG in `next.config.js`:
    - Enable image optimization
    - Configure output: 'export' if deploying as static site
  - [ ] 6.8 Test SSG build process: `npm run build` and verify all pages generated
  - [ ] 6.9 Test game detail pages with various data scenarios (wins, losses, different stat sets)

- [ ] 7.0 **Interactive Features (Sorting, Filtering, Exports)**
  - [ ] 7.1 Implement table sorting in `GameTable.tsx`:
    - Add click handlers to column headers
    - Toggle sort direction (ascending/descending)
    - Visual indicators (arrows) for sort state
    - Sort data array based on selected column
  - [ ] 7.2 Create `lib/export/csv.ts`:
    - Function to convert game statistics data to CSV format
    - Handle nested data structures (flatten for CSV)
    - Include headers and proper escaping
  - [ ] 7.3 Create API route `app/api/export/route.ts`:
    - Accept game slug and export format as query params
    - Fetch game data
    - Generate CSV using export utility
    - Return file download response with proper headers
  - [ ] 7.4 Add "Export CSV" button to game detail pages:
    - Trigger download via API route
    - Show loading state during export
    - Handle errors gracefully
  - [ ] 7.5 Create `components/game/ComparisonSelector.tsx` (optional for v1):
    - Checkboxes to select multiple games
    - "Compare Selected Games" button
    - Store selections in local state or URL params
  - [ ] 7.6 Create comparison view `app/compare/page.tsx` (optional for v1):
    - Display 2-4 games side-by-side
    - Highlight statistical differences
    - Use existing components (StatCardGrid, GameTable)
  - [ ] 7.7 Test all interactive features across devices
  - [ ] 7.8 Add keyboard navigation support for accessibility
  - [ ] 7.9 Validate WCAG 2.1 AA compliance for interactive elements

- [ ] 8.0 **Animations, Performance Optimization, and Testing**
  - [ ] 8.1 Install and configure GSAP: `npm install gsap`
  - [ ] 8.2 Create `lib/utils/animations.ts` with reusable GSAP animation functions:
    - `fadeInUp()` for scroll reveals
    - `scaleOnHover()` for card hover effects
    - `fadeTransition()` for page transitions
    - `progressiveChartDraw()` for chart animations
  - [ ] 8.3 Implement scroll reveal animations:
    - Add `useGSAP()` hook to components
    - Trigger fade-in and slide-up on scroll (0.3-0.5s duration)
    - Use `will-change` and GPU-accelerated properties
  - [ ] 8.4 Add hover effects to StatCard components:
    - Smooth scale transform (1.02-1.05) on hover
    - Transition duration: 0.2s
  - [ ] 8.5 Implement page transition animations between routes
  - [ ] 8.6 Add progressive chart drawing/filling animations on load
  - [ ] 8.7 Performance optimization:
    - Enable Next.js image optimization for team logos
    - Implement code splitting for heavy components (charts)
    - Add lazy loading for below-the-fold content
    - Optimize CSS (remove unused Tailwind classes with purge)
  - [ ] 8.8 Run Lighthouse audit:
    - Target: Performance score > 90
    - Target: Page load < 2 seconds
    - Measure Core Web Vitals (LCP < 2.5s, FID < 100ms, CLS < 0.1)
    - Fix any issues identified
  - [ ] 8.9 Set up Jest testing environment:
    - Configure `jest.config.js` for Next.js
    - Create `jest.setup.js` with testing library setup
  - [ ] 8.10 Write comprehensive unit tests:
    - Markdown parser and validator tests
    - Component tests (StatCard, ScoreComparisonBar, etc.)
    - Utility function tests
    - Target: >80% code coverage
  - [ ] 8.11 Run full test suite: `npm run test`
  - [ ] 8.12 Test across browsers (Chrome, Firefox, Safari, Edge)
  - [ ] 8.13 Test responsive design on real devices (iOS, Android)

- [ ] 9.0 **Deployment Configuration and Documentation**
  - [ ] 9.1 Create Netlify configuration file `netlify.toml`:
    - Set build command: `npm run build`
    - Set publish directory: `out/` (if using static export) or `.next/`
    - Configure redirects and headers if needed
  - [ ] 9.2 Set up environment variables for Netlify (if any)
  - [ ] 9.3 Test local build: `npm run build && npm run start`
  - [ ] 9.4 Deploy to Netlify:
    - Connect GitHub repository to Netlify
    - Configure automatic deployments on push to main branch
    - Set up deploy previews for pull requests
  - [ ] 9.5 Update `README.md` with comprehensive documentation:
    - Project overview and purpose
    - Technology stack
    - Installation instructions
    - Development workflow (`npm run dev`, `npm run build`, `npm run test`)
    - How to add new game statistics (Markdown file format)
    - Deployment process
    - Contributing guidelines
  - [ ] 9.6 Create `CONTRIBUTING.md` if open to external contributions
  - [ ] 9.7 Document Markdown template structure in `content/templates/README.md`
  - [ ] 9.8 Create content authoring guide for adding new games
  - [ ] 9.9 Set up sitemap generation with `next-sitemap` (optional):
    - Install: `npm install next-sitemap`
    - Configure `next-sitemap.config.js`
    - Add to build process
  - [ ] 9.10 Verify production deployment:
    - Test all pages load correctly
    - Verify images and assets are optimized
    - Check console for errors
    - Run Lighthouse audit on production URL
  - [ ] 9.11 Set up monitoring/analytics if required (optional for v1)
  - [ ] 9.12 Create internal documentation for Clemson Sports Media team

---

## Status

**Phase**: 2 - Sub-tasks generated
**Total Tasks**: 9 parent tasks, 112 sub-tasks
**Ready for**: Implementation

---

## Implementation Notes

**Recommended Approach**:
1. Complete tasks sequentially by parent task number (1.0 → 2.0 → 3.0, etc.)
2. Within each parent task, complete sub-tasks in order
3. Test each component/feature before moving to the next
4. Commit code frequently with descriptive messages

**Critical Path**:
- Tasks 1.0-3.0 are foundational and must be completed first
- Tasks 4.0-6.0 build the core functionality
- Tasks 7.0-8.0 add polish and optimization
- Task 9.0 handles deployment

**Estimated Timeline** (for a junior developer):
- Tasks 1.0-2.0: 1-2 days
- Task 3.0: 2-3 days
- Task 4.0: 3-4 days
- Tasks 5.0-6.0: 3-4 days
- Task 7.0: 2-3 days
- Task 8.0: 2-3 days
- Task 9.0: 1 day
- **Total**: ~3-4 weeks for v1

**Next Steps**:
1. Start with Task 1.1: Initialize Next.js project
2. Follow the sub-tasks in order
3. Use the PRD as reference for design specifications
4. Refer to the reference images for exact visual implementation
