'use client';

/**
 * ComparisonSelector Component
 *
 * Enables multi-game selection for side-by-side comparison with:
 * - Checkboxes for selecting multiple games
 * - Selection counter and clear button
 * - "Compare Selected Games" CTA button
 * - URL params for shareable comparison links
 * - Min/max selection limits (2-4 games)
 */

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { GitCompare, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ComparisonSelectorProps {
  /**
   * Optional className for styling
   */
  className?: string;
  /**
   * Minimum number of games required for comparison
   * @default 2
   */
  minGames?: number;
  /**
   * Maximum number of games allowed for comparison
   * @default 4
   */
  maxGames?: number;
  /**
   * Callback when selection changes
   */
  onSelectionChange?: (selectedSlugs: string[]) => void;
}

/**
 * Hook for managing game selection state
 * Syncs with URL params for shareable links
 */
export function useGameSelection(minGames = 2, maxGames = 4) {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Initialize from URL params
  const [selectedGames, setSelectedGames] = useState<Set<string>>(() => {
    const params = searchParams.get('compare');
    if (params) {
      const slugs = params.split(',').filter(Boolean).slice(0, maxGames);
      return new Set(slugs);
    }
    return new Set();
  });

  // Update URL when selection changes
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const currentCompare = params.get('compare');
    const newCompare = selectedGames.size > 0 ? Array.from(selectedGames).join(',') : null;

    // Only update URL if the compare param actually changed
    if (currentCompare !== newCompare) {
      if (newCompare) {
        params.set('compare', newCompare);
      } else {
        params.delete('compare');
      }

      const newUrl = params.toString() ? `?${params.toString()}` : '';
      router.replace(newUrl, { scroll: false });
    }
  }, [selectedGames, router]);

  const toggleSelection = (slug: string) => {
    setSelectedGames((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) {
        next.delete(slug);
      } else if (next.size < maxGames) {
        next.add(slug);
      }
      return next;
    });
  };

  const clearSelection = () => {
    setSelectedGames(new Set());
  };

  const canCompare = selectedGames.size >= minGames && selectedGames.size <= maxGames;
  const isMaxReached = selectedGames.size >= maxGames;

  return {
    selectedGames,
    toggleSelection,
    clearSelection,
    canCompare,
    isMaxReached,
    count: selectedGames.size,
  };
}

/**
 * Checkbox for selecting a game for comparison
 */
export interface GameCheckboxProps {
  /**
   * Game slug
   */
  slug: string;
  /**
   * Whether this game is selected
   */
  isSelected: boolean;
  /**
   * Whether selection is disabled (max reached)
   */
  isDisabled: boolean;
  /**
   * Toggle selection callback
   */
  onToggle: (slug: string) => void;
  /**
   * Optional className
   */
  className?: string;
}

export function GameCheckbox({
  slug,
  isSelected,
  isDisabled,
  onToggle,
  className,
}: GameCheckboxProps) {
  const handleChange = () => {
    if (!isDisabled || isSelected) {
      onToggle(slug);
    }
  };

  return (
    <div className={cn('flex items-center', className)}>
      <input
        type="checkbox"
        id={`game-compare-${slug}`}
        checked={isSelected}
        onChange={handleChange}
        disabled={isDisabled && !isSelected}
        className={cn(
          'h-4 w-4 rounded border-gray-300 text-clemson-orange',
          'focus:ring-2 focus:ring-clemson-orange focus:ring-offset-2',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'cursor-pointer'
        )}
        aria-label={`Select ${slug} for comparison`}
      />
      <label
        htmlFor={`game-compare-${slug}`}
        className={cn(
          'ml-2 text-sm font-medium text-gray-700',
          'cursor-pointer select-none',
          isDisabled && !isSelected && 'opacity-50 cursor-not-allowed'
        )}
      >
        Compare
      </label>
    </div>
  );
}

/**
 * ComparisonSelector Component
 * Sticky bar showing selected games and comparison CTA
 */
export function ComparisonSelector({
  className,
  minGames = 2,
  maxGames = 4,
  selectedGames,
  clearSelection,
  canCompare,
  count,
}: ComparisonSelectorProps & {
  selectedGames: Set<string>;
  clearSelection: () => void;
  canCompare: boolean;
  count: number;
}) {
  const router = useRouter();

  const handleCompare = () => {
    if (canCompare) {
      const slugs = Array.from(selectedGames).join(',');
      router.push(`/compare?games=${slugs}`);
    }
  };

  // Don't show selector if no games selected
  if (count === 0) {
    return null;
  }

  return (
    <div
      className={cn(
        'sticky bottom-0 left-0 right-0 z-50',
        'bg-white border-t-2 border-clemson-orange shadow-lg',
        'animate-in slide-in-from-bottom duration-300',
        className
      )}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Selection Info */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <GitCompare className="h-5 w-5 text-clemson-orange" />
              <span className="font-semibold text-gray-900">
                {count} game{count !== 1 ? 's' : ''} selected
              </span>
            </div>

            {/* Helper Text */}
            <div className="text-sm text-gray-600">
              {count < minGames && (
                <span>Select at least {minGames} games to compare</span>
              )}
              {count >= minGames && count <= maxGames && (
                <span>Ready to compare</span>
              )}
              {count === maxGames && (
                <span className="text-clemson-orange font-medium">
                  Maximum {maxGames} games reached
                </span>
              )}
            </div>

            {/* Clear Button */}
            <button
              onClick={clearSelection}
              className={cn(
                'inline-flex items-center gap-1 text-sm text-gray-600',
                'hover:text-gray-900 transition-colors',
                'focus:outline-none focus:ring-2 focus:ring-clemson-orange focus:ring-offset-2 rounded-md px-2 py-1'
              )}
              aria-label="Clear selection"
            >
              <X className="h-4 w-4" />
              <span className="hidden sm:inline">Clear</span>
            </button>
          </div>

          {/* Compare Button */}
          <button
            onClick={handleCompare}
            disabled={!canCompare}
            className={cn(
              'inline-flex items-center justify-center gap-2 px-6 py-3',
              'font-semibold rounded-lg transition-all',
              'focus:outline-none focus:ring-2 focus:ring-offset-2',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              canCompare && 'hover:opacity-90 hover:shadow-lg cursor-pointer'
            )}
            style={{
              backgroundColor: canCompare ? '#F56600' : '#d1d5db',
              color: canCompare ? 'white' : '#6b7280',
            }}
            aria-label="Compare selected games"
          >
            <GitCompare className="h-5 w-5" />
            <span>Compare Selected Games</span>
          </button>
        </div>

        {/* Progress Indicator */}
        <div className="mt-3">
          <div className="flex gap-1">
            {Array.from({ length: maxGames }).map((_, i) => (
              <div
                key={i}
                className={cn(
                  'h-1 flex-1 rounded-full transition-all',
                  i < count ? 'bg-clemson-orange' : 'bg-gray-200'
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
