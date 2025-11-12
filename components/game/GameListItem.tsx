'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import Link from 'next/link';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { CLEMSON_COLORS } from '@/lib/constants/colors';
import type { GameScore } from '@/lib/markdown/types';
import { GameCheckbox } from './ComparisonSelector';
import { fadeInUp } from '@/lib/utils/animations';

export interface GameListItemProps {
  slug: string;
  opponent: string;
  opponentShort?: string;
  gameDate: string;
  score: GameScore;
  season: number;
  gameType: 'regular_season' | 'bowl' | 'playoff' | 'championship';
  homeAway: 'home' | 'away' | 'neutral';
  className?: string;
  /**
   * Whether to show comparison checkbox
   * @default false
   */
  showComparisonCheckbox?: boolean;
  /**
   * Whether this game is selected for comparison
   */
  isSelectedForComparison?: boolean;
  /**
   * Whether comparison selection is disabled
   */
  isComparisonDisabled?: boolean;
  /**
   * Callback when comparison checkbox is toggled
   */
  onComparisonToggle?: (slug: string) => void;
}

export function GameListItem({
  slug,
  opponent,
  opponentShort,
  gameDate,
  score,
  season,
  gameType,
  homeAway,
  className = '',
  showComparisonCheckbox = false,
  isSelectedForComparison = false,
  isComparisonDisabled = false,
  onComparisonToggle,
}: GameListItemProps) {
  const itemRef = useRef<HTMLDivElement>(null);
  const isWin = score.clemson > score.opponent;
  const displayOpponent = opponentShort || opponent;

  // Scroll reveal animation
  useGSAP(
    () => {
      if (itemRef.current) {
        fadeInUp(itemRef.current, {
          duration: 0.4,
          y: 20,
        });
      }
    },
    { scope: itemRef }
  );

  // Format date
  const formattedDate = new Date(gameDate).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  // Format game type
  const gameTypeLabels: Record<string, string> = {
    regular_season: 'Regular Season',
    bowl: 'Bowl Game',
    playoff: 'Playoff',
    championship: 'Championship',
  };

  return (
    <div ref={itemRef} className={`relative ${className}`}>
      <Link href={`/games/${slug}`} className="block">
        <Card
          className="transition-all hover:shadow-lg hover:border-clemson-orange"
        >
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              {/* Opponent Info */}
              <div className="flex items-center space-x-3">
                {/* Logo Placeholder */}
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-lg font-bold"
                  style={{ color: CLEMSON_COLORS.purple }}
                >
                  {displayOpponent.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-lg font-bold" style={{ color: CLEMSON_COLORS.dark }}>
                    vs {displayOpponent}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {gameTypeLabels[gameType]} • {homeAway === 'home' ? 'Home' : homeAway === 'away' ? 'Away' : 'Neutral'}
                  </p>
                </div>
              </div>

              {/* Right side: Checkbox + Result Badge */}
              <div className="flex items-center gap-3">
                {/* Comparison Checkbox */}
                {showComparisonCheckbox && onComparisonToggle && (
                  <div onClick={(e) => e.stopPropagation()}>
                    <GameCheckbox
                      slug={slug}
                      isSelected={isSelectedForComparison}
                      isDisabled={isComparisonDisabled}
                      onToggle={onComparisonToggle}
                    />
                  </div>
                )}

                {/* Result Badge */}
                <div
                  className="rounded-full px-3 py-1 text-sm font-bold text-white"
                  style={{
                    backgroundColor: isWin ? CLEMSON_COLORS.orange : CLEMSON_COLORS.purple,
                  }}
                >
                  {isWin ? 'W' : 'L'}
                </div>
              </div>
            </div>
          </CardHeader>

        <CardContent>
          <div className="flex items-center justify-between">
            {/* Score Display */}
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <div className="text-xs font-medium uppercase text-gray-500">Clemson</div>
                <div
                  className="text-3xl font-bold"
                  style={{ color: isWin ? CLEMSON_COLORS.orange : CLEMSON_COLORS.dark }}
                >
                  {score.clemson}
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-400">-</div>
              <div className="text-center">
                <div className="text-xs font-medium uppercase text-gray-500">{displayOpponent}</div>
                <div
                  className="text-3xl font-bold"
                  style={{ color: !isWin ? CLEMSON_COLORS.purple : CLEMSON_COLORS.dark }}
                >
                  {score.opponent}
                </div>
              </div>
            </div>

            {/* Date and Season */}
            <div className="text-right">
              <div className="text-sm font-medium" style={{ color: CLEMSON_COLORS.dark }}>
                {formattedDate}
              </div>
              <div className="text-xs text-gray-500">{season} Season</div>
            </div>
          </div>
        </CardContent>
        </Card>
      </Link>
    </div>
  );
}
