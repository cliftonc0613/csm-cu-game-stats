import type { GameStatsFrontmatter } from '@/lib/markdown/types';

export interface MetadataItem {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
}

export interface GameMetadataProps {
  /**
   * Game frontmatter data
   */
  frontmatter: GameStatsFrontmatter;
  /**
   * Additional custom metadata items to display
   */
  customItems?: MetadataItem[];
  /**
   * Layout variant
   */
  variant?: 'grid' | 'list';
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * GameMetadata Component
 *
 * Displays game metadata information in a clean, card-based layout.
 * Shows attendance, weather, location, and other game-specific details.
 */
export function GameMetadata({
  frontmatter,
  customItems = [],
  variant = 'grid',
  className = '',
}: GameMetadataProps) {
  // Build metadata items from frontmatter
  const metadataItems: MetadataItem[] = [];

  // Add attendance if available
  if (frontmatter.attendance) {
    metadataItems.push({
      label: 'Attendance',
      value: frontmatter.attendance.toLocaleString(),
    });
  }

  // Add weather if available
  if (frontmatter.weather) {
    metadataItems.push({
      label: 'Weather',
      value: frontmatter.weather,
    });
  }

  // Add location type (home/away/neutral)
  if (frontmatter.home_away) {
    const locationLabel =
      frontmatter.home_away === 'home'
        ? 'Home'
        : frontmatter.home_away === 'away'
          ? 'Away'
          : 'Neutral Site';

    metadataItems.push({
      label: 'Location',
      value: locationLabel,
    });
  }

  // Add game type
  const gameTypeLabel = frontmatter.game_type
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  metadataItems.push({
    label: 'Game Type',
    value: gameTypeLabel,
  });

  // Add season
  metadataItems.push({
    label: 'Season',
    value: frontmatter.season,
  });

  // Add any custom items
  metadataItems.push(...customItems);

  // Don't render if no items
  if (metadataItems.length === 0) {
    return null;
  }

  const gridClass = variant === 'grid' ? 'grid grid-cols-1 md:grid-cols-3 gap-6' : 'space-y-4';

  return (
    <div className={`bg-white rounded-lg shadow-sm p-6 ${className}`}>
      <h2 className="text-2xl font-bold mb-4 text-clemson-dark">Game Information</h2>
      <dl className={gridClass}>
        {metadataItems.map((item, index) => (
          <div key={index} className="bg-gray-50 rounded-lg p-4">
            <dt className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1 flex items-center gap-2">
              {item.icon}
              {item.label}
            </dt>
            <dd className="text-2xl font-bold text-gray-900">{item.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

/**
 * Compact variant of GameMetadata for smaller displays
 */
export function GameMetadataCompact({
  frontmatter,
  className = '',
}: Omit<GameMetadataProps, 'variant' | 'customItems'>) {
  const items: { label: string; value: string }[] = [];

  if (frontmatter.attendance) {
    items.push({
      label: 'Attendance',
      value: frontmatter.attendance.toLocaleString(),
    });
  }

  if (frontmatter.weather) {
    items.push({
      label: 'Weather',
      value: frontmatter.weather,
    });
  }

  if (frontmatter.location) {
    items.push({
      label: 'Venue',
      value: frontmatter.location,
    });
  }

  if (items.length === 0) {
    return null;
  }

  return (
    <div className={`bg-gray-50 rounded-lg p-4 ${className}`}>
      <dl className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
        {items.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <dt className="font-medium text-gray-600">{item.label}:</dt>
            <dd className="text-gray-900 font-semibold">{item.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
