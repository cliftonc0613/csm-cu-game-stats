import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getGameBySlug, getAllGameSlugs } from '@/lib/markdown/getGameBySlug';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { GameDetailHeader } from '@/components/game/GameDetailHeader';
import { GameMetadata } from '@/components/game/GameMetadata';

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
 * Generate comprehensive SEO metadata for each game page
 * Includes Open Graph, Twitter Cards, and structured data
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  try {
    const { slug } = await params;
    const game = await getGameBySlug(slug, { validate: false });

    if (!game) {
      return {
        title: 'Game Not Found',
        description: 'The requested game could not be found.',
      };
    }

    const { frontmatter, excerpt } = game;

    // Format date for display
    const gameDate = new Date(frontmatter.game_date).toLocaleDateString('en-US', {
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

    const resultText = result === 'W' ? 'Win' : result === 'L' ? 'Loss' : 'Tie';

    // Create comprehensive title and description
    const title = `Clemson vs ${frontmatter.opponent} - ${gameDate} (${result} ${frontmatter.score.clemson}-${frontmatter.score.opponent})`;
    const description = excerpt || `Game statistics and details for Clemson vs ${frontmatter.opponent} on ${gameDate}. Final score: Clemson ${frontmatter.score.clemson}, ${frontmatter.opponent} ${frontmatter.score.opponent}. ${resultText} for Clemson Tigers.`;

    // Generate keywords based on game data
    const keywords = [
      'Clemson Tigers',
      'Clemson Football',
      frontmatter.opponent,
      `Clemson vs ${frontmatter.opponent}`,
      frontmatter.season.toString(),
      `${frontmatter.season} Football Season`,
      frontmatter.game_type.replace('_', ' '),
      'Game Statistics',
      'ACC Football',
    ];

    // Base URL for the site (can be configured via environment variable)
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://clemson-stats.netlify.app';
    const canonicalUrl = `${baseUrl}/games/${slug}`;

    return {
      title,
      description,
      keywords: keywords.join(', '),
      authors: [{ name: 'Clemson Sports Media' }],

      // Robots directives
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          'max-video-preview': -1,
          'max-image-preview': 'large',
          'max-snippet': -1,
        },
      },

      // Open Graph metadata for social sharing
      openGraph: {
        title,
        description,
        type: 'article',
        url: canonicalUrl,
        siteName: 'Clemson Football Statistics',
        locale: 'en_US',
        publishedTime: frontmatter.game_date,
        authors: ['Clemson Sports Media'],
        tags: keywords,
        images: [
          {
            url: `${baseUrl}/images/logos/clemson.svg`,
            width: 400,
            height: 400,
            alt: 'Clemson Tigers Logo',
          },
        ],
      },

      // Twitter Card metadata
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        site: '@ClemsonFB',
        creator: '@ClemsonFB',
        images: [`${baseUrl}/images/logos/clemson.svg`],
      },

      // Alternate languages (if needed in future)
      alternates: {
        canonical: canonicalUrl,
      },

      // Additional metadata
      other: {
        'game-date': frontmatter.game_date,
        'game-result': result,
        'clemson-score': frontmatter.score.clemson.toString(),
        'opponent-score': frontmatter.score.opponent.toString(),
        season: frontmatter.season.toString(),
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
export default async function GameDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  // Await params to get slug
  const { slug } = await params;

  // Fetch game data by slug
  const game = await getGameBySlug(slug, { validate: true });

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
  const isWin = frontmatter.score.clemson > frontmatter.score.opponent;
  const result = frontmatter.score.clemson > frontmatter.score.opponent ? 'W' : frontmatter.score.clemson < frontmatter.score.opponent ? 'L' : 'T';

  // Breadcrumb navigation
  const breadcrumbItems = [
    { label: 'Games', href: '/' },
    { label: `${frontmatter.opponent} (${result})` },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <div className="mb-6">
          <Breadcrumbs items={breadcrumbItems} />
        </div>

        {/* Game Header Section */}
        <GameDetailHeader
          frontmatter={frontmatter}
          formattedDate={gameDate}
          isWin={isWin}
          gamesListLink="/"
          className="mb-8"
        />

        {/* Game Metadata Section */}
        {frontmatter.content_type === 'statistics' && (
          <GameMetadata frontmatter={frontmatter} className="mb-8" />
        )}

        {/* Game Statistics and Content */}
        <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
          {/* Markdown content with statistics tables */}
          <div
            className="prose prose-lg max-w-none
              prose-headings:text-clemson-dark
              prose-h2:text-3xl prose-h2:font-bold prose-h2:mb-4 prose-h2:mt-8 prose-h2:border-b prose-h2:border-gray-200 prose-h2:pb-2
              prose-h3:text-2xl prose-h3:font-bold prose-h3:mb-3 prose-h3:mt-6
              prose-h4:text-xl prose-h4:font-semibold prose-h4:mb-2 prose-h4:mt-4
              prose-table:w-full prose-table:border-collapse
              prose-th:bg-gray-100 prose-th:border prose-th:border-gray-300 prose-th:px-4 prose-th:py-3 prose-th:text-left prose-th:font-semibold prose-th:text-gray-900
              prose-td:border prose-td:border-gray-300 prose-td:px-4 prose-td:py-3
              prose-strong:text-clemson-orange prose-strong:font-bold
              prose-ul:list-disc prose-ul:pl-6
              prose-ol:list-decimal prose-ol:pl-6
              prose-li:my-1
              prose-p:text-gray-700 prose-p:leading-relaxed"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>
      </div>
    </div>
  );
}
