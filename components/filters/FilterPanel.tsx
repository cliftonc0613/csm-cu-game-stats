'use client';

import { useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { CLEMSON_COLORS } from '@/lib/constants/colors';

export interface FilterState {
  seasons: number[];
  opponents: string[];
  gameTypes: string[];
  contentTypes: string[];
}

export interface FilterPanelProps {
  availableSeasons?: number[];
  availableOpponents?: string[];
  onFilterChange: (filters: FilterState) => void;
  className?: string;
}

export function FilterPanel({
  availableSeasons = [],
  availableOpponents = [],
  onFilterChange,
  className = '',
}: FilterPanelProps) {
  const [filters, setFilters] = useState<FilterState>({
    seasons: [],
    opponents: [],
    gameTypes: [],
    contentTypes: [],
  });

  // Notify parent of filter changes
  useEffect(() => {
    onFilterChange(filters);
  }, [filters, onFilterChange]);

  const gameTypeOptions = [
    { value: 'regular_season', label: 'Regular Season' },
    { value: 'bowl', label: 'Bowl' },
    { value: 'playoff', label: 'Playoff' },
    { value: 'championship', label: 'Championship' },
  ];

  const contentTypeOptions = [
    { value: 'statistics', label: 'Statistics' },
    { value: 'evaluation', label: 'Evaluation' },
  ];

  const handleSeasonToggle = useCallback((season: number) => {
    setFilters((prev) => {
      const newSeasons = prev.seasons.includes(season)
        ? prev.seasons.filter((s) => s !== season)
        : [...prev.seasons, season];

      return { ...prev, seasons: newSeasons };
    });
  }, []);

  const handleOpponentToggle = useCallback((opponent: string) => {
    setFilters((prev) => {
      const newOpponents = prev.opponents.includes(opponent)
        ? prev.opponents.filter((o) => o !== opponent)
        : [...prev.opponents, opponent];

      return { ...prev, opponents: newOpponents };
    });
  }, []);

  const handleGameTypeToggle = useCallback((gameType: string) => {
    setFilters((prev) => {
      const newGameTypes = prev.gameTypes.includes(gameType)
        ? prev.gameTypes.filter((g) => g !== gameType)
        : [...prev.gameTypes, gameType];

      return { ...prev, gameTypes: newGameTypes };
    });
  }, []);

  const handleContentTypeToggle = useCallback((contentType: string) => {
    setFilters((prev) => {
      const newContentTypes = prev.contentTypes.includes(contentType)
        ? prev.contentTypes.filter((c) => c !== contentType)
        : [...prev.contentTypes, contentType];

      return { ...prev, contentTypes: newContentTypes };
    });
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters({
      seasons: [],
      opponents: [],
      gameTypes: [],
      contentTypes: [],
    });
  }, []);

  const hasActiveFilters =
    filters.seasons.length > 0 ||
    filters.opponents.length > 0 ||
    filters.gameTypes.length > 0 ||
    filters.contentTypes.length > 0;

  return (
    <div className={`rounded-lg border bg-white p-6 ${className}`}>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold" style={{ color: CLEMSON_COLORS.dark }}>
          Filters
        </h2>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearFilters}
            className="text-sm transition-colors hover:text-clemson-orange"
          >
            Clear All
          </Button>
        )}
      </div>

      <div className="space-y-6">
        {/* Season Filter */}
        {availableSeasons.length > 0 && (
          <div>
            <h3 className="mb-3 text-sm font-medium uppercase tracking-wider text-gray-700">
              Season
            </h3>
            <div className="flex flex-wrap gap-2">
              {availableSeasons.map((season) => (
                <button
                  key={season}
                  type="button"
                  onClick={() => handleSeasonToggle(season)}
                  className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                    filters.seasons.includes(season)
                      ? 'text-white'
                      : 'border bg-white text-gray-700 hover:border-clemson-orange hover:text-clemson-orange'
                  }`}
                  style={
                    filters.seasons.includes(season)
                      ? { backgroundColor: CLEMSON_COLORS.orange }
                      : undefined
                  }
                >
                  {season}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Opponent Filter */}
        {availableOpponents.length > 0 && (
          <div>
            <h3 className="mb-3 text-sm font-medium uppercase tracking-wider text-gray-700">
              Opponent
            </h3>
            <div className="flex flex-wrap gap-2">
              {availableOpponents.map((opponent) => (
                <button
                  key={opponent}
                  type="button"
                  onClick={() => handleOpponentToggle(opponent)}
                  className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                    filters.opponents.includes(opponent)
                      ? 'text-white'
                      : 'border bg-white text-gray-700 hover:border-clemson-orange hover:text-clemson-orange'
                  }`}
                  style={
                    filters.opponents.includes(opponent)
                      ? { backgroundColor: CLEMSON_COLORS.orange }
                      : undefined
                  }
                >
                  {opponent}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Game Type Filter */}
        <div>
          <h3 className="mb-3 text-sm font-medium uppercase tracking-wider text-gray-700">
            Game Type
          </h3>
          <div className="flex flex-wrap gap-2">
            {gameTypeOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleGameTypeToggle(option.value)}
                className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                  filters.gameTypes.includes(option.value)
                    ? 'text-white'
                    : 'border bg-white text-gray-700 hover:border-clemson-orange hover:text-clemson-orange'
                }`}
                style={
                  filters.gameTypes.includes(option.value)
                    ? { backgroundColor: CLEMSON_COLORS.orange }
                    : undefined
                }
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content Type Filter */}
        <div>
          <h3 className="mb-3 text-sm font-medium uppercase tracking-wider text-gray-700">
            Content Type
          </h3>
          <div className="flex flex-wrap gap-2">
            {contentTypeOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleContentTypeToggle(option.value)}
                className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                  filters.contentTypes.includes(option.value)
                    ? 'text-white'
                    : 'border bg-white text-gray-700 hover:border-clemson-orange hover:text-clemson-orange'
                }`}
                style={
                  filters.contentTypes.includes(option.value)
                    ? { backgroundColor: CLEMSON_COLORS.orange }
                    : undefined
                }
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
