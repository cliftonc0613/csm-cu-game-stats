import Image from 'next/image';
import { cn } from '@/lib/utils';

/**
 * Team slug type - all available team logos
 */
export type TeamSlug =
  | 'clemson'
  | 'south-carolina'
  | 'georgia'
  | 'florida-state'
  | 'nc-state'
  | 'notre-dame'
  | 'miami'
  | 'wake-forest'
  | 'syracuse'
  | 'louisville';

/**
 * Team name mapping for display purposes
 */
const TEAM_NAMES: Record<TeamSlug, string> = {
  clemson: 'Clemson Tigers',
  'south-carolina': 'South Carolina Gamecocks',
  georgia: 'Georgia Bulldogs',
  'florida-state': 'Florida State Seminoles',
  'nc-state': 'NC State Wolfpack',
  'notre-dame': 'Notre Dame Fighting Irish',
  miami: 'Miami Hurricanes',
  'wake-forest': 'Wake Forest Demon Deacons',
  syracuse: 'Syracuse Orange',
  louisville: 'Louisville Cardinals',
};

/**
 * Team colors for fallback background
 */
const TEAM_COLORS: Record<TeamSlug, string> = {
  clemson: '#F56600',
  'south-carolina': '#73000A',
  georgia: '#BA0C2F',
  'florida-state': '#782F40',
  'nc-state': '#CC0000',
  'notre-dame': '#0C2340',
  miami: '#F47321',
  'wake-forest': '#9E7E38',
  syracuse: '#D44500',
  louisville: '#AD0000',
};

export interface TeamLogoProps {
  /**
   * Team slug (lowercase, hyphenated)
   */
  team: TeamSlug | string;
  /**
   * Size of the logo in pixels (both width and height)
   * @default 40
   */
  size?: number;
  /**
   * Optional alt text override (defaults to team name)
   */
  alt?: string;
  /**
   * Whether to render the logo in a circular container
   * @default false
   */
  circular?: boolean;
  /**
   * Optional className for additional styling
   */
  className?: string;
  /**
   * Priority loading for above-the-fold images
   * @default false
   */
  priority?: boolean;
}

/**
 * TeamLogo Component
 *
 * Renders team logos with consistent styling and error handling.
 * Supports all teams with logo assets in public/images/logos/
 *
 * @example
 * ```tsx
 * <TeamLogo team="clemson" size={40} />
 * <TeamLogo team="south-carolina" size={60} circular />
 * ```
 */
export function TeamLogo({
  team,
  size = 40,
  alt,
  circular = false,
  className,
  priority = false,
}: TeamLogoProps) {
  // Normalize team slug to lowercase with hyphens
  const normalizedTeam = team.toLowerCase().replace(/\s+/g, '-');

  // Check if team is valid
  const isValidTeam = normalizedTeam in TEAM_NAMES;
  const teamSlug = isValidTeam ? (normalizedTeam as TeamSlug) : null;

  // Get logo path
  const logoPath = teamSlug
    ? `/images/logos/${teamSlug}.svg`
    : '/images/logos/placeholder.svg';

  // Get alt text
  const altText =
    alt || (teamSlug ? TEAM_NAMES[teamSlug] : `${team} logo`);

  // Get fallback color
  const fallbackColor = teamSlug ? TEAM_COLORS[teamSlug] : '#333333';

  return (
    <div
      className={cn(
        'relative inline-flex items-center justify-center flex-shrink-0',
        circular && 'rounded-full overflow-hidden',
        className
      )}
      style={{
        width: size,
        height: size,
        backgroundColor: circular ? fallbackColor : 'transparent',
      }}
    >
      <Image
        src={logoPath}
        alt={altText}
        width={size}
        height={size}
        priority={priority}
        className={cn(
          'object-contain',
          circular && 'p-1.5' // Add padding inside circular container
        )}
        onError={(e) => {
          // Fallback: hide image and show initials
          e.currentTarget.style.display = 'none';
        }}
      />
      {/* Fallback initials (shown if image fails to load) */}
      <span
        className="absolute inset-0 flex items-center justify-center text-white font-bold"
        style={{
          fontSize: `${size * 0.4}px`,
          display: 'none',
        }}
      >
        {teamSlug
          ? teamSlug
              .split('-')
              .map((word) => word[0].toUpperCase())
              .join('')
          : team.slice(0, 2).toUpperCase()}
      </span>
    </div>
  );
}

/**
 * TeamLogoWithName Component
 *
 * Renders a team logo with the team name displayed next to it
 *
 * @example
 * ```tsx
 * <TeamLogoWithName team="clemson" size={40} />
 * ```
 */
export interface TeamLogoWithNameProps extends TeamLogoProps {
  /**
   * Position of the name relative to the logo
   * @default 'right'
   */
  namePosition?: 'top' | 'right' | 'bottom' | 'left';
  /**
   * Gap between logo and name
   * @default 'md'
   */
  gap?: 'sm' | 'md' | 'lg';
  /**
   * Name text size
   * @default 'base'
   */
  nameSize?: 'sm' | 'base' | 'lg' | 'xl';
  /**
   * Whether to show the full team name or abbreviation
   * @default 'full'
   */
  nameDisplay?: 'full' | 'abbrev';
}

export function TeamLogoWithName({
  team,
  size = 40,
  namePosition = 'right',
  gap = 'md',
  nameSize = 'base',
  nameDisplay = 'full',
  className,
  ...logoProps
}: TeamLogoWithNameProps) {
  const normalizedTeam = team.toLowerCase().replace(/\s+/g, '-');
  const teamSlug = normalizedTeam in TEAM_NAMES ? (normalizedTeam as TeamSlug) : null;

  const teamName = teamSlug ? TEAM_NAMES[teamSlug] : team;
  const abbrev = teamSlug
    ? teamSlug
        .split('-')
        .map((word) => word[0].toUpperCase())
        .join('')
    : team.slice(0, 3).toUpperCase();

  const displayName = nameDisplay === 'abbrev' ? abbrev : teamName;

  const gapClasses = {
    sm: 'gap-1',
    md: 'gap-2',
    lg: 'gap-4',
  };

  const nameSizeClasses = {
    sm: 'text-sm',
    base: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
  };

  const flexDirection = {
    top: 'flex-col',
    right: 'flex-row',
    bottom: 'flex-col',
    left: 'flex-row-reverse',
  };

  return (
    <div
      className={cn(
        'inline-flex items-center',
        flexDirection[namePosition],
        gapClasses[gap],
        className
      )}
    >
      <TeamLogo team={team} size={size} {...logoProps} />
      <span
        className={cn(
          'font-semibold text-clemson-dark',
          nameSizeClasses[nameSize]
        )}
      >
        {displayName}
      </span>
    </div>
  );
}
