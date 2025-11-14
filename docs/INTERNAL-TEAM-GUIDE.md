# Clemson Sports Media Team Guide
## Internal Documentation for Game Statistics Website

**Version**: 1.0
**Last Updated**: November 2025
**For**: Clemson University Sports Media Team

---

## Table of Contents

1. [Introduction](#introduction)
2. [Getting Started](#getting-started)
3. [Game Day Workflow](#game-day-workflow)
4. [Adding Game Statistics](#adding-game-statistics)
5. [Content Guidelines](#content-guidelines)
6. [Quality Control Process](#quality-control-process)
7. [Season Planning](#season-planning)
8. [Common Tasks](#common-tasks)
9. [Troubleshooting](#troubleshooting)
10. [Team Contacts](#team-contacts)
11. [Resources](#resources)

---

## Introduction

### What is This Website?

The Clemson Game Statistics Website is your central hub for publishing and showcasing historical game data. It provides:

- **Professional presentation** of game statistics with Clemson branding
- **Easy content management** through simple markdown files
- **Searchable archive** of all games with filtering by season, opponent, and type
- **Interactive features** like game comparisons and CSV exports
- **Mobile-friendly design** for fans on any device

### Who Should Use This Guide?

This guide is for Clemson Sports Media team members who:
- Add new game statistics after each game
- Update existing game content
- Manage the season archive
- Coordinate content workflows
- Ensure quality and accuracy of published statistics

### Quick Reference

| Task | Time Required | Difficulty |
|------|--------------|------------|
| Add new game | 15-20 minutes | Easy |
| Review and publish | 5-10 minutes | Easy |
| Update existing game | 5-10 minutes | Easy |
| Season setup | 30 minutes | Medium |

---

## Getting Started

### Prerequisites

Before you can contribute, you'll need:

1. **Access to the repository**: Contact your team lead to get added to the GitHub repository
2. **Text editor**: We recommend [VS Code](https://code.visualstudio.com/) with spell check enabled
3. **Basic Git knowledge** (or use GitHub Desktop for easier workflow)

### First-Time Setup

#### Option 1: GitHub Desktop (Recommended for Non-Technical Users)

1. Download and install [GitHub Desktop](https://desktop.github.com/)
2. Sign in with your GitHub account
3. Clone the repository:
   - File → Clone Repository
   - Search for "csm-cu-game-stats"
   - Choose a local folder location
   - Click "Clone"

4. You're ready! The repository is now on your computer.

#### Option 2: Command Line (For Technical Users)

```bash
# Clone the repository
git clone https://github.com/cliftonc0613/csm-cu-game-stats.git

# Navigate to the project
cd csm-cu-game-stats

# Install dependencies (optional, only if running locally)
npm install
```

### Repository Structure (What You Need to Know)

```
csm-cu-game-stats/
├── content/
│   ├── games/           ← ADD NEW GAME FILES HERE
│   │   ├── 2024-appalachian-state.md
│   │   ├── 2024-nc-state.md
│   │   └── ...
│   └── templates/       ← COPY TEMPLATES FROM HERE
│       └── game-stats-template.md
├── docs/                ← Documentation and guides
└── public/
    └── images/
        └── logos/       ← Team logo files
```

**Key Folders:**
- `content/games/` - Where all game markdown files live
- `content/templates/` - Template files to copy for new games
- `public/images/logos/` - Team logo SVG files

---

## Game Day Workflow

### Pre-Game Preparation

**Timeline: 1-2 days before game**

1. **Confirm game details**:
   - Date, time, location
   - TV network and kickoff time
   - Expected attendance
   - Weather forecast

2. **Prepare template**:
   - Copy `game-stats-template.md` from `content/templates/`
   - Rename with format: `YYYY-opponent-name.md`
   - Fill in pre-game information (date, opponent, location)

3. **Save as draft** (don't commit yet)

### During Game

**Timeline: Real-time during game**

1. **Collect statistics** from official sources:
   - Official scoreboard
   - Stats crew reports
   - Coaching staff data
   - Video coordinator notes

2. **Note key plays**:
   - Touchdown descriptions
   - Turnovers
   - Fourth down conversions
   - Record-breaking performances

3. **Track unofficial stats**:
   - Momentum shifts
   - Weather changes
   - Injury updates (for notes section)

### Post-Game Processing

**Timeline: Within 2-4 hours after game**

1. **Verify final statistics** (30 minutes):
   - Confirm all scores are official
   - Verify individual statistics with official box score
   - Cross-check team totals

2. **Complete game file** (15-20 minutes):
   - Fill in all statistics tables
   - Write game overview summary
   - Add key plays section
   - Include historical context
   - Proofread for accuracy

3. **Quality review** (10 minutes):
   - Run validation check
   - Review with second team member
   - Verify all required fields are complete

4. **Publish** (5 minutes):
   - Commit to repository
   - Push to GitHub
   - Verify live deployment (within 2-3 minutes)

5. **Post-publication** (5 minutes):
   - Share link with athletic department
   - Post to social media (if applicable)
   - Archive raw statistics for records

### Total Time: 60-75 minutes post-game

---

## Adding Game Statistics

### Step-by-Step Process

#### Step 1: Copy the Template

```bash
# Navigate to templates folder
cd content/templates/

# Copy template to games folder with proper naming
cp game-stats-template.md ../games/2024-opponent-name.md
```

**Naming Convention**:
- Format: `YYYY-opponent-name.md`
- Use lowercase
- Replace spaces with hyphens
- Examples:
  - `2024-appalachian-state.md`
  - `2024-nc-state.md`
  - `2024-south-carolina.md`

#### Step 2: Fill in Frontmatter

Open the file and complete the header section:

```yaml
---
game_date: "2024-09-07"              # YYYY-MM-DD format
opponent: "Appalachian State"         # Full team name
score:
  clemson: 66                         # Clemson's score
  opponent: 20                        # Opponent's score
season: 2024                          # Four-digit year
game_type: "regular"                  # regular, bowl, or playoff
content_type: "game_statistics"       # Always this value
location: "Memorial Stadium, Clemson, SC"
attendance: 81500                     # Optional
weather: "Clear, 78°F"                # Optional
home_away: "home"                     # home or away
---
```

**Required Fields** (must complete):
- `game_date`: Date of the game
- `opponent`: Opponent team name
- `score`: Both team scores
- `season`: Year
- `game_type`: Type of game
- `content_type`: Always "game_statistics"
- `location`: Where the game was played

**Optional Fields** (nice to have):
- `attendance`: Official attendance number
- `weather`: Weather conditions at kickoff
- `home_away`: Whether Clemson was home or away

#### Step 3: Game Overview

Write a 2-3 paragraph summary:

```markdown
## Game Overview

[First paragraph: Game context and final result]
Clemson defeated Appalachian State 66-20 in front of 81,500 fans at
Memorial Stadium. The Tigers dominated from start to finish...

[Second paragraph: Key performances and highlights]
Quarterback Cade Klubnik threw for 378 yards and 5 touchdowns...

[Third paragraph: Historical context or significance]
The win improved Clemson to 2-0 on the season and marked...
```

**Tips**:
- Lead with the final score
- Highlight 2-3 key player performances
- Mention significant milestones or records
- Keep it factual and objective

#### Step 4: Team Statistics

Fill in the team statistics table:

```markdown
## Team Statistics

| Category | Clemson | Appalachian State |
|----------|---------|-------------------|
| First Downs | 32 | 18 |
| Total Yards | 612 | 374 |
| Rushing Yards | 234 | 152 |
| Passing Yards | 378 | 222 |
| Penalties-Yards | 4-35 | 7-58 |
| Turnovers | 0 | 3 |
| Time of Possession | 34:22 | 25:38 |
```

**Source**: Official box score (verify with stats crew)

#### Step 5: Individual Statistics

##### Passing Statistics

```markdown
| Player | Comp-Att | Yards | TD | INT | QBR |
|--------|----------|-------|----|----|-----|
| Cade Klubnik | 24-33 | 378 | 5 | 0 | 95.2 |
```

**Include**:
- All quarterbacks who attempted a pass
- Completions-Attempts format: "24-33"
- Round QBR to one decimal place

##### Rushing Statistics

```markdown
| Player | Carries | Yards | Avg | TD | Long |
|--------|---------|-------|-----|----|----|
| Phil Mafah | 18 | 124 | 6.9 | 2 | 34 |
| Jay Haynes | 12 | 78 | 6.5 | 1 | 18 |
```

**Include**:
- All players with 5+ carries (or any touchdown)
- Sort by total yards (highest first)
- Calculate averages to one decimal place

##### Receiving Statistics

```markdown
| Player | Rec | Yards | Avg | TD | Long |
|--------|-----|-------|-----|----|----|
| Antonio Williams | 8 | 149 | 18.6 | 2 | 45 |
| Tyler Brown | 6 | 112 | 18.7 | 2 | 38 |
```

**Include**:
- All receivers with 3+ catches (or any touchdown)
- Sort by total yards (highest first)
- Calculate averages to one decimal place

##### Defensive Statistics

```markdown
| Player | Tackles | TFL | Sacks | INT | PD |
|--------|---------|-----|-------|-----|----|
| Barrett Carter | 9 | 2.0 | 1.0 | 1 | 2 |
| Sammy Brown | 8 | 1.5 | 0.5 | 0 | 1 |
```

**Include**:
- All players with 5+ tackles
- Players with significant stats (sacks, INTs, forced fumbles)
- Use decimal format for shared tackles: 0.5, 1.5, 2.0
- Sort by total tackles

**Abbreviations**:
- TFL = Tackles for Loss
- INT = Interceptions
- PD = Pass Deflections
- FF = Forced Fumbles
- FR = Fumble Recoveries

#### Step 6: Scoring Summary

```markdown
## Scoring Summary

### First Quarter
- **CU** - Phil Mafah 12-yard run (Nolan Hauser kick), 9:23
- **CU** - Antonio Williams 45-yard pass from Cade Klubnik (Hauser kick), 3:15

### Second Quarter
- **APP** - Joey Aguilar 5-yard run (Michael Hughes kick), 11:08
- **CU** - Tyler Brown 28-yard pass from Klubnik (Hauser kick), 6:42
```

**Format**:
- Group by quarter
- Use team abbreviations: **CU** for Clemson, **APP** for Appalachian State
- Include: scorer, play description, kicker, time remaining
- List chronologically within each quarter

#### Step 7: Key Plays and Highlights

```markdown
## Key Plays and Highlights

- **1st Quarter, 9:23**: Phil Mafah breaks through the line for a 12-yard
  touchdown run to open the scoring
- **2nd Quarter, 3:42**: Barrett Carter intercepts a pass at the APP 35 and
  returns it to the 18, setting up a Clemson touchdown
- **3rd Quarter, 8:15**: Cade Klubnik connects with Antonio Williams for a
  45-yard touchdown pass, his 5th TD pass of the game
```

**Include**:
- 5-8 most significant plays
- Turnovers that led to points
- Record-breaking performances
- Game-changing momentum shifts
- Format: `**Quarter, Time**: Description`

#### Step 8: Game Notes

```markdown
## Game Notes

- Cade Klubnik's 5 touchdown passes tied his career high
- Clemson's 66 points were the most since defeating The Citadel 49-0 in 2023
- The defense held Appalachian State to just 3 third-down conversions (3-14)
- Attendance of 81,500 was the highest home opener crowd since 2019
- Clemson improved to 18-2 all-time in season openers at home
```

**Include**:
- Records set or tied
- Milestones achieved
- Historical comparisons
- Notable streaks
- Team achievements
- 5-10 bullets

#### Step 9: Historical Context

```markdown
## Historical Context

This victory marked Clemson's 12th consecutive home win against non-conference
opponents, a streak dating back to 2022. The 46-point margin of victory was
the largest against an FBS opponent since defeating Syracuse 47-21 in 2023.

Clemson has now scored 40+ points in 5 of its last 6 home games, continuing
the offensive resurgence under offensive coordinator Garrett Riley.
```

**Include**:
- All-time series record vs. opponent
- Recent trends (last 5 games, last season, etc.)
- Comparisons to similar games
- Program milestones or context
- 1-2 paragraphs

#### Step 10: Review and Save

**Checklist before committing**:
- [ ] All required frontmatter fields completed
- [ ] Game overview is clear and well-written
- [ ] All statistics tables are complete and accurate
- [ ] Scoring summary matches final score
- [ ] Key plays include time stamps and descriptions
- [ ] Game notes highlight significant achievements
- [ ] Historical context is relevant and accurate
- [ ] No spelling or grammar errors
- [ ] File name follows naming convention
- [ ] No markdown formatting errors

---

## Content Guidelines

### Writing Style

#### Tone
- **Professional and objective**: Avoid bias or overly promotional language
- **Factual**: Stick to verifiable statistics and events
- **Clear and concise**: Use simple, direct language
- **Celebratory but measured**: It's okay to highlight achievements, but remain balanced

#### Examples

**Good**:
> "Cade Klubnik threw for 378 yards and 5 touchdowns in a dominant 66-20 victory over Appalachian State."

**Avoid**:
> "Klubnik was AMAZING with an INCREDIBLE performance that destroyed the opposition!"

### Statistics Accuracy

#### Sources (in order of authority)
1. **Official box score** from athletic department
2. **Stats crew final report**
3. **NCAA official statistics**
4. **ESPN/ACC Network stats** (verify first)

#### Verification Process
- Cross-check at least two sources
- If discrepancies exist, use official athletic department stats
- When in doubt, ask stats crew or athletic communications

### Naming Conventions

#### Player Names
- **Use full name on first reference**: "Cade Klubnik"
- **Use last name only after first reference**: "Klubnik"
- **Check official roster for spelling**: Don't assume!

#### Team Names
- **Use official name**: "Appalachian State" (not "App State" in formal content)
- **Abbreviations in tables**: "APP", "FSU", "UNC"
- **Consistency**: Use the same format throughout

#### File Names
- **Format**: `YYYY-opponent-name.md`
- **Lowercase only**: `2024-south-carolina.md`
- **Hyphens, not spaces**: `florida-state` not `florida state`
- **No special characters**: Avoid &, @, #, etc.

### Branding Standards

#### Clemson References
- **"Clemson" or "the Tigers"**: Use interchangeably
- **"Memorial Stadium"**: Always use full name (not "Death Valley" in stats content)
- **Colors**: Orange (#F56600) and Purple (#522D80)

#### Logos
- Logo files are located in `public/images/logos/`
- Only use official SVG logos
- If opponent logo is missing, request from athletic communications

---

## Quality Control Process

### Pre-Publish Checklist

Before committing your game file, verify:

#### Accuracy (Critical)
- [ ] Final score matches official result
- [ ] Player statistics verified against official box score
- [ ] Names spelled correctly (check roster)
- [ ] All numbers add up (passing yards = sum of receivers, etc.)

#### Completeness (Critical)
- [ ] All required frontmatter fields filled in
- [ ] All statistics tables complete (no empty cells)
- [ ] Scoring summary matches score
- [ ] Key plays section has 5+ items
- [ ] Game notes section included

#### Quality (Important)
- [ ] No spelling or grammar errors
- [ ] Consistent formatting throughout
- [ ] Markdown syntax is correct
- [ ] Professional tone maintained
- [ ] Historical context is accurate

#### Technical (Important)
- [ ] File name follows convention
- [ ] File is in `content/games/` directory
- [ ] No special characters in frontmatter
- [ ] Dates in YYYY-MM-DD format

### Peer Review

**For high-profile games** (rivalry games, playoffs, bowls):
1. Complete your draft
2. Request review from second team member
3. Address feedback
4. Get approval before publishing

### Post-Publication Verification

After committing and pushing:

1. **Wait 2-3 minutes** for automatic deployment
2. **Visit the live website**: Check your game appears
3. **Review the game page**: Verify formatting and content
4. **Test interactive features**: Try sorting, filtering, export
5. **Check mobile view**: Open on phone or tablet

If issues are found:
- Make corrections immediately
- Commit with message: "fix: correct [description] in [game name]"
- Push changes and verify again

---

## Season Planning

### Pre-Season Setup

**Timeline: 2 weeks before season starts**

#### Create Season Schedule Template

1. **List all scheduled games**:
   - Date, opponent, location
   - TV network (if known)
   - Notes on opponent strength

2. **Prepare file structure**:
   ```
   content/games/
   ├── 2024-appalachian-state.md      (ready to fill post-game)
   ├── 2024-nc-state.md               (ready to fill post-game)
   ├── 2024-stanford.md               (ready to fill post-game)
   └── ...
   ```

3. **Create blank templates** for each game:
   - Copy game-stats-template.md for each scheduled game
   - Fill in known information (date, opponent, location)
   - Save as drafts (don't commit yet)

#### Coordinate with Athletics

- **Confirm statistics sources**: Who provides official stats?
- **Get credentials**: Access to press box, stats crew area
- **Establish turnaround time**: How quickly are stats finalized?
- **Set communication protocol**: Who to contact with questions?

### Mid-Season Review

**Timeline: After game 6-7**

1. **Review published games**: Check for consistency
2. **Update any corrections**: Fix errors found in earlier games
3. **Assess workflow**: Is the process working efficiently?
4. **Plan improvements**: Note issues to address in off-season

### End-of-Season Wrap-Up

**Timeline: After final game**

1. **Complete season archive**: Ensure all games are published
2. **Verify historical stats**: Cross-check season totals
3. **Document lessons learned**: What worked well? What didn't?
4. **Prepare for next season**: Update templates, processes

---

## Common Tasks

### Updating an Existing Game

**When you might need to do this**:
- Correction of statistics
- Addition of awards/honors
- Updated records or milestones

**Process**:
1. Open the game file in `content/games/`
2. Make your changes
3. Verify accuracy
4. Commit with clear message:
   ```bash
   git commit -m "fix: update rushing stats for 2024-nc-state game"
   ```
5. Push changes
6. Verify on live site

### Adding a New Opponent Logo

**When you need a logo that doesn't exist**:

1. **Request from athletic communications**:
   - Email: [athletics-comms@clemson.edu]
   - Specify: Need SVG format, official team logo
   - Provide: Opponent name, game date

2. **Save logo file**:
   - Location: `public/images/logos/`
   - Name format: `opponent-name.svg` (lowercase, hyphens)
   - Example: `appalachian-state.svg`

3. **Verify logo works**:
   - Build the site locally (optional)
   - Or wait for deployment and check live

### Searching for Past Games

#### On the Website
- Use the search bar on homepage
- Filter by season, opponent, or game type
- Click any game to view full statistics

#### In the Repository
- All games are in `content/games/`
- File names follow `YYYY-opponent-name.md` format
- Use your editor's file search (Ctrl+P in VS Code)

### Exporting Statistics

Users can export any game's statistics:

1. Visit the game detail page
2. Click "Export CSV" button
3. Choose format: Full Statistics, Summary Only, or Player Stats
4. File downloads automatically

**For internal use**:
- CSV files open in Excel or Google Sheets
- Use for reports, presentations, or analysis
- Data is formatted and ready to use

### Comparing Multiple Games

Users can compare up to 4 games side-by-side:

1. On homepage, select games using checkboxes
2. Click "Compare Selected Games" button
3. View comparison table with highlights
4. Use to analyze trends, player development, opponent matchups

---

## Troubleshooting

### Common Issues and Solutions

#### Build Errors After Committing

**Error**: "Validation failed: Missing required field 'game_date'"

**Solution**:
1. Check your frontmatter has all required fields
2. Verify dates are in YYYY-MM-DD format
3. Ensure score values are numbers (no quotes)
4. Fix the error and commit again

---

**Error**: "Unexpected token in YAML frontmatter"

**Solution**:
1. Check for special characters in frontmatter
2. Put text values in quotes if they contain: colons, #, @
3. Verify frontmatter starts with `---` and ends with `---`
4. No tabs in YAML (use spaces only)

---

#### Game Not Appearing on Website

**Possible causes**:
1. **File not committed**: Check git status
2. **Wrong folder**: File must be in `content/games/`
3. **Wrong file extension**: Must be `.md` not `.txt`
4. **Validation failure**: Check build logs
5. **Deployment delay**: Wait 2-3 minutes after push

**Solution**:
```bash
# Check if file is tracked
git status

# If not, add it
git add content/games/your-game.md

# Commit and push
git commit -m "feat: add game statistics for [opponent]"
git push

# Wait 2-3 minutes, then refresh website
```

---

#### Statistics Tables Not Formatting Correctly

**Problem**: Tables look broken or misaligned

**Solutions**:
1. **Check pipe characters**: Each column needs `|` on both sides
2. **Header separator**: Must have `|---|---|---|` row after headers
3. **Column count**: Every row must have same number of columns
4. **No line breaks**: Each table row on single line

**Example of correct formatting**:
```markdown
| Player | Yards | TD |
|--------|-------|----|
| Smith  | 100   | 2  |
| Jones  | 85    | 1  |
```

---

#### Markdown Links Not Working

**Problem**: Links display as plain text

**Solution**:
```markdown
<!-- Wrong -->
Visit clemson.edu

<!-- Correct -->
[Visit Clemson](https://clemson.edu)

<!-- Also correct for auto-linking -->
<https://clemson.edu>
```

---

#### Cannot Push to Repository

**Error**: "Permission denied" or "Authentication failed"

**Solutions**:
1. **Check GitHub access**: Confirm you're added to repository
2. **Verify credentials**: Re-authenticate in GitHub Desktop or command line
3. **Try HTTPS instead of SSH**: Clone URL should start with `https://`
4. **Contact team lead**: May need repository access updated

---

#### File Name Issues

**Error**: "Game file not found" or 404 error on website

**Solution**:
- File names must be lowercase
- Use hyphens, not spaces
- Format: `YYYY-opponent-name.md`
- Don't use special characters: &, @, #, etc.

**Examples**:
```
✓ Correct: 2024-appalachian-state.md
✗ Wrong: 2024-Appalachian State.md
✗ Wrong: 2024_appalachian_state.md
✗ Wrong: 2024-app-state.md
```

---

### Getting Help

#### Self-Service Resources

1. **Content Authoring Guide**: `docs/CONTENT-AUTHORING.md`
   - Detailed step-by-step instructions
   - Examples and common mistakes
   - Troubleshooting tips

2. **Template Documentation**: `content/templates/README.md`
   - Frontmatter field definitions
   - Table structures
   - Validation rules

3. **Deployment Guide**: `docs/DEPLOYMENT.md`
   - How deployments work
   - Troubleshooting build issues

#### Contact Team Members

When you need help:

**For Content Questions**:
- Sports Media Director: [name@clemson.edu]
- Statistics Coordinator: [name@clemson.edu]

**For Technical Issues**:
- Web Development Team: [webteam@clemson.edu]
- IT Support: [support@clemson.edu]

**For Access/Permissions**:
- Repository Admin: [admin@clemson.edu]
- Team Lead: [lead@clemson.edu]

#### Reporting Bugs or Issues

If you find a bug on the website:

1. **Document the issue**:
   - What page/game?
   - What did you expect to happen?
   - What actually happened?
   - Steps to reproduce
   - Screenshots if applicable

2. **Report via**:
   - GitHub Issues: Create new issue in repository
   - Email: [webteam@clemson.edu]
   - Slack: #website-support channel

---

## Team Contacts

### Primary Contacts

| Role | Name | Email | Phone |
|------|------|-------|-------|
| Team Lead | [Name] | lead@clemson.edu | (864) 555-0100 |
| Statistics Coordinator | [Name] | stats@clemson.edu | (864) 555-0101 |
| Content Manager | [Name] | content@clemson.edu | (864) 555-0102 |
| Technical Support | [Name] | tech@clemson.edu | (864) 555-0103 |

### Responsibilities

#### Statistics Coordinator
- Verifies official game statistics
- Coordinates with stats crew
- Final approval on all published statistics
- Handles corrections and updates

#### Content Manager
- Oversees content quality
- Reviews high-profile game content
- Maintains content standards
- Coordinates with athletic communications

#### Technical Support
- Troubleshoots technical issues
- Manages repository access
- Handles deployment problems
- Maintains website infrastructure

### Communication Channels

- **Slack**: #sports-stats channel for quick questions
- **Email**: For formal communications and documentation
- **Weekly meeting**: Tuesdays at 2pm (during season)
- **Emergency contact**: Team lead cell phone for game day issues

---

## Resources

### Templates and Tools

| Resource | Location | Purpose |
|----------|----------|---------|
| Game Stats Template | `content/templates/game-stats-template.md` | Template for new games |
| Template Documentation | `content/templates/README.md` | Field definitions and validation |
| Content Authoring Guide | `docs/CONTENT-AUTHORING.md` | Detailed how-to guide |
| Style Guide | This document, "Content Guidelines" section | Writing standards |

### External Resources

#### Official Statistics
- **Clemson Athletics**: [clemsontigers.com/stats](https://clemsontigers.com/sports/football/stats)
- **ACC Stats**: [theacc.com/sports/football/stats](https://theacc.com/sports/football/stats)
- **NCAA Stats**: [ncaa.com/stats/football](https://ncaa.com/stats/football)

#### Markdown Help
- **Markdown Guide**: [markdownguide.org](https://www.markdownguide.org/)
- **GitHub Markdown**: [GitHub Docs](https://docs.github.com/en/get-started/writing-on-github)
- **Markdown Cheatsheet**: [Quick reference](https://www.markdownguide.org/cheat-sheet/)

#### Git/GitHub Resources
- **GitHub Desktop Guide**: [Desktop.github.com](https://desktop.github.com/)
- **Git Basics**: [git-scm.com/book](https://git-scm.com/book/en/v2/Getting-Started-Git-Basics)
- **GitHub Training**: [skills.github.com](https://skills.github.com/)

### Training Materials

#### New Team Member Onboarding
1. Read this guide (1 hour)
2. Review example games in `content/games/` (30 minutes)
3. Practice: Create a test game file (30 minutes)
4. Shadow experienced team member on next game (2 hours)
5. Complete first game under supervision (1 hour)

#### Continuing Education
- **Monthly tips**: Shared via email newsletter
- **Season kickoff training**: Review of updates and best practices
- **Mid-season check-in**: Share lessons learned, Q&A
- **End-of-season retrospective**: Process improvements for next year

---

## Appendix

### Quick Reference: Game Day Timeline

| Time | Task | Duration |
|------|------|----------|
| 2 days before | Prepare template | 10 min |
| During game | Collect statistics | Ongoing |
| Post-game + 30 min | Verify final stats | 30 min |
| Post-game + 1 hour | Complete game file | 20 min |
| Post-game + 1.5 hours | Quality review | 10 min |
| Post-game + 2 hours | Publish to website | 5 min |
| Post-game + 2 hours | Verify live | 5 min |

**Total time commitment: ~80 minutes post-game**

### Quick Reference: Frontmatter Fields

#### Required Fields
```yaml
game_date: "2024-09-07"              # YYYY-MM-DD
opponent: "Appalachian State"         # Full team name
score:
  clemson: 66                         # Number only
  opponent: 20                        # Number only
season: 2024                          # Four digits
game_type: "regular"                  # regular/bowl/playoff
content_type: "game_statistics"       # Always this
location: "Memorial Stadium, Clemson, SC"
```

#### Optional Fields
```yaml
attendance: 81500                     # Number only
weather: "Clear, 78°F"                # String
home_away: "home"                     # home or away
```

### Quick Reference: Markdown Formatting

| Element | Markdown | Result |
|---------|----------|--------|
| Heading 2 | `## Heading` | Large heading |
| Heading 3 | `### Heading` | Medium heading |
| Bold | `**text**` | **Bold text** |
| Italic | `*text*` | *Italic text* |
| Link | `[text](url)` | Clickable link |
| Bullet list | `- Item` | • Item |
| Numbered list | `1. Item` | 1. Item |

### Quick Reference: Common Abbreviations

| Abbreviation | Meaning |
|--------------|---------|
| Comp-Att | Completions-Attempts |
| TD | Touchdown |
| INT | Interception |
| QBR | Quarterback Rating |
| Avg | Average |
| TFL | Tackles for Loss |
| PD | Pass Deflections |
| FF | Forced Fumbles |
| FR | Fumble Recoveries |

### Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | November 2025 | Initial release |

---

## Feedback and Improvements

This guide is a living document. We welcome your feedback!

**How to suggest improvements**:
1. Create a GitHub issue with tag "documentation"
2. Email suggestions to [lead@clemson.edu]
3. Bring up in weekly team meeting

**Questions not covered in this guide?**
- Let us know so we can add them!
- Email [lead@clemson.edu] with your question
- We'll update the guide and notify the team

---

**Last Updated**: November 13, 2025
**Document Owner**: Clemson Sports Media Team
**Next Review**: Start of 2025 Season
