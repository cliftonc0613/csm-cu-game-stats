# Game Statistics Template Documentation

This directory contains template files and documentation for creating game statistics content for the Clemson Sports Statistics Website.

## Table of Contents

- [Overview](#overview)
- [Template Structure](#template-structure)
- [Frontmatter Fields](#frontmatter-fields)
- [Content Sections](#content-sections)
- [Validation Rules](#validation-rules)
- [Examples](#examples)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)

---

## Overview

Game statistics are stored as Markdown files with YAML frontmatter. Each file follows a strict template structure to ensure consistency and enable automatic validation.

### File Naming Convention

```
YYYY-MM-DD-opponent-name.md
```

**Examples:**
- `2024-09-07-appalachian-state.md`
- `2024-09-21-nc-state.md`
- `2024-11-02-louisville.md`

**Rules:**
- Use lowercase for all characters
- Separate words with hyphens (kebab-case)
- Use full team name (not abbreviations)
- Date format: YYYY-MM-DD (ISO 8601)

---

## Template Structure

### File Layout

```markdown
---
[YAML Frontmatter]
---

# Game Overview
[Brief game summary]

## Team Statistics
[Scoring summary and team stats comparison]

## Individual Statistics
[Passing, rushing, receiving, defense statistics]

## Key Plays
[Notable plays by quarter]

## Game Notes
[Additional notes, records, milestones]

## Historical Context
[Head-to-head history, series records]
```

---

## Frontmatter Fields

### Required Fields

#### `game_date` (string)
Date the game was played in ISO 8601 format.

```yaml
game_date: "2024-09-07"
```

**Format:** `YYYY-MM-DD`
**Validation:** Must be a valid date string

---

#### `opponent` (string)
Full name of the opposing team.

```yaml
opponent: "Appalachian State"
```

**Format:** Proper case, full team name
**Examples:**
- `"Florida State"`
- `"North Carolina State"`
- `"Notre Dame"`

---

#### `opponent_short` (string)
Abbreviated opponent name for display in tight spaces.

```yaml
opponent_short: "APP ST"
```

**Format:** Uppercase abbreviation
**Max length:** 10 characters recommended
**Examples:**
- `"FSU"` for Florida State
- `"NC ST"` for NC State
- `"ND"` for Notre Dame

---

#### `score` (object)
Final game score with nested fields for Clemson and opponent.

```yaml
score:
  clemson: 66
  opponent: 20
```

**Subfields:**
- `clemson` (number): Clemson's final score
- `opponent` (number): Opponent's final score

**Validation:** Must be non-negative integers

---

#### `season` (number)
The season year.

```yaml
season: 2024
```

**Format:** Four-digit year
**Examples:** `2024`, `2025`

---

#### `game_type` (string)
Type of game.

```yaml
game_type: "regular_season"
```

**Valid values:**
- `"regular_season"` - Regular season game
- `"bowl"` - Bowl game
- `"playoff"` - Playoff game
- `"championship"` - Conference championship

---

#### `content_type` (string)
Type of content.

```yaml
content_type: "statistics"
```

**Valid values:**
- `"statistics"` - Statistical data and analysis
- `"evaluation"` - Game evaluation and performance review

---

#### `location` (string)
Where the game was played.

```yaml
location: "Memorial Stadium, Clemson, SC"
```

**Format:** `Stadium Name, City, State`
**Examples:**
- `"Memorial Stadium, Clemson, SC"` (home)
- `"Doak Campbell Stadium, Tallahassee, FL"` (away)

---

#### `slug` (string)
URL-friendly identifier for the game.

```yaml
slug: "2024-09-07-appalachian-state"
```

**Format:** Same as filename (without .md extension)
**Note:** Should match the file name exactly

---

### Optional Fields

#### `attendance` (number)
Number of fans in attendance.

```yaml
attendance: 81500
```

**Format:** Positive integer
**Default:** Omitted if not available

---

#### `weather` (string)
Weather conditions during the game.

```yaml
weather: "Partly cloudy, 78°F"
```

**Format:** Free text description
**Examples:**
- `"Clear, 75°F"`
- `"Rainy, 52°F"`
- `"Partly cloudy, 68°F"`

---

#### `home_away` (string)
Whether Clemson was home or away.

```yaml
home_away: "home"
```

**Valid values:**
- `"home"` - Clemson home game
- `"away"` - Clemson away game
- `"neutral"` - Neutral site game

---

#### `win_streak` (number)
Current winning streak after this game.

```yaml
win_streak: 2
```

**Format:** Non-negative integer
**Note:** Set to 0 if Clemson lost

---

## Content Sections

### 1. Game Overview

Brief narrative summary of the game (2-4 sentences).

```markdown
# Game Overview

Clemson dominated Appalachian State in their home opener, scoring 66 points
in a commanding victory. The Tigers' offense was firing on all cylinders,
with balanced production through both the air and on the ground.
```

**Guidelines:**
- Keep it concise (2-4 sentences)
- Highlight key moments or turning points
- Mention final outcome and significance

---

### 2. Team Statistics

#### Scoring Summary

Quarter-by-quarter scoring breakdown.

```markdown
### Scoring Summary

| Quarter | Clemson | Opponent |
|---------|---------|----------|
| 1st     | 21      | 7        |
| 2nd     | 24      | 3        |
| 3rd     | 14      | 7        |
| 4th     | 7       | 3        |
| **Final** | **66** | **20**  |
```

**Requirements:**
- Include all 4 quarters
- Bold the "Final" row
- Scores must add up to final score

---

#### Team Stats Comparison

Key team statistics side-by-side.

```markdown
### Team Stats Comparison

| Statistic | Clemson | Opponent |
|-----------|---------|----------|
| First Downs | 28 | 18 |
| Total Yards | 537 | 312 |
| Passing Yards | 312 | 198 |
| Rushing Yards | 225 | 114 |
| Turnovers | 0 | 2 |
| Penalties-Yards | 4-35 | 7-58 |
| Time of Possession | 33:24 | 26:36 |
```

**Required statistics:**
- First Downs
- Total Yards
- Passing Yards
- Rushing Yards
- Turnovers
- Penalties-Yards (format: `count-yards`)
- Time of Possession (format: `MM:SS`)

---

### 3. Individual Statistics

#### Passing

Player passing statistics for both teams.

```markdown
### Passing

**Clemson**

| Player | Comp-Att | Yards | TD | INT | Rating |
|--------|----------|-------|----|----|--------|
| Cade Klubnik | 24-33 | 263 | 2 | 0 | 156.8 |

**Opponent**

| Player | Comp-Att | Yards | TD | INT | Rating |
|--------|----------|-------|----|----|--------|
| QB Name | 15-28 | 198 | 1 | 2 | 94.3 |
```

**Columns:**
- Player name
- Completions-Attempts (format: `comp-att`)
- Yards
- Touchdowns
- Interceptions
- Passer rating

---

#### Rushing

Player rushing statistics for both teams.

```markdown
### Rushing

**Clemson**

| Player | Attempts | Yards | Avg | TD | Long |
|--------|----------|-------|-----|----|----|
| Phil Mafah | 18 | 124 | 6.9 | 2 | 32 |

**Opponent**

| Player | Attempts | Yards | Avg | TD | Long |
|--------|----------|-------|-----|----|----|
| RB Name | 12 | 68 | 5.7 | 0 | 18 |
```

**Columns:**
- Player name
- Attempts
- Yards
- Average (yards per attempt)
- Touchdowns
- Longest run

---

#### Receiving

Player receiving statistics for both teams.

```markdown
### Receiving

**Clemson**

| Player | Receptions | Yards | Avg | TD | Long |
|--------|------------|-------|-----|----|----|
| Bryant Wesco | 6 | 89 | 14.8 | 1 | 28 |

**Opponent**

| Player | Receptions | Yards | Avg | TD | Long |
|--------|------------|-------|-----|----|----|
| WR Name | 5 | 72 | 14.4 | 0 | 24 |
```

**Columns:**
- Player name
- Receptions
- Yards
- Average (yards per reception)
- Touchdowns
- Longest reception

---

#### Defense

Player defensive statistics for both teams.

```markdown
### Defense

**Clemson**

| Player | Tackles | Sacks | TFL | INT | PD |
|--------|---------|-------|-----|-----|-----|
| Barrett Carter | 8 | 1.0 | 2.0 | 1 | 2 |

**Opponent**

| Player | Tackles | Sacks | TFL | INT | PD |
|--------|---------|-------|-----|-----|-----|
| LB Name | 10 | 0.0 | 1.0 | 0 | 1 |
```

**Columns:**
- Player name
- Total tackles
- Sacks (decimal format: `1.0`, `0.5` for half-sack)
- Tackles for loss (TFL)
- Interceptions
- Pass deflections (PD)

---

### 4. Key Plays

Notable plays organized by quarter.

```markdown
## Key Plays

- **1st Quarter**: Klubnik 15-yard TD run to open scoring (7-0 CU)
- **2nd Quarter**: Wesco 28-yard TD reception extends lead (31-10 CU)
- **3rd Quarter**: Carter pick-six seals the victory (52-17 CU)
- **4th Quarter**: Mafah 32-yard TD run caps scoring (66-20 CU)
```

**Guidelines:**
- List 1-4 key plays per quarter
- Include score after play if significant
- Describe what made each play important

---

### 5. Game Notes

Additional context, records, and milestones.

```markdown
## Game Notes

- Clemson's 66 points were the most scored in a home opener since 2019
- Klubnik's 263 passing yards marked a career high
- Defense forced 2 turnovers and limited opponent to 312 total yards
- Attendance of 81,500 was a sellout crowd
```

**Include:**
- Records set or tied
- Career milestones
- Notable team achievements
- Attendance records
- Injury updates (if significant)

---

### 6. Historical Context

Head-to-head series information.

```markdown
## Historical Context

This was the first-ever meeting between Clemson and Appalachian State.
Clemson improved to 1-0 in the all-time series with this victory.
```

**Include:**
- All-time series record
- Recent matchup history
- Notable previous games
- Rivalry context

---

## Validation Rules

### Automatic Validation

The system automatically validates:

1. **Required frontmatter fields** - All required fields must be present
2. **Data types** - Fields must match expected types (string, number, object)
3. **Date format** - `game_date` must be valid ISO 8601 date
4. **Score values** - Must be non-negative integers
5. **Enum values** - `game_type`, `content_type`, `home_away` must use valid values
6. **HTML safety** - Content is sanitized to prevent XSS attacks

### Validation Errors

Common validation errors:

```
❌ Missing required field: game_date
❌ Invalid date format: game_date must be YYYY-MM-DD
❌ Invalid game_type: must be "regular_season", "bowl", "playoff", or "championship"
❌ Score must be a positive integer
```

---

## Examples

### Complete Example

See the full template: [`game-stats-template.md`](./game-stats-template.md)

### Real Game Examples

- [`2024-09-07-appalachian-state.md`](../games/2024-09-07-appalachian-state.md) - High-scoring home victory
- [`2024-09-21-nc-state.md`](../games/2024-09-21-nc-state.md) - Conference game
- [`2024-11-02-louisville.md`](../games/2024-11-02-louisville.md) - Away game

---

## Best Practices

### Data Entry

1. **Use the template** - Copy `game-stats-template.md` for each new game
2. **Verify statistics** - Double-check all numbers against official box scores
3. **Consistent formatting** - Follow the exact table structure
4. **Complete all sections** - Don't skip sections, use "N/A" if truly not applicable
5. **Proofread** - Check spelling, especially player names

### Content Quality

1. **Be objective** - Focus on facts and statistics, not opinions
2. **Use proper names** - Full player names, proper capitalization
3. **Accurate data** - Verify all statistics from official sources
4. **Timely updates** - Add games shortly after they're played
5. **Complete information** - Include all available statistics

### Markdown Formatting

1. **Use tables** - For all statistical data
2. **Bold headers** - Use `**bold**` for table headers and final scores
3. **Consistent spacing** - One blank line between sections
4. **Clean tables** - Align columns for readability (optional, not required)
5. **No HTML** - Use Markdown syntax only (HTML is sanitized)

---

## Troubleshooting

### Build Errors

**Problem:** "File does not match template structure"
- **Solution:** Ensure all required sections are present in order

**Problem:** "Invalid frontmatter: missing required field"
- **Solution:** Add all required fields to YAML frontmatter

**Problem:** "Date parsing error"
- **Solution:** Use exact format `YYYY-MM-DD` for `game_date`

### Display Issues

**Problem:** Tables not rendering correctly
- **Solution:** Ensure proper Markdown table syntax with pipes (`|`) and hyphens (`---`)

**Problem:** Frontmatter not parsing
- **Solution:** Ensure three dashes (`---`) on lines before and after YAML

**Problem:** Special characters causing issues
- **Solution:** Avoid special characters in field values; use quotes for strings with colons

### Validation Warnings

**Problem:** "Slug does not match filename"
- **Solution:** Ensure `slug` field matches the filename (without `.md`)

**Problem:** "Score mismatch in scoring summary"
- **Solution:** Verify quarter scores add up to final score

---

## Support

For questions or issues with the template:

1. Review this documentation
2. Check existing game files for examples
3. Consult the [Contributing Guide](../../CONTRIBUTING.md)
4. Open an issue on GitHub
5. Contact the Clemson Sports Media development team

---

**Last Updated:** Task 9.7
**Template Version:** 1.0
**Maintained by:** Clemson Sports Media
