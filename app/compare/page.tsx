import Link from 'next/link';
import { Metadata } from 'next';
import { getGameBySlug } from '@/lib/markdown/getGameBySlug';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { Container } from '@/components/ui/container';
import { GameDetailHeaderCompact } from '@/components/game/GameDetailHeader';
import { GameMetadataCompact } from '@/components/game/GameMetadata';
import { CLEMSON_COLORS } from '@/lib/constants/colors';
import type { ParsedGame, GameStatsFrontmatter } from '@/lib/markdown/types';
import { ArrowLeft } from 'lucide-react';

interface ComparePageProps {
  searchParams: Promise<{ games?: string }>;
}

/**
 * Generate metadata for comparison page
 */
export async function generateMetadata({
  searchParams,
}: ComparePageProps): Promise<Metadata> {
  const { games: gamesParam } = await searchParams;

  if (!gamesParam) {
    return {
      title: 'Game Comparison',
      description: 'Compare multiple Clemson game statistics side-by-side',
    };
  }

  const slugs = gamesParam.split(',').filter(Boolean).slice(0, 4);

  return {
    title: `Compare ${slugs.length} Games - Clemson Statistics`,
    description: `Side-by-side comparison of ${slugs.length} Clemson football games`,
  };
}

/**
 * Game Comparison Page
 *
 * Displays 2-4 games side-by-side for comparison with:
 * - Game headers showing opponent and score
 * - Key metadata (attendance, weather, location)
 * - Statistical difference highlighting
 * - Responsive layout
 */
export default async function ComparePage({ searchParams }: ComparePageProps) {
  const { games: gamesParam } = await searchParams;

  // Validate games parameter
  if (!gamesParam) {
    return <ComparisonError message="No games selected for comparison" />;
  }

  // Parse slugs (limit to 4 games max)
  const slugs = gamesParam.split(',').filter(Boolean).slice(0, 4);

  // Validate minimum games
  if (slugs.length < 2) {
    return (
      <ComparisonError message="Please select at least 2 games to compare" />
    );
  }

  // Fetch game data for all slugs
  const gamesData: (ParsedGame<GameStatsFrontmatter> | null)[] = await Promise.all(
    slugs.map(async (slug) => {
      try {
        const game = await getGameBySlug(slug, { validate: false });
        // Only include games with statistics content type
        if (game && game.frontmatter.content_type === 'statistics') {
          return game as ParsedGame<GameStatsFrontmatter>;
        }
        return null;
      } catch (error) {
        console.error(`Error fetching game ${slug}:`, error);
        return null;
      }
    })
  );

  // Filter out null values (invalid slugs or non-statistics games)
  const validGames = gamesData.filter(
    (game): game is ParsedGame<GameStatsFrontmatter> => game !== null
  );

  // Validate we have enough valid games
  if (validGames.length < 2) {
    return (
      <ComparisonError message="Could not load enough valid games for comparison. Please check your selection." />
    );
  }

  // Breadcrumbs
  const breadcrumbItems = [
    { label: 'Games', href: '/' },
    { label: 'Compare Games' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Container maxWidth="2xl" padding="lg" className="py-8">
        {/* Header Section */}
        <div className="mb-6">
          <Breadcrumbs items={breadcrumbItems} className="mb-4" />

          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl md:text-4xl font-bold" style={{ color: CLEMSON_COLORS.dark }}>
              Game Comparison
            </h1>

            <Link
              href="/"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: CLEMSON_COLORS.orange }}
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Back to Games</span>
            </Link>
          </div>

          <p className="text-gray-600">
            Comparing {validGames.length} game{validGames.length !== 1 ? 's' : ''} side-by-side
          </p>
        </div>

        {/* Comparison Grid */}
        <div
          className={`grid gap-6 ${
            validGames.length === 2
              ? 'md:grid-cols-2'
              : validGames.length === 3
                ? 'md:grid-cols-3'
                : 'md:grid-cols-2 lg:grid-cols-4'
          }`}
        >
          {validGames.map((game) => {
            const isWin = game.frontmatter.score.clemson > game.frontmatter.score.opponent;

            return (
              <div key={game.slug} className="flex flex-col">
                {/* Game Header */}
                <GameDetailHeaderCompact
                  frontmatter={game.frontmatter}
                  isWin={isWin}
                  className="mb-4"
                />

                {/* Game Metadata */}
                <GameMetadataCompact
                  frontmatter={game.frontmatter}
                  className="mb-4"
                />

                {/* Link to Full Game */}
                <Link
                  href={`/games/${game.slug}`}
                  className="mt-auto text-center px-4 py-2 rounded-md text-sm font-medium border-2 transition-all hover:shadow-md"
                  style={{
                    borderColor: CLEMSON_COLORS.orange,
                    color: CLEMSON_COLORS.orange,
                  }}
                >
                  View Full Stats
                </Link>
              </div>
            );
          })}
        </div>

        {/* Score Comparison Section */}
        <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-bold mb-4" style={{ color: CLEMSON_COLORS.dark }}>
            Score Comparison
          </h2>
          <ScoreComparisonTable games={validGames} />
        </div>

        {/* Quick Stats Comparison */}
        <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-bold mb-4" style={{ color: CLEMSON_COLORS.dark }}>
            Quick Stats
          </h2>
          <QuickStatsTable games={validGames} />
        </div>
      </Container>
    </div>
  );
}

/**
 * Score Comparison Table Component
 */
function ScoreComparisonTable({
  games,
}: {
  games: ParsedGame<GameStatsFrontmatter>[];
}) {
  // Find highest Clemson score
  const highestClemsonScore = Math.max(
    ...games.map((g) => g.frontmatter.score.clemson)
  );

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b-2" style={{ borderColor: CLEMSON_COLORS.orange }}>
            <th className="text-left py-3 px-4 font-semibold text-gray-700">
              Metric
            </th>
            {games.map((game) => (
              <th
                key={game.slug}
                className="text-center py-3 px-4 font-semibold text-gray-700"
              >
                vs {game.frontmatter.opponent_short || game.frontmatter.opponent}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-gray-200">
            <td className="py-3 px-4 font-medium text-gray-700">Clemson Score</td>
            {games.map((game) => {
              const isHighest = game.frontmatter.score.clemson === highestClemsonScore;
              return (
                <td
                  key={game.slug}
                  className={`text-center py-3 px-4 font-bold ${
                    isHighest ? 'text-2xl' : 'text-xl'
                  }`}
                  style={{
                    color: isHighest ? CLEMSON_COLORS.orange : CLEMSON_COLORS.dark,
                  }}
                >
                  {game.frontmatter.score.clemson}
                </td>
              );
            })}
          </tr>
          <tr className="border-b border-gray-200">
            <td className="py-3 px-4 font-medium text-gray-700">Opponent Score</td>
            {games.map((game) => (
              <td
                key={game.slug}
                className="text-center py-3 px-4 text-xl font-bold text-gray-600"
              >
                {game.frontmatter.score.opponent}
              </td>
            ))}
          </tr>
          <tr className="border-b border-gray-200">
            <td className="py-3 px-4 font-medium text-gray-700">Point Differential</td>
            {games.map((game) => {
              const diff = game.frontmatter.score.clemson - game.frontmatter.score.opponent;
              const isWin = diff > 0;
              return (
                <td
                  key={game.slug}
                  className="text-center py-3 px-4 font-bold"
                  style={{
                    color: isWin ? CLEMSON_COLORS.orange : CLEMSON_COLORS.purple,
                  }}
                >
                  {diff > 0 ? '+' : ''}
                  {diff}
                </td>
              );
            })}
          </tr>
          <tr>
            <td className="py-3 px-4 font-medium text-gray-700">Result</td>
            {games.map((game) => {
              const isWin = game.frontmatter.score.clemson > game.frontmatter.score.opponent;
              return (
                <td key={game.slug} className="text-center py-3 px-4">
                  <span
                    className="inline-block px-3 py-1 rounded-full text-sm font-bold text-white"
                    style={{
                      backgroundColor: isWin ? CLEMSON_COLORS.orange : CLEMSON_COLORS.purple,
                    }}
                  >
                    {isWin ? 'WIN' : 'LOSS'}
                  </span>
                </td>
              );
            })}
          </tr>
        </tbody>
      </table>
    </div>
  );
}

/**
 * Quick Stats Table Component
 */
function QuickStatsTable({
  games,
}: {
  games: ParsedGame<GameStatsFrontmatter>[];
}) {
  // Find highest attendance
  const highestAttendance = Math.max(
    ...games.map((g) => g.frontmatter.attendance || 0)
  );

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b-2" style={{ borderColor: CLEMSON_COLORS.orange }}>
            <th className="text-left py-3 px-4 font-semibold text-gray-700">
              Attribute
            </th>
            {games.map((game) => (
              <th
                key={game.slug}
                className="text-center py-3 px-4 font-semibold text-gray-700"
              >
                vs {game.frontmatter.opponent_short || game.frontmatter.opponent}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-gray-200">
            <td className="py-3 px-4 font-medium text-gray-700">Season</td>
            {games.map((game) => (
              <td key={game.slug} className="text-center py-3 px-4 text-gray-600">
                {game.frontmatter.season}
              </td>
            ))}
          </tr>
          <tr className="border-b border-gray-200">
            <td className="py-3 px-4 font-medium text-gray-700">Date</td>
            {games.map((game) => (
              <td key={game.slug} className="text-center py-3 px-4 text-gray-600">
                {new Date(game.frontmatter.game_date).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </td>
            ))}
          </tr>
          <tr className="border-b border-gray-200">
            <td className="py-3 px-4 font-medium text-gray-700">Location</td>
            {games.map((game) => {
              const locationLabel =
                game.frontmatter.home_away === 'home'
                  ? 'Home'
                  : game.frontmatter.home_away === 'away'
                    ? 'Away'
                    : 'Neutral';
              return (
                <td key={game.slug} className="text-center py-3 px-4 text-gray-600">
                  {locationLabel}
                </td>
              );
            })}
          </tr>
          <tr className="border-b border-gray-200">
            <td className="py-3 px-4 font-medium text-gray-700">Game Type</td>
            {games.map((game) => {
              const gameTypeLabel = game.frontmatter.game_type
                .split('_')
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');
              return (
                <td key={game.slug} className="text-center py-3 px-4 text-gray-600">
                  {gameTypeLabel}
                </td>
              );
            })}
          </tr>
          {games.some((g) => g.frontmatter.attendance) && (
            <tr>
              <td className="py-3 px-4 font-medium text-gray-700">Attendance</td>
              {games.map((game) => {
                const attendance = game.frontmatter.attendance;
                const isHighest = attendance === highestAttendance && attendance > 0;
                return (
                  <td
                    key={game.slug}
                    className={`text-center py-3 px-4 ${
                      isHighest ? 'font-bold' : ''
                    }`}
                    style={{
                      color: isHighest ? CLEMSON_COLORS.orange : 'rgb(75, 85, 99)',
                    }}
                  >
                    {attendance ? attendance.toLocaleString() : 'N/A'}
                  </td>
                );
              })}
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

/**
 * Error State Component for comparison page
 */
function ComparisonError({ message }: { message: string }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Container maxWidth="2xl" padding="lg" className="py-8">
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="max-w-md text-center">
            <div
              className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full"
              style={{ backgroundColor: CLEMSON_COLORS.purple }}
            >
              <svg
                className="h-10 w-10 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h2
              className="mb-2 text-2xl font-bold"
              style={{ color: CLEMSON_COLORS.dark }}
            >
              Cannot Compare Games
            </h2>
            <p className="mb-6 text-gray-600">{message}</p>
            <Link
              href="/"
              className="inline-block rounded-md px-6 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: CLEMSON_COLORS.orange }}
            >
              Go to Games List
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
