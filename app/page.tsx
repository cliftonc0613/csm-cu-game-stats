'use client';

import { useEffect, useState, useMemo, Suspense } from 'react';
import { Container } from '@/components/ui/container';
import { SearchBar } from '@/components/search/SearchBar';
import { FilterPanel, FilterState } from '@/components/filters/FilterPanel';
import { GameListItem } from '@/components/game/GameListItem';
import { ComparisonSelector, useGameSelection } from '@/components/game/ComparisonSelector';
import { CLEMSON_COLORS } from '@/lib/constants/colors';
import type { GameListItem as GameListItemType } from '@/lib/markdown/types';

function HomePageContent() {
  const [games, setGames] = useState<GameListItemType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterState>({
    seasons: [],
    opponents: [],
    gameTypes: [],
    contentTypes: [],
  });

  // Game comparison selection
  const { selectedGames, toggleSelection, isMaxReached, clearSelection, canCompare, count } = useGameSelection();

  // Fetch games on mount
  useEffect(() => {
    async function fetchGames() {
      try {
        setError(null);
        const response = await fetch('/api/games');
        if (response.ok) {
          const data = await response.json();
          // Convert date strings back to Date objects
          const gamesWithDates = data.map((game: any) => ({
            ...game,
            gameDate: new Date(game.gameDate),
          }));
          setGames(gamesWithDates);
        } else {
          setError('Failed to load games. Please try again later.');
        }
      } catch (err) {
        console.error('Error fetching games:', err);
        setError('Unable to connect to the server. Please check your connection and try again.');
      } finally {
        setLoading(false);
      }
    }

    fetchGames();
  }, []);

  // Extract unique values for filters
  const availableSeasons = useMemo(() => {
    const seasons = new Set(games.map((game) => game.season));
    return Array.from(seasons).sort((a, b) => b - a);
  }, [games]);

  const availableOpponents = useMemo(() => {
    const opponents = new Set(games.map((game) => game.opponent));
    return Array.from(opponents).sort();
  }, [games]);

  // Filter and search games
  const filteredGames = useMemo(() => {
    let result = [...games];

    // Apply filters
    if (filters.seasons.length > 0) {
      result = result.filter((game) => filters.seasons.includes(game.season));
    }

    if (filters.opponents.length > 0) {
      result = result.filter((game) => filters.opponents.includes(game.opponent));
    }

    if (filters.gameTypes.length > 0) {
      result = result.filter((game) => filters.gameTypes.includes(game.gameType));
    }

    if (filters.contentTypes.length > 0) {
      result = result.filter((game) => filters.contentTypes.includes(game.contentType));
    }

    // Apply search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter((game) => {
        const opponent = game.opponent.toLowerCase();
        const opponentShort = game.opponentShort?.toLowerCase() || '';
        const dateStr = game.gameDate.toISOString().split('T')[0];
        const season = game.season.toString();

        return (
          opponent.includes(query) ||
          opponentShort.includes(query) ||
          dateStr.includes(query) ||
          season.includes(query)
        );
      });
    }

    return result;
  }, [games, filters, searchQuery]);

  // Calculate statistics
  const stats = useMemo(() => {
    const total = filteredGames.length;
    const wins = filteredGames.filter((game) => game.result === 'win').length;
    const losses = filteredGames.filter((game) => game.result === 'loss').length;
    const winPercentage = total > 0 ? ((wins / total) * 100).toFixed(1) : '0.0';

    return { total, wins, losses, winPercentage };
  }, [filteredGames]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div
            className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-gray-200"
            style={{
              borderTopColor: CLEMSON_COLORS.orange,
            }}
          />
          <p className="text-lg font-medium text-gray-600">Loading games...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center p-4">
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
          <h2 className="mb-2 text-2xl font-bold" style={{ color: CLEMSON_COLORS.dark }}>
            Unable to Load Games
          </h2>
          <p className="mb-6 text-gray-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="rounded-md px-6 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: CLEMSON_COLORS.orange }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div style={{ backgroundColor: CLEMSON_COLORS.orange }}>
        <Container maxWidth="2xl" padding="lg" className="py-12 text-white">
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
              Clemson Sports Statistics
            </h1>
            <p className="text-lg md:text-xl opacity-90 max-w-3xl mx-auto">
              Comprehensive Clemson Tigers athletics statistics and game data
            </p>
          </div>
        </Container>
      </div>

      {/* Stats Bar */}
      <div className="border-b bg-white shadow-sm">
        <Container maxWidth="2xl" padding="lg" className="py-6">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="text-center">
              <div className="text-3xl font-bold" style={{ color: CLEMSON_COLORS.orange }}>
                {stats.total}
              </div>
              <div className="text-sm text-gray-600">Total Games</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold" style={{ color: CLEMSON_COLORS.orange }}>
                {stats.wins}
              </div>
              <div className="text-sm text-gray-600">Wins</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold" style={{ color: CLEMSON_COLORS.purple }}>
                {stats.losses}
              </div>
              <div className="text-sm text-gray-600">Losses</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold" style={{ color: CLEMSON_COLORS.dark }}>
                {stats.winPercentage}%
              </div>
              <div className="text-sm text-gray-600">Win Rate</div>
            </div>
          </div>
        </Container>
      </div>

      {/* Main Content */}
      <Container maxWidth="2xl" padding="lg" className="py-8">
        <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
          {/* Sidebar - Filters */}
          <aside>
            <FilterPanel
              availableSeasons={availableSeasons}
              availableOpponents={availableOpponents}
              onFilterChange={setFilters}
            />
          </aside>

          {/* Main Content - Search and Games List */}
          <main>
            <div className="space-y-6">
              {/* Search Bar */}
              <SearchBar onSearch={setSearchQuery} className="w-full" />

              {/* Results Count */}
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  {filteredGames.length === games.length
                    ? `Showing all ${games.length} games`
                    : `Showing ${filteredGames.length} of ${games.length} games`}
                </p>
              </div>

              {/* Games List */}
              {filteredGames.length > 0 ? (
                <div className="space-y-4">
                  {filteredGames.map((game) => (
                    <GameListItem
                      key={game.slug}
                      slug={game.slug}
                      opponent={game.opponent}
                      opponentShort={game.opponentShort}
                      gameDate={game.gameDate.toISOString().split('T')[0]}
                      score={game.score}
                      season={game.season}
                      gameType={game.gameType as any}
                      homeAway={game.homeAway}
                      showComparisonCheckbox={true}
                      isSelectedForComparison={selectedGames.has(game.slug)}
                      isComparisonDisabled={isMaxReached && !selectedGames.has(game.slug)}
                      onComparisonToggle={toggleSelection}
                    />
                  ))}
                </div>
              ) : (
                /* Empty State */
                <div className="rounded-lg border-2 border-dashed border-gray-300 bg-white p-12 text-center">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <h3 className="mt-4 text-lg font-medium text-gray-900">No games found</h3>
                  <p className="mt-2 text-sm text-gray-600">
                    Try adjusting your search query or filters to find what you're looking for.
                  </p>
                </div>
              )}
            </div>
          </main>
        </div>
      </Container>

      {/* Comparison Selector - Sticky bottom bar */}
      <ComparisonSelector
        selectedGames={selectedGames}
        clearSelection={clearSelection}
        canCompare={canCompare}
        count={count}
      />
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="text-center">
            <div
              className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-gray-200"
              style={{
                borderTopColor: CLEMSON_COLORS.orange,
              }}
            />
            <p className="text-lg font-medium text-gray-600">Loading...</p>
          </div>
        </div>
      }
    >
      <HomePageContent />
    </Suspense>
  );
}
