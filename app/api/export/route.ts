/**
 * Export API Route
 *
 * Handles exporting game data in various formats (CSV, etc.)
 * GET /api/export?slug=game-slug&format=csv
 */

import { NextRequest, NextResponse } from 'next/server';
import { getGameBySlug } from '@/lib/markdown/getGameBySlug';
import { getAllGames } from '@/lib/markdown/getAllGames';
import {
  gameToCSV,
  gamesToCSV,
  createCSVDownload,
  gameMetadataToCSV,
} from '@/lib/export/csv';

/**
 * Supported export formats
 */
type ExportFormat = 'csv' | 'metadata-csv' | 'tables-csv';

/**
 * Supported export types
 */
type ExportType = 'single' | 'all' | 'season';

/**
 * GET /api/export
 *
 * Query parameters:
 * - slug: Game slug (required for single game export)
 * - format: Export format (csv, metadata-csv, tables-csv) - default: csv
 * - type: Export type (single, all, season) - default: single
 * - season: Season year (required if type=season)
 *
 * Examples:
 * - /api/export?slug=2024-09-07-appalachian-state&format=csv
 * - /api/export?type=all&format=metadata-csv
 * - /api/export?type=season&season=2024&format=csv
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    // Get query parameters
    const slug = searchParams.get('slug');
    const format = (searchParams.get('format') || 'csv') as ExportFormat;
    const type = (searchParams.get('type') || 'single') as ExportType;
    const season = searchParams.get('season');

    // Validate format
    if (!['csv', 'metadata-csv', 'tables-csv'].includes(format)) {
      return NextResponse.json(
        { error: 'Invalid format. Supported formats: csv, metadata-csv, tables-csv' },
        { status: 400 }
      );
    }

    // Validate type
    if (!['single', 'all', 'season'].includes(type)) {
      return NextResponse.json(
        { error: 'Invalid type. Supported types: single, all, season' },
        { status: 400 }
      );
    }

    // Handle single game export
    if (type === 'single') {
      if (!slug) {
        return NextResponse.json(
          { error: 'Missing required parameter: slug' },
          { status: 400 }
        );
      }

      // Fetch the game
      const game = await getGameBySlug(slug, { validate: false });

      if (!game) {
        return NextResponse.json(
          { error: `Game not found: ${slug}` },
          { status: 404 }
        );
      }

      // Generate CSV based on format
      let csvContent: string;
      let filename: string;

      if (format === 'metadata-csv') {
        // Export only metadata
        csvContent = gameMetadataToCSV(game);
        filename = `${slug}-metadata.csv`;
      } else if (format === 'tables-csv') {
        // Export only tables
        const { tables } = gameToCSV(game);
        if (tables.length === 0) {
          return NextResponse.json(
            { error: 'No tables found in game content' },
            { status: 404 }
          );
        }
        // Combine all tables with double newline separator
        csvContent = tables.join('\n\n');
        filename = `${slug}-tables.csv`;
      } else {
        // Export full game (metadata + tables)
        const { metadata, tables } = gameToCSV(game);
        csvContent = `# Game Metadata\n${metadata}\n\n# Game Statistics Tables\n${tables.join('\n\n')}`;
        filename = `${slug}.csv`;
      }

      // Create download
      const download = createCSVDownload(csvContent, filename);

      // Return CSV file
      return new NextResponse(download.content, {
        status: 200,
        headers: download.headers,
      });
    }

    // Handle all games export
    if (type === 'all') {
      const games = await getAllGames({ validate: false });

      if (games.length === 0) {
        return NextResponse.json(
          { error: 'No games found' },
          { status: 404 }
        );
      }

      // Export all games metadata
      const csvContent = gamesToCSV(games);
      const filename = 'all-games.csv';
      const download = createCSVDownload(csvContent, filename);

      return new NextResponse(download.content, {
        status: 200,
        headers: download.headers,
      });
    }

    // Handle season export
    if (type === 'season') {
      if (!season) {
        return NextResponse.json(
          { error: 'Missing required parameter: season' },
          { status: 400 }
        );
      }

      const seasonYear = parseInt(season, 10);
      if (isNaN(seasonYear)) {
        return NextResponse.json(
          { error: 'Invalid season year. Must be a number.' },
          { status: 400 }
        );
      }

      // Fetch all games and filter by season
      const allGames = await getAllGames({ validate: false });
      const seasonGames = allGames.filter((game) => game.frontmatter.season === seasonYear);

      if (seasonGames.length === 0) {
        return NextResponse.json(
          { error: `No games found for season ${seasonYear}` },
          { status: 404 }
        );
      }

      // Export season games metadata
      const csvContent = gamesToCSV(seasonGames);
      const filename = `${seasonYear}-season.csv`;
      const download = createCSVDownload(csvContent, filename);

      return new NextResponse(download.content, {
        status: 200,
        headers: download.headers,
      });
    }

    // Should never reach here
    return NextResponse.json(
      { error: 'Invalid request' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error in export API:', error);

    return NextResponse.json(
      {
        error: 'Failed to export data',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
