# Contributing to Clemson Sports Statistics Website

Thank you for your interest in contributing to the Clemson Sports Statistics Website! This document provides guidelines and instructions for contributing to this project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Process](#development-process)
- [Contribution Workflow](#contribution-workflow)
- [Coding Standards](#coding-standards)
- [Commit Message Guidelines](#commit-message-guidelines)
- [Pull Request Process](#pull-request-process)
- [Testing Requirements](#testing-requirements)
- [Documentation](#documentation)
- [Issue Guidelines](#issue-guidelines)
- [Community](#community)

---

## Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inclusive experience for everyone. We pledge to make participation in our project a harassment-free experience for everyone, regardless of:

- Age, body size, disability, ethnicity, gender identity and expression
- Level of experience, education, socio-economic status
- Nationality, personal appearance, race, religion, or sexual identity and orientation

### Our Standards

**Positive behaviors include:**
- Using welcoming and inclusive language
- Being respectful of differing viewpoints and experiences
- Gracefully accepting constructive criticism
- Focusing on what is best for the Clemson community
- Showing empathy towards other community members

**Unacceptable behaviors include:**
- Trolling, insulting/derogatory comments, and personal or political attacks
- Public or private harassment
- Publishing others' private information without explicit permission
- Other conduct which could reasonably be considered inappropriate in a professional setting

### Enforcement

Instances of abusive, harassing, or otherwise unacceptable behavior may be reported to the project team at the Clemson Sports Media contact email. All complaints will be reviewed and investigated promptly and fairly.

---

## Getting Started

### Prerequisites

Before contributing, ensure you have:

- **Node.js 20+** (LTS version)
- **npm 10+** or **yarn 1.22+** or **pnpm 8+**
- **Git** for version control
- A **GitHub account**
- A code editor (**VS Code** recommended)

### Setting Up Your Development Environment

1. **Fork the repository** on GitHub
   - Click the "Fork" button in the top-right corner
   - This creates a copy of the repository in your GitHub account

2. **Clone your fork locally:**
   ```bash
   git clone https://github.com/YOUR-USERNAME/csm-cu-game-stats.git
   cd csm-cu-game-stats
   ```

3. **Add the upstream repository:**
   ```bash
   git remote add upstream https://github.com/cliftonc0613/csm-cu-game-stats.git
   ```

4. **Install dependencies:**
   ```bash
   npm install
   ```

5. **Create a `.env.local` file** (optional):
   ```bash
   cp .env.local.example .env.local
   ```

6. **Start the development server:**
   ```bash
   npm run dev
   ```

7. **Verify everything works:**
   - Open http://localhost:3000
   - Navigate to a few game pages
   - Test search and filter functionality

---

## Development Process

### Branching Strategy

We use a feature branch workflow:

- **`main`** - Production-ready code
- **`develop`** - Integration branch for features
- **`feature/*`** - New features or enhancements
- **`fix/*`** - Bug fixes
- **`docs/*`** - Documentation updates
- **`refactor/*`** - Code refactoring
- **`test/*`** - Test additions or modifications

### Creating a Feature Branch

```bash
# Ensure you're on develop and it's up to date
git checkout develop
git pull upstream develop

# Create a new feature branch
git checkout -b feature/your-feature-name

# Examples:
# git checkout -b feature/add-player-stats
# git checkout -b fix/game-date-parsing
# git checkout -b docs/update-api-guide
```

### Branch Naming Conventions

- Use lowercase with hyphens
- Use descriptive names that indicate the purpose
- Prefix with type: `feature/`, `fix/`, `docs/`, `refactor/`, `test/`

**Good examples:**
- `feature/add-game-comparison-export`
- `fix/score-bar-mobile-layout`
- `docs/update-deployment-guide`

**Bad examples:**
- `my-changes` (not descriptive)
- `Feature123` (not lowercase, not descriptive)
- `fix-bug` (too vague)

---

## Contribution Workflow

### 1. Find or Create an Issue

Before starting work:

- **Search existing issues** to see if your contribution is already being discussed
- **Create a new issue** if one doesn't exist
- **Get feedback** from maintainers before starting significant work
- **Assign yourself** to the issue (or comment that you're working on it)

### 2. Make Your Changes

- Write clean, maintainable code
- Follow the coding standards (see below)
- Add tests for new functionality
- Update documentation as needed
- Test your changes thoroughly

### 3. Commit Your Changes

```bash
# Stage your changes
git add .

# Commit with a descriptive message (see Commit Message Guidelines)
git commit -m "feat: add CSV export for game comparison page"

# Or for multiple changes
git add file1.ts file2.ts
git commit -m "fix: resolve date parsing issue in game metadata"
```

### 4. Keep Your Branch Updated

```bash
# Fetch upstream changes
git fetch upstream

# Merge upstream develop into your branch
git merge upstream/develop

# Resolve any conflicts if they occur
```

### 5. Push Your Branch

```bash
# Push to your fork
git push origin feature/your-feature-name
```

### 6. Create a Pull Request

1. **Go to GitHub** and navigate to your fork
2. **Click "Compare & pull request"**
3. **Select the base repository** and branch:
   - Base repository: `cliftonc0613/csm-cu-game-stats`
   - Base branch: `develop`
4. **Fill out the PR template** (see Pull Request Process)
5. **Submit the pull request**

---

## Coding Standards

### TypeScript

- **Use TypeScript** for all new code
- **Enable strict mode** (already configured in `tsconfig.json`)
- **Define types explicitly** for function parameters and return values
- **Avoid `any` type** unless absolutely necessary
- **Use interfaces** for object shapes

**Good:**
```typescript
interface GameStats {
  opponent: string;
  score_clemson: number;
  score_opponent: number;
}

function getGameWinner(game: GameStats): string {
  return game.score_clemson > game.score_opponent ? 'Clemson' : game.opponent;
}
```

**Bad:**
```typescript
function getGameWinner(game: any) {
  return game.score_clemson > game.score_opponent ? 'Clemson' : game.opponent;
}
```

### Code Formatting

We use **Prettier** for consistent code formatting:

```bash
# Format all files
npm run format

# Check formatting without modifying files
npm run format:check
```

**Configuration:**
- 2 spaces for indentation
- Single quotes for strings
- No semicolons (unless required)
- Trailing commas in arrays/objects

### Linting

We use **ESLint** for code quality:

```bash
# Run linter
npm run lint

# Fix auto-fixable issues
npm run lint:fix
```

**Rules:**
- No unused variables
- No console.log in production code (use console.error/warn only)
- Consistent naming conventions
- React best practices

### React/Next.js Guidelines

- **Use React Server Components** by default (Next.js 13+ App Router)
- **Add 'use client'** directive only when needed (for hooks, event handlers)
- **Use Suspense boundaries** for async components
- **Optimize images** with Next.js Image component
- **Use semantic HTML** elements

**Example:**
```typescript
// Server Component (default)
export default async function GamePage({ params }: { params: { slug: string } }) {
  const game = await getGameBySlug(params.slug);
  return <GameDetailHeader game={game} />;
}

// Client Component (when needed)
'use client';

export function SearchBar() {
  const [query, setQuery] = useState('');
  return <input value={query} onChange={(e) => setQuery(e.target.value)} />;
}
```

### CSS/Styling Guidelines

- **Use Tailwind CSS** utility classes
- **Avoid inline styles** unless dynamic
- **Use Clemson brand colors** from `lib/constants/colors.ts`
- **Follow responsive design** principles (mobile-first)
- **Use semantic color names** (e.g., `clemson-orange` not `#F56600`)

**Good:**
```typescript
<div className="bg-clemson-orange text-white p-4 rounded-lg hover:scale-105 transition-transform">
  {content}
</div>
```

**Bad:**
```typescript
<div style={{ backgroundColor: '#F56600', color: 'white', padding: '16px' }}>
  {content}
</div>
```

### File and Folder Organization

- **Components**: `components/[category]/ComponentName.tsx`
- **Utilities**: `lib/utils/utilityName.ts`
- **Types**: `lib/[feature]/types.ts` or inline with components
- **Tests**: Co-located with source files (`ComponentName.test.tsx`)
- **Pages**: `app/[route]/page.tsx`

**Naming conventions:**
- Components: PascalCase (e.g., `GameTable.tsx`)
- Utilities: camelCase (e.g., `formatDate.ts`)
- Constants: UPPER_SNAKE_CASE (e.g., `CLEMSON_ORANGE`)
- Types/Interfaces: PascalCase (e.g., `GameStatsFrontmatter`)

---

## Commit Message Guidelines

We follow the **Conventional Commits** specification.

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, no logic change)
- **refactor**: Code refactoring (no functional change)
- **test**: Adding or updating tests
- **chore**: Build process or auxiliary tool changes
- **perf**: Performance improvements

### Examples

**Feature:**
```
feat(comparison): add CSV export for game comparison page

- Implemented CSV export button in comparison toolbar
- Added formatting for multi-game comparison data
- Includes all game statistics in export
```

**Bug fix:**
```
fix(game-table): resolve sorting issue for numeric columns

Numeric columns were being sorted alphabetically instead of numerically.
Updated the sort comparator to handle number parsing.

Fixes #123
```

**Documentation:**
```
docs(readme): update installation instructions for Node.js 20+

- Updated Node.js version requirement to 20+
- Added troubleshooting section for M1/M2 Macs
- Clarified npm vs yarn usage
```

### Rules

- Use imperative mood ("add feature" not "added feature")
- Keep subject line under 72 characters
- Capitalize first letter of subject
- Don't end subject with a period
- Separate subject from body with blank line
- Reference issues and PRs in footer

---

## Pull Request Process

### PR Title

Use the same format as commit messages:

```
feat(game-detail): add player statistics section
fix(mobile): resolve score bar overflow on small screens
docs(contributing): update development setup instructions
```

### PR Description Template

When creating a PR, include:

```markdown
## Description
Brief description of what this PR does.

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## Related Issue
Fixes #123
Closes #456

## Changes Made
- List specific changes
- Use bullet points
- Be clear and concise

## Screenshots (if applicable)
[Before] [After]

## Testing
- [ ] Tests pass locally (`npm test`)
- [ ] Build succeeds (`npm run build`)
- [ ] No TypeScript errors (`npm run type-check`)
- [ ] No linting errors (`npm run lint`)
- [ ] Manually tested in browser

## Checklist
- [ ] My code follows the project's coding standards
- [ ] I have added tests that prove my fix is effective or my feature works
- [ ] I have updated the documentation accordingly
- [ ] My changes generate no new warnings
- [ ] I have checked my code for accessibility issues
```

### Review Process

1. **Automated checks** will run:
   - TypeScript compilation
   - ESLint
   - Jest tests
   - Build verification

2. **Maintainer review**:
   - Code quality
   - Test coverage
   - Documentation
   - Performance impact

3. **Address feedback**:
   - Make requested changes
   - Push updates to your branch
   - Respond to comments

4. **Approval and merge**:
   - Maintainer approves PR
   - PR is merged into `develop`
   - Your contribution is live!

---

## Testing Requirements

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### Writing Tests

All new features and bug fixes must include tests.

**Component test example:**
```typescript
import { render, screen } from '@testing-library/react';
import { GameTable } from './GameTable';

describe('GameTable', () => {
  it('renders table with game statistics', () => {
    const data = { /* test data */ };
    render(<GameTable data={data} />);

    expect(screen.getByRole('table')).toBeInTheDocument();
  });

  it('sorts columns when header is clicked', () => {
    // Test implementation
  });
});
```

**Utility test example:**
```typescript
import { formatDate } from './formatDate';

describe('formatDate', () => {
  it('formats date string correctly', () => {
    const result = formatDate('2024-09-07');
    expect(result).toBe('September 7, 2024');
  });
});
```

### Test Coverage Goals

- **New features**: 80%+ coverage
- **Bug fixes**: Add test that reproduces the bug
- **Utilities**: 100% coverage
- **Components**: Test user interactions and edge cases

---

## Documentation

### When to Update Documentation

Update documentation when you:

- Add new features
- Change existing functionality
- Fix bugs that affect usage
- Add new configuration options
- Update dependencies

### Documentation Files

- **README.md**: Project overview, quick start
- **docs/DEPLOYMENT.md**: Deployment instructions
- **docs/ENVIRONMENT-VARIABLES.md**: Environment configuration
- **docs/PERFORMANCE.md**: Performance optimization
- **This file (CONTRIBUTING.md)**: Contribution guidelines
- **Code comments**: Inline documentation for complex logic

### Documentation Standards

- Use clear, concise language
- Include code examples
- Keep examples up-to-date
- Use proper Markdown formatting
- Link to related documentation

---

## Issue Guidelines

### Before Creating an Issue

1. **Search existing issues** to avoid duplicates
2. **Check the documentation** - your question may already be answered
3. **Verify the issue** exists in the latest version

### Creating a Good Issue

**Bug reports should include:**
- Clear, descriptive title
- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots (if applicable)
- Environment (OS, browser, Node.js version)
- Error messages or console output

**Feature requests should include:**
- Clear description of the feature
- Use case and motivation
- Examples of similar features (if applicable)
- Mockups or wireframes (if UI-related)

### Issue Labels

- `bug`: Something isn't working
- `feature`: New feature request
- `documentation`: Documentation improvements
- `good first issue`: Good for newcomers
- `help wanted`: Extra attention needed
- `enhancement`: Improvement to existing feature
- `question`: Further information requested

---

## Community

### Getting Help

- **Issues**: Open an issue for bugs or feature requests
- **Discussions**: Use GitHub Discussions for questions
- **Email**: Contact Clemson Sports Media team

### Recognition

Contributors are recognized in:
- Git commit history
- Release notes
- Contributors section (if added in future)

### Communication

- Be respectful and professional
- Provide constructive feedback
- Respond to feedback promptly
- Ask questions when unclear
- Share knowledge and help others

---

## Additional Resources

### Project Documentation

- [README.md](../README.md) - Project overview and quick start
- [docs/DEPLOYMENT.md](./DEPLOYMENT.md) - Deployment guide
- [docs/ENVIRONMENT-VARIABLES.md](./ENVIRONMENT-VARIABLES.md) - Environment configuration
- [docs/PERFORMANCE.md](./PERFORMANCE.md) - Performance optimization
- [docs/TESTING.md](./TESTING.md) - Testing guide

### External Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Conventional Commits](https://www.conventionalcommits.org/)

---

## Questions?

If you have questions about contributing, feel free to:

1. Open an issue with the `question` label
2. Start a discussion on GitHub Discussions
3. Contact the Clemson Sports Media development team

Thank you for contributing to the Clemson Sports Statistics Website! 🐅🧡💜

---

**Clemson Sports Media** | [clemsonsportsmedia.com](https://clemsonsportsmedia.com/)
