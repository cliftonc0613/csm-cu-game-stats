import { notFound } from 'next/navigation';
import { getGameBySlug, getAllGames } from '@/lib/markdown/getGameBySlug';
import { Container } from '@/components/ui/container';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  transformTeamStats,
  transformScoringData,
  transformPassingStats,
  transformRushingStats,
  transformReceivingStats,
  transformDefenseStats,
} from '@/lib/utils/chartData';

// Import lazy-loaded chart components
import { TeamStatsChartLazy } from '@/components/game/TeamStatsChartLazy';
import { ScoringProgressionChartLazy } from '@/components/game/ScoringProgressionChartLazy';
import { PassingStatsChartLazy } from '@/components/game/PassingStatsChartLazy';
import { RushingStatsChartLazy } from '@/components/game/RushingStatsChartLazy';
import { ReceivingStatsChartLazy } from '@/components/game/ReceivingStatsChartLazy';
import { DefenseStatsChartLazy } from '@/components/game/DefenseStatsChartLazy';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const games = await getAllGames();
  return games.map((game) => ({
    slug: game.slug,
  }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const game = await getGameBySlug(slug, { validate: true });

  if (!game) {
    return {
      title: 'Game Not Found',
    };
  }

  const { opponent, game_date, score } = game.frontmatter;
  const scoreText = `${score.clemson}-${score.opponent}`;

  return {
    title: `Clemson vs ${opponent} (${scoreText}) - ${game_date}`,
    description: game.excerpt || `Game statistics for Clemson vs ${opponent} on ${game_date}`,
  };
}

export default async function GamePage({ params }: PageProps) {
  const { slug } = await params;

  // Fetch game with table data parsing enabled
  const game = await getGameBySlug(slug, {
    validate: true,
    parseTableData: true,
  });

  if (!game) {
    notFound();
  }

  const { frontmatter, content, tableData } = game;
  const {
    opponent,
    game_date,
    score,
    location,
  } = frontmatter;

  // Optional fields that may not exist on all game types
  const attendance = 'attendance' in frontmatter ? frontmatter.attendance : undefined;
  const weather = 'weather' in frontmatter ? frontmatter.weather : undefined;

  // Transform table data for charts
  const scoringData = tableData?.scoringSummary
    ? transformScoringData(tableData.scoringSummary)
    : null;

  const teamStatsData = tableData?.teamStatsComparison
    ? transformTeamStats(tableData.teamStatsComparison)
    : null;

  const passingDataClemson = tableData?.passing?.clemson
    ? transformPassingStats(tableData.passing.clemson, 'clemson')
    : null;

  const passingDataOpponent = tableData?.passing?.opponent
    ? transformPassingStats(tableData.passing.opponent, 'opponent')
    : null;

  const rushingDataClemson = tableData?.rushing?.clemson
    ? transformRushingStats(tableData.rushing.clemson, 'clemson').slice(0, 5)
    : null;

  const rushingDataOpponent = tableData?.rushing?.opponent
    ? transformRushingStats(tableData.rushing.opponent, 'opponent').slice(0, 5)
    : null;

  const receivingDataClemson = tableData?.receiving?.clemson
    ? transformReceivingStats(tableData.receiving.clemson, 'clemson').slice(0, 5)
    : null;

  const receivingDataOpponent = tableData?.receiving?.opponent
    ? transformReceivingStats(tableData.receiving.opponent, 'opponent').slice(0, 5)
    : null;

  const defenseDataClemson = tableData?.defense?.clemson
    ? transformDefenseStats(tableData.defense.clemson, 'clemson').slice(0, 5)
    : null;

  const defenseDataOpponent = tableData?.defense?.opponent
    ? transformDefenseStats(tableData.defense.opponent, 'opponent').slice(0, 5)
    : null;

  return (
    <div className="min-h-screen bg-background">
      {/* Game Header */}
      <Container maxWidth="2xl" padding="lg" className="py-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-clemson-orange">
            Clemson vs {opponent}
          </h1>
          <div className="text-2xl md:text-3xl font-bold">
            <span className="text-clemson-orange">{score.clemson}</span>
            <span className="text-muted-foreground mx-4">-</span>
            <span className="text-clemson-purple">{score.opponent}</span>
          </div>
          <div className="text-lg text-muted-foreground space-y-1">
            <p>{new Date(game_date).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}</p>
            <p>{location}</p>
            {attendance && <p>Attendance: {attendance.toLocaleString()}</p>}
            {weather && <p>{weather}</p>}
          </div>
        </div>
      </Container>

      {/* Scoring Progression Chart */}
      {scoringData && (
        <Container maxWidth="2xl" padding="md" className="py-6">
          <ScoringProgressionChartLazy
            data={scoringData}
            title="Scoring Progression"
            height={400}
          />
        </Container>
      )}

      {/* Team Statistics Comparison Chart */}
      {teamStatsData && (
        <Container maxWidth="2xl" padding="md" className="py-6">
          <TeamStatsChartLazy
            data={teamStatsData}
            title="Team Statistics Comparison"
            height={500}
          />
        </Container>
      )}

      {/* Passing Performance */}
      {(passingDataClemson || passingDataOpponent) && (
        <Container maxWidth="2xl" padding="md" className="py-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Passing Performance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              {passingDataClemson && passingDataClemson.length > 0 && (
                <div>
                  <PassingStatsChartLazy
                    data={passingDataClemson}
                    title="Clemson Passing"
                    height={300}
                  />
                </div>
              )}
              {passingDataOpponent && passingDataOpponent.length > 0 && (
                <div>
                  <PassingStatsChartLazy
                    data={passingDataOpponent}
                    title={`${opponent} Passing`}
                    height={300}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </Container>
      )}

      {/* Rushing Leaders */}
      {(rushingDataClemson || rushingDataOpponent) && (
        <Container maxWidth="2xl" padding="md" className="py-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Rushing Leaders</CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              {rushingDataClemson && rushingDataClemson.length > 0 && (
                <div>
                  <RushingStatsChartLazy
                    data={rushingDataClemson}
                    title="Clemson Rushing"
                    height={300}
                  />
                </div>
              )}
              {rushingDataOpponent && rushingDataOpponent.length > 0 && (
                <div>
                  <RushingStatsChartLazy
                    data={rushingDataOpponent}
                    title={`${opponent} Rushing`}
                    height={300}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </Container>
      )}

      {/* Receiving Leaders */}
      {(receivingDataClemson || receivingDataOpponent) && (
        <Container maxWidth="2xl" padding="md" className="py-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Receiving Leaders</CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              {receivingDataClemson && receivingDataClemson.length > 0 && (
                <div>
                  <ReceivingStatsChartLazy
                    data={receivingDataClemson}
                    title="Clemson Receiving"
                    height={300}
                  />
                </div>
              )}
              {receivingDataOpponent && receivingDataOpponent.length > 0 && (
                <div>
                  <ReceivingStatsChartLazy
                    data={receivingDataOpponent}
                    title={`${opponent} Receiving`}
                    height={300}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </Container>
      )}

      {/* Defensive Standouts */}
      {(defenseDataClemson || defenseDataOpponent) && (
        <Container maxWidth="2xl" padding="md" className="py-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Defensive Standouts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              {defenseDataClemson && defenseDataClemson.length > 0 && (
                <div>
                  <DefenseStatsChartLazy
                    data={defenseDataClemson}
                    title="Clemson Defense"
                    height={300}
                  />
                </div>
              )}
              {defenseDataOpponent && defenseDataOpponent.length > 0 && (
                <div>
                  <DefenseStatsChartLazy
                    data={defenseDataOpponent}
                    title={`${opponent} Defense`}
                    height={300}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </Container>
      )}

      {/* Game Content */}
      {content && (
        <Container maxWidth="2xl" padding="md" className="py-8">
          <Card>
            <CardContent className="pt-6 prose prose-slate max-w-none dark:prose-invert">
              <div dangerouslySetInnerHTML={{ __html: content }} />
            </CardContent>
          </Card>
        </Container>
      )}
    </div>
  );
}
