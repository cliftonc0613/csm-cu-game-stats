'use client';

import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScoreComparisonBar } from "@/components/game/ScoreComparisonBar";
import { StatCard } from "@/components/game/StatCard";
import { StatCardGrid } from "@/components/game/StatCardGrid";
import { HistoricalChart } from "@/components/game/HistoricalChart";
import { GameTable } from "@/components/game/GameTable";
import { createOrdinalStats, createStatsFromValues } from "@/lib/utils/stats";
import { createChartData } from "@/lib/utils/charts";
import { createTableColumns } from "@/lib/utils/tables";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <Container maxWidth="2xl" padding="lg" className="py-12">
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-clemson-orange">
            Clemson Sports Statistics
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
            Comprehensive Clemson Tigers athletics statistics and game data
          </p>
        </div>
      </Container>

      {/* Typography Test */}
      <Container maxWidth="xl" padding="md" className="py-8">
        <Card>
          <CardHeader>
            <CardTitle>Typography System Test</CardTitle>
            <CardDescription>Testing responsive typography at all breakpoints</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h1>Heading 1 - Display</h1>
              <h2>Heading 2 - Section</h2>
              <h3>Heading 3 - Subsection</h3>
              <h4>Heading 4 - Component</h4>
              <h5>Heading 5 - Small</h5>
              <h6>Heading 6 - Metadata</h6>
            </div>
            <div>
              <p className="text-body">Body text (16px) - Regular paragraph content</p>
              <p className="text-body-sm">Small body text (14px) - Secondary content</p>
              <p className="text-metadata">Metadata text (14px) - Info labels</p>
              <p className="text-metadata-sm">Small metadata (12px) - Captions</p>
            </div>
            <div className="space-y-2">
              <div className="display-number text-clemson-orange">99<span className="ordinal-superscript">th</span></div>
              <p className="text-sm text-muted-foreground">Display number with ordinal</p>
            </div>
          </CardContent>
        </Card>
      </Container>

      {/* ScoreComparisonBar Test */}
      <Container maxWidth="2xl" padding="md" className="py-8">
        <Card>
          <CardHeader>
            <CardTitle>ScoreComparisonBar Component Test</CardTitle>
            <CardDescription>Testing score comparison bar with team logos and win streak</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Win Scenario */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Win Scenario</h3>
              <ScoreComparisonBar
                clemson={{
                  score: 42,
                  record: "10-2",
                }}
                opponent={{
                  name: "South Carolina",
                  score: 17,
                  record: "8-4",
                }}
                winStreak={5}
                isWin={true}
              />
            </div>

            {/* Loss Scenario */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Loss Scenario</h3>
              <ScoreComparisonBar
                clemson={{
                  score: 21,
                  record: "9-3",
                }}
                opponent={{
                  name: "Georgia",
                  score: 28,
                  record: "12-0",
                }}
                isWin={false}
              />
            </div>

            {/* Close Game */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Close Game</h3>
              <ScoreComparisonBar
                clemson={{
                  score: 31,
                  record: "11-1",
                }}
                opponent={{
                  name: "Florida State",
                  score: 28,
                  record: "10-2",
                }}
                winStreak={3}
              />
            </div>
          </CardContent>
        </Card>
      </Container>

      {/* StatCard Test */}
      <Container maxWidth="2xl" padding="md" className="py-8">
        <Card>
          <CardHeader>
            <CardTitle>StatCard Component Test</CardTitle>
            <CardDescription>Testing stat cards with orange and purple backgrounds</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Ordinal Stats */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Ordinal Stats</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                  value={99}
                  ordinal="th"
                  label="National Ranking"
                  description="of 134 teams"
                  variant="orange"
                />
                <StatCard
                  value={1}
                  ordinal="st"
                  label="ACC Standing"
                  description="in conference"
                  variant="purple"
                />
                <StatCard
                  value={3}
                  ordinal="rd"
                  label="Total Defense"
                  description="nationally"
                  variant="orange"
                />
                <StatCard
                  value={22}
                  ordinal="nd"
                  label="Scoring Offense"
                  description="in FBS"
                  variant="purple"
                />
              </div>
            </div>

            {/* Regular Stats (no ordinals) */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Regular Stats</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <StatCard
                  value={42}
                  label="Points Scored"
                  variant="orange"
                  size="md"
                />
                <StatCard
                  value={17}
                  label="Points Allowed"
                  variant="purple"
                  size="md"
                />
                <StatCard
                  value={489}
                  label="Total Yards"
                  description="offense"
                  variant="orange"
                  size="md"
                />
              </div>
            </div>

            {/* Size Variations */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Size Variations</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard value={85} label="Small" variant="orange" size="sm" />
                <StatCard value={72} label="Medium" variant="purple" size="md" />
                <StatCard value={99} ordinal="th" label="Default" variant="orange" />
                <StatCard value={1} ordinal="st" label="Large" variant="purple" size="lg" />
              </div>
            </div>
          </CardContent>
        </Card>
      </Container>

      {/* StatCardGrid Test */}
      <Container maxWidth="2xl" padding="md" className="py-8">
        <Card>
          <CardHeader>
            <CardTitle>StatCardGrid Component Test</CardTitle>
            <CardDescription>Testing responsive grid layout with automatic color alternation</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* 4-Column Grid with Ordinal Stats */}
            <div>
              <h3 className="text-lg font-semibold mb-4">4-Column Grid (Auto-Alternating Colors)</h3>
              <StatCardGrid
                stats={createOrdinalStats([
                  [1, "ACC Standing", "in conference"],
                  [3, "Total Defense", "nationally"],
                  [12, "Rushing Offense", "in FBS"],
                  [7, "Pass Efficiency", "in nation"],
                ])}
                columns={4}
              />
            </div>

            {/* 3-Column Grid with Regular Stats */}
            <div>
              <h3 className="text-lg font-semibold mb-4">3-Column Grid (Starting with Purple)</h3>
              <StatCardGrid
                stats={createStatsFromValues([
                  [489, "Total Yards", "offense"],
                  [287, "Passing Yards"],
                  [202, "Rushing Yards"],
                ])}
                columns={3}
                startColor="purple"
              />
            </div>

            {/* 2-Column Grid with Mixed Data */}
            <div>
              <h3 className="text-lg font-semibold mb-4">2-Column Grid (Large Numbers)</h3>
              <StatCardGrid
                stats={[
                  { value: 42, label: "Points Scored", size: "lg" },
                  { value: 17, label: "Points Allowed", size: "lg" },
                ]}
                columns={2}
                gap="lg"
              />
            </div>

            {/* Custom Variant Override */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Custom Variants (Manual Colors)</h3>
              <StatCardGrid
                stats={[
                  { value: 10, label: "Wins", variant: "orange" },
                  { value: 2, label: "Losses", variant: "purple" },
                  { value: 85, label: "Win %", description: "season", variant: "orange" },
                  { value: 456, label: "Points", description: "total", variant: "purple" },
                ]}
                columns={4}
                autoAlternate={false}
              />
            </div>
          </CardContent>
        </Card>
      </Container>

      {/* HistoricalChart Test */}
      <Container maxWidth="2xl" padding="md" className="py-8">
        <Card>
          <CardHeader>
            <CardTitle>HistoricalChart Component Test</CardTitle>
            <CardDescription>Testing historical data visualization with Recharts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Area Chart */}
            <div>
              <HistoricalChart
                title="Clemson vs South Carolina - Historical Scores"
                data={createChartData(
                  [2018, 2019, 2020, 2021, 2022, 2023, 2024],
                  [56, 38, 34, 30, 31, 16, 42],
                  [35, 3, 23, 0, 30, 7, 17]
                )}
                type="area"
                height={350}
                clemsonLabel="Clemson Tigers"
                opponentLabel="South Carolina Gamecocks"
                yAxisLabel="Points"
              />
            </div>

            {/* Line Chart */}
            <div>
              <HistoricalChart
                title="Season Comparison - Points Per Game"
                data={createChartData(
                  [2020, 2021, 2022, 2023, 2024],
                  [35, 32, 28, 31, 36],
                  [21, 18, 24, 22, 19]
                )}
                type="line"
                height={300}
                yAxisLabel="Average Points"
                showGrid={true}
              />
            </div>
          </CardContent>
        </Card>
      </Container>

      {/* GameTable Test */}
      <Container maxWidth="2xl" padding="md" className="py-8">
        <Card>
          <CardHeader>
            <CardTitle>GameTable Component Test</CardTitle>
            <CardDescription>Testing sortable table with Clemson branding</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Player Statistics Table */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Player Statistics (Sortable)</h3>
              <GameTable
                columns={createTableColumns([
                  { key: 'player', label: 'Player', sortable: true },
                  { key: 'position', label: 'Position', sortable: true, align: 'center' },
                  { key: 'yards', label: 'Yards', sortable: true, align: 'right' },
                  { key: 'touchdowns', label: 'TDs', sortable: true, align: 'center' },
                  { key: 'average', label: 'Avg', sortable: true, align: 'right' },
                ])}
                data={[
                  { id: 1, player: 'Cade Klubnik', position: 'QB', yards: 2844, touchdowns: 24, average: 8.2 },
                  { id: 2, player: 'Phil Mafah', position: 'RB', yards: 1245, touchdowns: 15, average: 5.8 },
                  { id: 3, player: 'Antonio Williams', position: 'RB', yards: 678, touchdowns: 8, average: 4.9 },
                  { id: 4, player: 'Bryant Wesco', position: 'WR', yards: 892, touchdowns: 10, average: 15.2 },
                  { id: 5, player: 'Tyler Brown', position: 'WR', yards: 734, touchdowns: 6, average: 12.8 },
                ]}
                striped
                hoverable
              />
            </div>

            {/* Game Results Table */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Season Game Results</h3>
              <GameTable
                columns={createTableColumns([
                  { key: 'date', label: 'Date', sortable: true },
                  { key: 'opponent', label: 'Opponent', sortable: true },
                  {
                    key: 'result',
                    label: 'Result',
                    sortable: false,
                    align: 'center',
                    render: (value) => (
                      <span className={value === 'W' ? 'text-clemson-orange font-bold' : 'text-clemson-purple font-bold'}>
                        {value}
                      </span>
                    )
                  },
                  { key: 'score', label: 'Score', sortable: false, align: 'center' },
                  { key: 'location', label: 'Location', sortable: true },
                ])}
                data={[
                  { id: 1, date: '9/2/2024', opponent: 'Georgia', result: 'W', score: '34-3', location: 'Home' },
                  { id: 2, date: '9/9/2024', opponent: 'App State', result: 'W', score: '66-20', location: 'Home' },
                  { id: 3, date: '9/21/2024', opponent: 'NC State', result: 'L', score: '24-29', location: 'Away' },
                  { id: 4, date: '9/28/2024', opponent: 'Stanford', result: 'W', score: '40-14', location: 'Home' },
                  { id: 5, date: '10/5/2024', opponent: 'FSU', result: 'W', score: '29-13', location: 'Away' },
                ]}
                showBorders
                hoverable
              />
            </div>
          </CardContent>
        </Card>
      </Container>

      {/* Button Test */}
      <Container maxWidth="lg" padding="md" className="py-8">
        <Card>
          <CardHeader>
            <CardTitle>Button Component Test</CardTitle>
            <CardDescription>Testing Clemson-branded buttons</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <Button variant="default">Primary (Orange)</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="link">Link</Button>
            </div>
          </CardContent>
        </Card>
      </Container>

      {/* Responsive Grid Test */}
      <Container maxWidth="2xl" padding="md" className="py-8">
        <h2 className="text-2xl font-bold mb-6">Responsive Grid Test</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <Card key={i} className={i % 2 === 0 ? "bg-clemson-orange text-white" : "bg-clemson-purple text-white"}>
              <CardHeader>
                <CardTitle>Card {i}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  Responsive grid: 1 col (mobile), 2 cols (sm), 3 cols (md), 4 cols (lg)
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </Container>

      {/* Container Width Test */}
      <div className="py-8 space-y-4 bg-muted/30">
        <Container maxWidth="sm" padding="md">
          <Card>
            <CardContent className="pt-6">
              <p className="font-semibold">Container SM (640px max)</p>
            </CardContent>
          </Card>
        </Container>
        <Container maxWidth="md" padding="md">
          <Card>
            <CardContent className="pt-6">
              <p className="font-semibold">Container MD (768px max)</p>
            </CardContent>
          </Card>
        </Container>
        <Container maxWidth="lg" padding="md">
          <Card>
            <CardContent className="pt-6">
              <p className="font-semibold">Container LG (1024px max)</p>
            </CardContent>
          </Card>
        </Container>
        <Container maxWidth="xl" padding="md">
          <Card>
            <CardContent className="pt-6">
              <p className="font-semibold">Container XL (1280px max)</p>
            </CardContent>
          </Card>
        </Container>
        <Container maxWidth="2xl" padding="md">
          <Card>
            <CardContent className="pt-6">
              <p className="font-semibold">Container 2XL (1536px max)</p>
            </CardContent>
          </Card>
        </Container>
      </div>

      {/* Breakpoint Indicator */}
      <Container maxWidth="xl" padding="md" className="py-8">
        <Card className="bg-clemson-dark text-white">
          <CardContent className="pt-6">
            <p className="text-center font-bold text-lg">
              <span className="xs:hidden">Current breakpoint: &lt; 320px (xs)</span>
              <span className="hidden xs:inline sm:hidden">Current breakpoint: 320px+ (xs)</span>
              <span className="hidden sm:inline md:hidden">Current breakpoint: 640px+ (sm)</span>
              <span className="hidden md:inline lg:hidden">Current breakpoint: 768px+ (md)</span>
              <span className="hidden lg:inline xl:hidden">Current breakpoint: 1024px+ (lg)</span>
              <span className="hidden xl:inline 2xl:hidden">Current breakpoint: 1280px+ (xl)</span>
              <span className="hidden 2xl:inline 3xl:hidden">Current breakpoint: 1536px+ (2xl)</span>
              <span className="hidden 3xl:inline">Current breakpoint: 2560px+ (3xl)</span>
            </p>
          </CardContent>
        </Card>
      </Container>

      {/* Footer */}
      <Container maxWidth="xl" padding="md" className="py-12">
        <div className="text-center text-muted-foreground">
          <p>Design System Foundation - Task 2.9 Responsive Test</p>
          <p className="text-sm mt-2">Testing breakpoints: 320px - 2560px</p>
        </div>
      </Container>
    </div>
  );
}
