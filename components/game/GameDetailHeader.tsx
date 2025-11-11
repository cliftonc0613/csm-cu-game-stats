import type { GameFrontmatter } from '@/lib/markdown/types';
import { ScoreComparisonBar } from './ScoreComparisonBar';
import type { TeamSlug } from '@/components/ui/TeamLogo';

export interface GameDetailHeaderProps {
  /**
   * Game frontmatter data
   */
  frontmatter: GameFrontmatter;
  /**
   * Formatted game date string
   */
  formattedDate?: string;
  /**
   * Whether this was a win for Clemson
   */
  isWin: boolean;
  /**
   * Link to the games list page
   */
  gamesListLink?: string;
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * GameDetailHeader Component
 *
 * Displays the header section of a game detail page including:
 * - Opponent name and game title
 * - Game date and location
 * - Score comparison bar with team logos
 */
export function GameDetailHeader({
  frontmatter,
  formattedDate,
  isWin,
  gamesListLink = '/',
  className = '',
}: GameDetailHeaderProps) {
  // Format date if not provided
  const displayDate =
    formattedDate ||
    new Date(frontmatter.game_date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

  // Convert opponent name to slug for logo
  const opponentSlug = frontmatter.opponent.toLowerCase().replace(/\s+/g, '-') as TeamSlug;

  return (
    <div className={`bg-white rounded-lg shadow-sm p-6 ${className}`}>
      {/* Title Section */}
      <div className="text-center mb-6">
        <h1 className="text-4xl md:text-5xl font-bold mb-2 text-clemson-dark">
          Clemson vs {frontmatter.opponent}
        </h1>
        <p className="text-lg text-gray-600">{displayDate}</p>
        {frontmatter.location && (
          <p className="text-sm text-gray-500 mt-1">{frontmatter.location}</p>
        )}
      </div>

      {/* Score Comparison Bar */}
      <ScoreComparisonBar
        clemson={{
          score: frontmatter.score.clemson,
        }}
        opponent={{
          name: frontmatter.opponent,
          score: frontmatter.score.opponent,
          teamSlug: opponentSlug,
        }}
        winStreak={'win_streak' in frontmatter ? frontmatter.win_streak : undefined}
        isWin={isWin}
        gamesListLink={gamesListLink}
      />
    </div>
  );
}

/**
 * Compact variant of GameDetailHeader for mobile/smaller displays
 */
export function GameDetailHeaderCompact({
  frontmatter,
  isWin,
  className = '',
}: Omit<GameDetailHeaderProps, 'formattedDate' | 'gamesListLink'>) {
  const result =
    frontmatter.score.clemson > frontmatter.score.opponent
      ? 'W'
      : frontmatter.score.clemson < frontmatter.score.opponent
        ? 'L'
        : 'T';

  const gameDate = new Date(frontmatter.game_date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className={`bg-white rounded-lg shadow-sm p-4 ${className}`}>
      <div className="flex items-center justify-between">
        {/* Game Info */}
        <div>
          <h2 className="text-lg font-bold text-clemson-dark">
            vs {frontmatter.opponent}
          </h2>
          <p className="text-sm text-gray-600">{gameDate}</p>
        </div>

        {/* Score */}
        <div className="text-right">
          <div className="flex items-center gap-2">
            <span
              className={`text-2xl font-bold ${
                isWin ? 'text-clemson-orange' : 'text-gray-500'
              }`}
            >
              {frontmatter.score.clemson}
            </span>
            <span className="text-xl text-gray-400">-</span>
            <span
              className={`text-2xl font-bold ${
                !isWin ? 'text-clemson-purple' : 'text-gray-500'
              }`}
            >
              {frontmatter.score.opponent}
            </span>
          </div>
          <span
            className={`inline-block text-xs font-bold px-2 py-1 rounded ${
              result === 'W'
                ? 'bg-green-100 text-green-800'
                : result === 'L'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-gray-100 text-gray-800'
            }`}
          >
            {result}
          </span>
        </div>
      </div>
    </div>
  );
}
