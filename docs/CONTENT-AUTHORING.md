# Content Authoring Guide

A step-by-step guide for adding new game statistics to the Clemson Sports Statistics Website.

## Table of Contents

- [Introduction](#introduction)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Step-by-Step Guide](#step-by-step-guide)
- [Frontmatter Reference](#frontmatter-reference)
- [Content Formatting](#content-formatting)
- [Testing Your Content](#testing-your-content)
- [Submitting for Deployment](#submitting-for-deployment)
- [Common Mistakes](#common-mistakes)
- [FAQ](#faq)

---

## Introduction

This guide is designed for content authors adding game statistics to the website. You don't need to be a developer - just follow these steps to add new game content.

### What You'll Create

Each game is a single Markdown file that includes:
- Game metadata (date, opponent, score, etc.)
- Team and individual statistics
- Notable plays and context

### Time Required

- **First game:** 30-45 minutes (includes setup)
- **Subsequent games:** 15-20 minutes each

---

## Prerequisites

### Required Tools

1. **Text Editor**
   - Recommended: [VS Code](https://code.visualstudio.com/) (free)
   - Alternative: Any text editor (Notepad++, Sublime Text, etc.)

2. **Git Access**
   - GitHub account with repository access
   - OR: Send files to the development team

### Required Information

Before you start, gather:
- Official box score from the game
- Game date, opponent, and final score
- Team statistics (yards, first downs, turnovers, etc.)
- Individual player statistics (passing, rushing, receiving, defense)
- Notable plays or highlights

**Sources:**
- ESPN box scores
- Official Clemson Athletics statistics
- ACC Network statistics

---

## Quick Start

**For experienced users:**

1. Copy `content/templates/game-stats-template.md`
2. Rename to `YYYY-MM-DD-opponent-name.md`
3. Fill in frontmatter and statistics
4. Save in `content/games/` directory
5. Test locally (optional) or submit

**Example:**
```bash
cp content/templates/game-stats-template.md content/games/2024-11-16-south-carolina.md
# Edit the file
# Save and submit
```

---

## Step-by-Step Guide

### Step 1: Copy the Template

1. **Navigate to the templates folder:**
   - Go to `content/templates/`
   - Find `game-stats-template.md`

2. **Create a copy:**
   - Copy `game-stats-template.md`
   - Paste into `content/games/` folder

3. **Rename the file:**
   - Use format: `YYYY-MM-DD-opponent-name.md`
   - All lowercase
   - Use hyphens to separate words
   - Use full team name (not abbreviations)

**Examples:**
- ✅ `2024-11-16-south-carolina.md`
- ✅ `2024-09-28-florida-state.md`
- ✅ `2024-10-12-wake-forest.md`
- ❌ `2024-11-16-SC.md` (don't use abbreviations)
- ❌ `2024-11-16-South-Carolina.md` (don't use capital letters)
- ❌ `south-carolina.md` (missing date)

### Step 2: Fill in the Frontmatter

The frontmatter is the section at the top between the `---` markers. This contains metadata about the game.

**Open your new file and update these fields:**

```yaml
---
game_date: "2024-11-16"           # Game date (YYYY-MM-DD)
opponent: "South Carolina"         # Full opponent name
opponent_short: "USC"              # Abbreviation (max 10 chars)
score:
  clemson: 17                      # Clemson's final score
  opponent: 14                     # Opponent's final score
season: 2024                       # Season year
game_type: "regular_season"        # regular_season, bowl, playoff, championship
content_type: "statistics"         # statistics or evaluation
location: "Williams-Brice Stadium, Columbia, SC"  # Stadium, City, State
attendance: 77559                  # Number of fans
weather: "Clear, 58°F"             # Weather conditions
home_away: "away"                  # home, away, or neutral
win_streak: 3                      # Current win streak (0 if loss)
slug: "2024-11-16-south-carolina"  # Must match filename (without .md)
---
```

**Field Tips:**
- **game_date:** Must be in YYYY-MM-DD format
- **opponent:** Use official team name (check ESPN)
- **score:** Must be numbers, not text
- **game_type:** Most games are "regular_season"
- **location:** Format as "Stadium Name, City, State"
- **home_away:** "home" for Memorial Stadium games, "away" for road games
- **win_streak:** Set to 0 if Clemson lost
- **slug:** Must exactly match your filename (without .md)

### Step 3: Add Game Overview

Replace the placeholder text with a brief summary (2-4 sentences):

```markdown
# Game Overview

[Write 2-4 sentences about the game outcome and key moments]
```

**Example:**
```markdown
# Game Overview

Clemson defeated rival South Carolina 17-14 in a defensive battle at Williams-Brice Stadium.
The Tigers' defense held strong in the fourth quarter, stopping a late USC drive to preserve
the victory. This marked Clemson's third consecutive win in the rivalry series.
```

**Tips:**
- Keep it concise
- Mention final outcome first
- Highlight 1-2 key moments
- Note significance (rivalry, streak, etc.)

### Step 4: Fill in Team Statistics

#### Scoring Summary

Update the quarterly scores:

```markdown
| Quarter | Clemson | Opponent |
|---------|---------|----------|
| 1st     | 7       | 0        |
| 2nd     | 3       | 7        |
| 3rd     | 0       | 7        |
| 4th     | 7       | 0        |
| **Final** | **17** | **14**  |
```

**Important:**
- Scores must add up to final score
- Keep the **bold** formatting on "Final" row

#### Team Stats Comparison

Fill in the comparison table:

```markdown
| Statistic | Clemson | Opponent |
|-----------|---------|----------|
| First Downs | 18 | 21 |
| Total Yards | 312 | 345 |
| Passing Yards | 198 | 225 |
| Rushing Yards | 114 | 120 |
| Turnovers | 1 | 2 |
| Penalties-Yards | 5-45 | 7-68 |
| Time of Possession | 28:45 | 31:15 |
```

**Format Notes:**
- Penalties-Yards: Use format `count-yards` (e.g., `5-45`)
- Time of Possession: Use format `MM:SS` (e.g., `28:45`)

### Step 5: Add Individual Statistics

For each category (Passing, Rushing, Receiving, Defense), add player rows.

#### Passing

```markdown
**Clemson**

| Player | Comp-Att | Yards | TD | INT | Rating |
|--------|----------|-------|----|----|--------|
| Cade Klubnik | 18-32 | 198 | 1 | 1 | 118.5 |
```

**Format:**
- Comp-Att: `completions-attempts` (e.g., `18-32`)
- All other columns: numbers only

#### Rushing

```markdown
**Clemson**

| Player | Attempts | Yards | Avg | TD | Long |
|--------|----------|-------|-----|----|----|
| Phil Mafah | 22 | 105 | 4.8 | 1 | 24 |
| Jay Haynes | 8 | 42 | 5.3 | 0 | 12 |
```

**Tips:**
- List multiple players if they contributed
- Calculate Avg (Yards ÷ Attempts)
- Include all touchdowns

#### Receiving

```markdown
**Clemson**

| Player | Receptions | Yards | Avg | TD | Long |
|--------|------------|-------|-----|----|----|
| Antonio Williams | 6 | 78 | 13.0 | 0 | 22 |
| Tyler Brown | 4 | 54 | 13.5 | 1 | 28 |
```

#### Defense

```markdown
**Clemson**

| Player | Tackles | Sacks | TFL | INT | PD |
|--------|---------|-------|-----|-----|-----|
| Barrett Carter | 10 | 0.0 | 1.5 | 0 | 2 |
| Wade Woodaz | 8 | 1.0 | 2.0 | 1 | 1 |
```

**Format Notes:**
- Sacks and TFL: Use decimal (1.0, 0.5, 1.5)
- PD = Pass Deflections

### Step 6: Add Key Plays

List 1-4 notable plays per quarter:

```markdown
## Key Plays

- **1st Quarter**: Mafah 24-yard TD run opens scoring (7-0 CU)
- **2nd Quarter**: USC FG cuts lead to 7-3
- **3rd Quarter**: Klubnik 28-yard TD pass to Brown (14-7 CU)
- **4th Quarter**: Carter interception seals victory
```

**Tips:**
- Describe what happened
- Include score if it changed
- Focus on turning points

### Step 7: Add Game Notes

Include any additional context:

```markdown
## Game Notes

- This was Clemson's 7th consecutive win over South Carolina
- Mafah reached 1,000 rushing yards for the season
- Attendance of 77,559 was a sellout crowd
- Weather was ideal for November football
```

**What to include:**
- Records set or tied
- Milestones reached
- Attendance records
- Historical context

### Step 8: Add Historical Context

Include series information:

```markdown
## Historical Context

Clemson improved to 75-43-4 all-time against South Carolina with this victory.
The Tigers have now won 7 straight in the series, dating back to 2014.
This was the 119th meeting between the two schools.
```

**What to include:**
- All-time series record
- Current winning/losing streak
- Number of meetings
- Notable historical facts

---

## Frontmatter Reference

### Required Fields

| Field | Type | Example | Description |
|-------|------|---------|-------------|
| `game_date` | String | `"2024-11-16"` | ISO date format (YYYY-MM-DD) |
| `opponent` | String | `"South Carolina"` | Full team name |
| `opponent_short` | String | `"USC"` | Abbreviation (max 10 chars) |
| `score.clemson` | Number | `17` | Clemson's final score |
| `score.opponent` | Number | `14` | Opponent's final score |
| `season` | Number | `2024` | Season year |
| `game_type` | String | `"regular_season"` | Game type (see options below) |
| `content_type` | String | `"statistics"` | Content type |
| `location` | String | `"Stadium, City, ST"` | Game location |
| `slug` | String | `"2024-11-16-south-carolina"` | Must match filename |

### Optional Fields

| Field | Type | Example | Description |
|-------|------|---------|-------------|
| `attendance` | Number | `77559` | Attendance count |
| `weather` | String | `"Clear, 58°F"` | Weather conditions |
| `home_away` | String | `"away"` | Home/away/neutral |
| `win_streak` | Number | `3` | Current winning streak |

### Field Options

**game_type options:**
- `regular_season` (most common)
- `bowl`
- `playoff`
- `championship`

**content_type options:**
- `statistics` (use this for stats)
- `evaluation` (for analysis pieces)

**home_away options:**
- `home` (games at Memorial Stadium)
- `away` (road games)
- `neutral` (neutral site games)

---

## Content Formatting

### Markdown Tables

Tables must use proper Markdown syntax:

```markdown
| Column 1 | Column 2 | Column 3 |
|----------|----------|----------|
| Data 1   | Data 2   | Data 3   |
| Data 4   | Data 5   | Data 6   |
```

**Rules:**
- Use pipes (`|`) to separate columns
- Include a header row with dashes (`---`)
- Align data under headers

### Bold Text

Use `**text**` for bold:

```markdown
**Clemson**
**Final**
**1st Quarter**
```

### Lists

Use `-` for bullet lists:

```markdown
- Item 1
- Item 2
- Item 3
```

### Headings

Use `#` for headings:

```markdown
# Main Heading (H1)
## Section Heading (H2)
### Subsection Heading (H3)
```

---

## Testing Your Content

### Option 1: Local Testing (Recommended)

If you have development environment set up:

1. **Save your file** in `content/games/`
2. **Start development server:**
   ```bash
   npm run dev
   ```
3. **Open browser:** http://localhost:3000
4. **Navigate to your game:**
   - Go to homepage
   - Find your game in the list
   - Click to view detail page
5. **Check for:**
   - All statistics display correctly
   - No formatting errors
   - Tables render properly
   - No console errors

### Option 2: Validation Check

At minimum, verify:

- [ ] File name matches slug in frontmatter
- [ ] All required frontmatter fields filled in
- [ ] Quarterly scores add up to final score
- [ ] Tables have proper Markdown formatting
- [ ] No missing sections

---

## Submitting for Deployment

### If You Have Git Access

1. **Create a branch:**
   ```bash
   git checkout -b content/add-game-2024-11-16-south-carolina
   ```

2. **Add your file:**
   ```bash
   git add content/games/2024-11-16-south-carolina.md
   ```

3. **Commit:**
   ```bash
   git commit -m "feat: add South Carolina game statistics (11/16/2024)"
   ```

4. **Push:**
   ```bash
   git push origin content/add-game-2024-11-16-south-carolina
   ```

5. **Create Pull Request** on GitHub

### If You Don't Have Git Access

1. **Save your file** with correct name
2. **Email the file** to the development team
3. **Include in email:**
   - Game date and opponent
   - Any special notes or context
   - When you'd like it published

---

## Common Mistakes

### Mistake 1: Wrong File Name Format

❌ **Wrong:**
- `south-carolina.md` (missing date)
- `2024-11-16-USC.md` (abbreviation instead of full name)
- `2024-11-16-South-Carolina.md` (capital letters)

✅ **Correct:**
- `2024-11-16-south-carolina.md`

### Mistake 2: Frontmatter Slug Mismatch

❌ **Wrong:**
```yaml
slug: "south-carolina"  # Doesn't match filename
```

✅ **Correct:**
```yaml
slug: "2024-11-16-south-carolina"  # Matches filename exactly
```

### Mistake 3: Scores Don't Add Up

❌ **Wrong:**
```markdown
| 1st  | 7  | 0  |
| 2nd  | 3  | 7  |
| 3rd  | 0  | 7  |
| 4th  | 0  | 0  |  <- Missing 4th quarter TD!
| Final| 17 | 14 |
```

✅ **Correct:**
```markdown
| 1st  | 7  | 0  |
| 2nd  | 3  | 7  |
| 3rd  | 0  | 7  |
| 4th  | 7  | 0  |
| Final| 17 | 14 |
```

### Mistake 4: Wrong Date Format

❌ **Wrong:**
```yaml
game_date: "11/16/2024"      # US format
game_date: "16-11-2024"      # European format
game_date: "November 16, 2024"  # Text format
```

✅ **Correct:**
```yaml
game_date: "2024-11-16"      # ISO format (YYYY-MM-DD)
```

### Mistake 5: Broken Table Formatting

❌ **Wrong:**
```markdown
| Player | Yards | TD
| John Doe | 100 | 2 |   <- Missing pipe at end
```

✅ **Correct:**
```markdown
| Player | Yards | TD |
|--------|-------|----|
| John Doe | 100 | 2 |
```

---

## FAQ

### Q: How long does it take to add a new game?

**A:** First game takes 30-45 minutes as you learn the process. Subsequent games take 15-20 minutes.

### Q: What if I don't know a statistic?

**A:** Use `0` or `N/A` as a placeholder. Better to have complete structure with placeholders than missing sections.

### Q: Can I edit a game after it's published?

**A:** Yes! Just edit the Markdown file and submit the changes. The site will rebuild with your updates.

### Q: What if I make a mistake?

**A:** The system will validate your content and show errors. Common errors are easy to fix. If stuck, contact the dev team.

### Q: Do I need to know HTML or programming?

**A:** No! Just follow this guide and use Markdown formatting. No coding required.

### Q: Where do I get official statistics?

**A:** Check:
- ESPN.com box scores
- Clemson Athletics official stats
- ACC Network statistics
- Official game programs

### Q: Can I add images or videos?

**A:** Not yet in v1. Future versions may support embedded media.

### Q: What's the difference between "statistics" and "evaluation"?

**A:**
- **statistics** = Raw data, box scores, stats
- **evaluation** = Analysis, commentary, performance reviews

Use "statistics" for most game content.

### Q: How do I handle overtime games?

**A:** Add an "OT" row to the scoring summary:

```markdown
| Quarter | Clemson | Opponent |
|---------|---------|----------|
| 1st     | 7       | 0        |
| 2nd     | 7       | 14       |
| 3rd     | 7       | 7        |
| 4th     | 7       | 7        |
| OT      | 3       | 0        |
| **Final** | **31** | **28**  |
```

### Q: What if there are multiple overtime periods?

**A:** Use OT, 2OT, 3OT, etc.

---

## Getting Help

If you get stuck:

1. **Check examples:** Look at existing games in `content/games/`
2. **Review template:** Re-read `content/templates/README.md`
3. **Contact dev team:** Send your file for review
4. **Open an issue:** GitHub issues for bugs or questions

---

## Checklist

Before submitting your game, verify:

- [ ] File name is correct format: `YYYY-MM-DD-opponent-name.md`
- [ ] File is in `content/games/` directory
- [ ] All required frontmatter fields are filled in
- [ ] Slug matches filename exactly
- [ ] Date is in YYYY-MM-DD format
- [ ] Quarterly scores add up to final score
- [ ] All tables have proper Markdown formatting
- [ ] Player names are spelled correctly
- [ ] Statistics match official box score
- [ ] Game overview is clear and concise
- [ ] All sections are complete (no TODOs left)

---

**Happy authoring! 🐅🧡**

---

**Questions?** Contact the Clemson Sports Media development team.

**Website:** [clemsonsportsmedia.com](https://clemsonsportsmedia.com/)
