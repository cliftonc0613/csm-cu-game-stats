import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getGameBySlug, getAllGameSlugs } from '@/lib/markdown/getGameBySlug';

/**
 * Generate static params for all game pages at build time
 * This enables Static Site Generation (SSG) for all game detail pages
 */
export async function generateStaticParams() {
  try {
    // Get all game slugs from markdown files
    const slugs = await getAllGameSlugs({ includeEvaluations: false });

    // Return array of params objects for Next.js
    return slugs.map((slug) => ({
      slug,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

/**
 * Generate metadata for each game page (SEO)
 */
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  try {
    const game = await getGameBySlug(params.slug, { validate: false });

    if (!game) {
      return {
        title: 'Game Not Found',
        description: 'The requested game could not be found.',
      };
    }

    const { frontmatter } = game;
    const gameDate = new Date(frontmatter.game_date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    const result =
      frontmatter.score.clemson > frontmatter.score.opponent
        ? 'W'
        : frontmatter.score.clemson < frontmatter.score.opponent
          ? 'L'
          : 'T';

    const title = `Clemson vs ${frontmatter.opponent} - ${gameDate} (${result} ${frontmatter.score.clemson}-${frontmatter.score.opponent})`;
    const description = `Game statistics and details for Clemson vs ${frontmatter.opponent} on ${gameDate}. Final score: Clemson ${frontmatter.score.clemson}, ${frontmatter.opponent} ${frontmatter.score.opponent}.`;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        type: 'article',
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Game Details',
      description: 'Clemson game statistics and details',
    };
  }
}

/**
 * Game Detail Page Component
 * Displays comprehensive statistics and information for a single game
 */
export default async function GameDetailPage({ params }: { params: { slug: string } }) {
  // Fetch game data by slug
  const game = await getGameBySlug(params.slug, { validate: true });

  // Handle 404 for invalid slugs
  if (!game) {
    notFound();
  }

  const { frontmatter, content } = game;

  // Format date for display
  const gameDate = new Date(frontmatter.game_date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Determine game result
  const result =
    frontmatter.score.clemson > frontmatter.score.opponent
      ? 'W'
      : frontmatter.score.clemson < frontmatter.score.opponent
        ? 'L'
        : 'T';

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Temporary basic layout - will be enhanced in Task 6.2 */}
      <div className="max-w-4xl mx-auto">
        {/* Game Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            Clemson vs {frontmatter.opponent}
          </h1>
          <p className="text-lg text-gray-600">{gameDate}</p>
          {frontmatter.location && (
            <p className="text-sm text-gray-500">{frontmatter.location}</p>
          )}
        </div>

        {/* Score Display */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="text-center flex-1">
              <h2 className="text-2xl font-bold mb-2">Clemson</h2>
              <div className="text-5xl font-extrabold text-clemson-orange">
                {frontmatter.score.clemson}
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-400 mx-4">-</div>
            <div className="text-center flex-1">
              <h2 className="text-2xl font-bold mb-2">{frontmatter.opponent}</h2>
              <div className="text-5xl font-extrabold text-clemson-purple">
                {frontmatter.score.opponent}
              </div>
            </div>
          </div>
          <div className="text-center mt-4">
            <span
              className={`inline-block px-4 py-2 rounded-full text-white font-bold ${
                result === 'W'
                  ? 'bg-green-600'
                  : result === 'L'
                    ? 'bg-red-600'
                    : 'bg-gray-600'
              }`}
            >
              {result === 'W' ? 'WIN' : result === 'L' ? 'LOSS' : 'TIE'}
            </span>
          </div>
        </div>

        {/* Game Metadata */}
        {frontmatter.content_type === 'statistics' &&
          ('attendance' in frontmatter ||
            'weather' in frontmatter ||
            'win_streak' in frontmatter) && (
            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <h3 className="text-xl font-bold mb-4">Game Information</h3>
              <dl className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {'attendance' in frontmatter && frontmatter.attendance && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Attendance</dt>
                    <dd className="text-lg font-semibold">
                      {frontmatter.attendance.toLocaleString()}
                    </dd>
                  </div>
                )}
                {'weather' in frontmatter && frontmatter.weather && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Weather</dt>
                    <dd className="text-lg font-semibold">{frontmatter.weather}</dd>
                  </div>
                )}
                {'win_streak' in frontmatter &&
                  frontmatter.win_streak &&
                  frontmatter.win_streak > 0 && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Win Streak</dt>
                      <dd className="text-lg font-semibold">
                        {frontmatter.win_streak} games
                      </dd>
                    </div>
                  )}
              </dl>
            </div>
          )}

        {/* Game Content (Markdown rendered as HTML) */}
        <div
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    </div>
  );
}
