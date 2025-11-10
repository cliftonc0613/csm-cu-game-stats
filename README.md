# Clemson Sports Statistics Website

A high-performance, data-rich statistics platform for **[Clemson Sports Media](https://clemsonsportsmedia.com/)** showcasing Clemson Tigers athletics data, game performance, and historical records.

## Project Overview

### Problem Statement
Current sports statistics displays are slow, visually unappealing, and fail to provide an engaging user experience for Clemson fans and media professionals seeking game data and analysis.

### Solution
A lightweight, high-performance Clemson Sports statistics website that automatically generates beautiful, data-rich pages from Markdown files. The platform displays Clemson football game statistics and evaluations with a clean, modern interface inspired by professional sports data visualization, making complex statistics accessible and visually engaging for the Clemson community.

### Goal
Create a fast-loading, visually stunning statistics platform that serves both Clemson sports fans and media professionals covering Clemson athletics, delivering comprehensive game data through an intuitive interface while maintaining performance excellence across all devices.

## Key Features

### 🎯 Core Functionality
- **Markdown-to-Page Generation**: Automatically generates statistics pages from structured Markdown files
- **Template Enforcement**: Strict validation ensures all statistics pages maintain consistency
- **Dual Content Types**: Supports both game statistics and game evaluations
- **Performance Optimized**: Sub-2-second load times with Lighthouse scores above 90

### 🎨 Visual Design
- **Flat Design Aesthetic**: Clean, modern interface with no gradients
- **Clemson Brand Colors**:
  - Primary Orange: `#F56600`
  - Primary Purple: `#522D80`
  - White: `#FFFFFF`
  - Dark Gray: `#333333`
- **Professional Components**:
  - Score comparison bars with team logos
  - Stat card grids with alternating orange/purple backgrounds
  - Interactive data visualizations (line charts, bar charts, area charts)
  - Large display typography for hero statistics

### 🔍 Navigation & Discovery
- **List View**: Browse all available game statistics and evaluations
- **Advanced Filtering**: By date/season, opponent, game type, content type
- **Search Functionality**: Find games by opponent, date, or keywords
- **Responsive Design**: Optimized for mobile, tablet, and desktop viewports

### 📊 Interactive Features
- **Sortable Tables**: Interactive statistical data tables
- **Data Visualizations**: Hover states showing precise values
- **Export Options**: CSV export of tabular data
- **Smooth Animations**: GSAP-powered scroll reveals and transitions

## Technology Stack

- **Framework**: Next.js 14+ (App Router, Static Site Generation)
- **Styling**: TailwindCSS with custom design tokens
- **Components**: Shadcn UI (customized for Clemson branding)
- **Animations**: GSAP (GreenSock Animation Platform)
- **Data Parsing**: Gray-matter (frontmatter), Remark/Rehype (content processing)
- **Charts**: Recharts with custom Clemson styling
- **Deployment**: Netlify (automatic deployments from Git)

## Quick Start

### Prerequisites
- Node.js 18+ and npm/yarn
- Git
- [Claude Code](https://claude.com/claude-code) (optional, for AI-assisted development)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/cliftonc0613/csm-cu-game-stats.git
   cd csm-cu-game-stats
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Run development server:**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Content Management

### Adding New Game Statistics

1. **Create a new Markdown file** in the designated statistics directory
2. **Follow the template structure** (first file establishes the template)
3. **Include required frontmatter:**
   ```yaml
   ---
   game_date: "2024-09-07"
   opponent: "Florida State"
   score_clemson: 17
   score_opponent: 21
   season: "2024-2025"
   game_type: "regular"
   content_type: "statistics"
   ---
   ```
4. **Commit and push** to trigger automatic deployment via Netlify

### Content Types
- **Game Statistics**: Raw statistical data from games
- **Game Evaluations**: Expert analysis and performance reviews

## Performance Targets

### Core Web Vitals
- **LCP** (Largest Contentful Paint): < 2.5s
- **FID** (First Input Delay): < 100ms
- **CLS** (Cumulative Layout Shift): < 0.1

### Benchmarks
- Page load time: **< 2 seconds** (4G connection)
- Lighthouse performance score: **> 90**
- Zero console errors across all pages
- Mobile responsiveness: 320px-2560px viewports

## Project Structure

```
.claude/
├── agents/          # AI agents for specialized tasks
└── commands/        # Custom slash commands for workflows
    └── sports-data-analysis.md  # Extract sports data from images
    └── game-recap.md            # Generate game recap articles
    └── proofread.md             # Content proofreading

context/
├── design-principles.md         # Design system and standards
└── ...

web_articles/
└── templates/
    ├── football-game-stats-template.md       # Statistics template
    └── football-game-evaluation-template.md  # Evaluation template

tasks/
└── 0001-prd-statistics-website.md  # Product Requirements Document

CLAUDE.md           # Project-specific AI instructions
```

## Development Workflow

### Using Claude Code
This project is optimized for AI-assisted development with Claude Code:

```bash
# Extract statistics from game images
/sports-data-analysis

# Generate game recap articles
/game-recap

# Proofread content
/proofread
```

### Manual Development
Standard Next.js workflow:
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## User Stories

### For Sports Fans
- Quickly browse recent game statistics and stay updated on team performance
- View historical head-to-head results and rivalry dynamics
- Access large, prominent statistics for quick insights
- Navigate seamlessly on mobile devices

### For Media Professionals
- Search for specific games or players for research
- Filter statistics by date, team, or season for data-driven stories
- Export statistics data for reports and articles
- Access both raw statistics and expert evaluations

## Success Metrics

### Performance
- Page load time: < 2 seconds
- Lighthouse score: > 90
- Core Web Vitals compliance

### Engagement
- Time on site: +25% increase
- Pages per session: 3+ average
- Return visitor rate: 40%+ within 30 days
- Bounce rate: < 30%

### Content
- Initial content: 12 football games (current season)
- Growth: 12+ games per season
- Content types: Statistics + Evaluations

## Roadmap

### v1.0 (Current)
✅ Markdown parsing and page generation
✅ Template structure enforcement
✅ Score comparison components
✅ Stat card grid layouts
✅ Filtering and search
✅ Responsive design
✅ Performance optimization

### Future Enhancements
⏳ Admin CMS interface for non-Git uploads
⏳ SEO optimization (meta tags, structured data, sitemap)
⏳ Analytics integration
⏳ Authentication and access control
⏳ PDF export with preserved design
⏳ Side-by-side game comparisons
⏳ Live/real-time stat updates
⏳ Multi-sport support (basketball, baseball)

## Contributing

This project is maintained by Clemson Sports Media. For contributions or issues, please contact the development team.

## Documentation

- **PRD**: [tasks/0001-prd-statistics-website.md](tasks/0001-prd-statistics-website.md)
- **Design Principles**: [context/design-principles.md](context/design-principles.md)
- **Templates**: [web_articles/templates/](web_articles/templates/)
- **Claude Instructions**: [CLAUDE.md](CLAUDE.md)

## License

All rights reserved - Clemson Sports Media

---

**Built for Clemson Sports Media Athletics** | [clemsonsportsmedia.com](https://clemsonsportsmedia.com/)
