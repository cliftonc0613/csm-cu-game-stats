import { NextResponse } from 'next/server';
import { getAllGamesAsListItems } from '@/lib/markdown/getAllGames';

export async function GET() {
  try {
    const games = await getAllGamesAsListItems({ validate: false });

    // Convert Date objects to ISO strings for JSON serialization
    const serializedGames = games.map((game) => ({
      ...game,
      gameDate: game.gameDate.toISOString(),
    }));

    return NextResponse.json(serializedGames);
  } catch (error) {
    console.error('Error fetching games:', error);
    return NextResponse.json(
      { error: 'Failed to fetch games' },
      { status: 500 }
    );
  }
}
