'use client';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export interface ScoreComparisonBarProps {
  /**
   * Team information for Clemson
   */
  clemson: {
    score: number;
    record?: string;
    logo?: string;
  };
  /**
   * Team information for opponent
   */
  opponent: {
    name: string;
    score: number;
    record?: string;
    logo?: string;
  };
  /**
   * Current win streak after this game (optional)
   */
  winStreak?: number;
  /**
   * Whether this game was a win for Clemson
   */
  isWin?: boolean;
  /**
   * Link to full games list page
   */
  gamesListLink?: string;
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * ScoreComparisonBar Component
 *
 * Displays a horizontal score comparison bar with:
 * - Team logos in circular containers on left/right edges
 * - Win-loss records displayed prominently
 * - Horizontal progress bar showing score distribution (orange vs purple sections)
 * - Current win streak text centered below bar
 * - "Full Games List Page" CTA button
 * - Fully responsive design
 */
export function ScoreComparisonBar({
  clemson,
  opponent,
  winStreak,
  isWin,
  gamesListLink = '/games',
  className,
}: ScoreComparisonBarProps) {
  // Calculate percentage widths based on scores
  const totalScore = clemson.score + opponent.score;
  const clemsonPercentage = totalScore > 0 ? (clemson.score / totalScore) * 100 : 50;
  const opponentPercentage = totalScore > 0 ? (opponent.score / totalScore) * 100 : 50;

  // Determine if Clemson won
  const clemsonWon = isWin ?? clemson.score > opponent.score;

  return (
    <div className={cn('w-full space-y-4', className)}>
      {/* Score Bar Container */}
      <div className="relative">
        {/* Team Logos and Records */}
        <div className="flex items-center justify-between mb-4">
          {/* Clemson Side */}
          <div className="flex items-center gap-3 md:gap-4">
            {/* Logo Circle */}
            <div className="relative w-12 h-12 md:w-16 md:h-16 rounded-full bg-clemson-orange flex items-center justify-center overflow-hidden shadow-lg">
              {clemson.logo ? (
                <img
                  src={clemson.logo}
                  alt="Clemson"
                  className="w-8 h-8 md:w-10 md:h-10 object-contain"
                />
              ) : (
                <span className="text-white font-bold text-lg md:text-xl">C</span>
              )}
            </div>
            {/* Record and Score */}
            <div className="flex flex-col">
              <span className="text-xs md:text-sm text-muted-foreground uppercase tracking-wide">
                Clemson
              </span>
              {clemson.record && (
                <span className="text-sm md:text-base font-semibold text-clemson-dark">
                  {clemson.record}
                </span>
              )}
              <span className="text-2xl md:text-3xl font-bold text-clemson-orange">
                {clemson.score}
              </span>
            </div>
          </div>

          {/* Opponent Side */}
          <div className="flex items-center gap-3 md:gap-4 flex-row-reverse">
            {/* Logo Circle */}
            <div className="relative w-12 h-12 md:w-16 md:h-16 rounded-full bg-clemson-purple flex items-center justify-center overflow-hidden shadow-lg">
              {opponent.logo ? (
                <img
                  src={opponent.logo}
                  alt={opponent.name}
                  className="w-8 h-8 md:w-10 md:h-10 object-contain"
                />
              ) : (
                <span className="text-white font-bold text-lg md:text-xl">
                  {opponent.name.charAt(0)}
                </span>
              )}
            </div>
            {/* Record and Score */}
            <div className="flex flex-col items-end">
              <span className="text-xs md:text-sm text-muted-foreground uppercase tracking-wide">
                {opponent.name}
              </span>
              {opponent.record && (
                <span className="text-sm md:text-base font-semibold text-clemson-dark">
                  {opponent.record}
                </span>
              )}
              <span className="text-2xl md:text-3xl font-bold text-clemson-purple">
                {opponent.score}
              </span>
            </div>
          </div>
        </div>

        {/* Horizontal Progress Bar */}
        <div className="relative h-8 md:h-10 w-full rounded-full overflow-hidden bg-muted shadow-inner">
          {/* Clemson Section (Orange) */}
          <div
            className="absolute left-0 top-0 h-full bg-clemson-orange transition-all duration-500 ease-out"
            style={{ width: `${clemsonPercentage}%` }}
            aria-label={`Clemson: ${clemsonPercentage.toFixed(1)}%`}
          />
          {/* Opponent Section (Purple) */}
          <div
            className="absolute right-0 top-0 h-full bg-clemson-purple transition-all duration-500 ease-out"
            style={{ width: `${opponentPercentage}%` }}
            aria-label={`${opponent.name}: ${opponentPercentage.toFixed(1)}%`}
          />
          {/* Score Labels on Bar */}
          <div className="absolute inset-0 flex items-center justify-between px-4 text-white font-bold text-sm md:text-base">
            <span className="drop-shadow-md">{clemson.score}</span>
            <span className="drop-shadow-md">{opponent.score}</span>
          </div>
        </div>
      </div>

      {/* Win Streak and CTA Container */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
        {/* Win Streak Text */}
        {winStreak !== undefined && winStreak > 0 && clemsonWon && (
          <div className="text-center sm:text-left">
            <p className="text-sm md:text-base text-muted-foreground">
              Current Win Streak:{' '}
              <span className="font-bold text-clemson-orange text-lg md:text-xl">
                {winStreak}
              </span>
              {' game'}
              {winStreak !== 1 ? 's' : ''}
            </p>
          </div>
        )}
        {(!winStreak || winStreak === 0 || !clemsonWon) && (
          <div className="text-center sm:text-left flex-1">
            <p className="text-sm md:text-base text-muted-foreground">
              {clemsonWon ? 'Clemson Win' : 'Clemson Loss'}
            </p>
          </div>
        )}

        {/* Full Games List CTA Button */}
        <Button
          asChild
          variant="default"
          size="lg"
          className="bg-clemson-orange hover:bg-clemson-orange/90 text-white font-semibold shadow-lg transition-transform hover:scale-105"
        >
          <a href={gamesListLink}>Full Games List Page</a>
        </Button>
      </div>
    </div>
  );
}
