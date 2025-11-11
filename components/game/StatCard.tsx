'use client';

import { cn } from '@/lib/utils';

export interface StatCardProps {
  /**
   * The main statistic value to display
   */
  value: number | string;
  /**
   * Optional ordinal suffix (e.g., "st", "nd", "rd", "th")
   */
  ordinal?: string;
  /**
   * Primary label displayed above the number (uppercase)
   */
  label: string;
  /**
   * Secondary descriptor displayed below (e.g., "of 134")
   */
  description?: string;
  /**
   * Background color variant
   * @default 'orange'
   */
  variant?: 'orange' | 'purple';
  /**
   * Size variant for the display number
   * @default 'default'
   */
  size?: 'sm' | 'md' | 'default' | 'lg';
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * StatCard Component
 *
 * Displays a statistic card with:
 * - Large display number (80-120px) with ultra-bold weight
 * - Optional ordinal suffix in superscript
 * - Small descriptor text (uppercase) above number
 * - Secondary descriptor text below
 * - Alternating orange/purple backgrounds
 * - White text on colored backgrounds
 * - Consistent padding using Tailwind
 */
export function StatCard({
  value,
  ordinal,
  label,
  description,
  variant = 'orange',
  size = 'default',
  className,
}: StatCardProps) {
  // Determine background and text colors
  const colorClasses = {
    orange: 'bg-clemson-orange text-white',
    purple: 'bg-clemson-purple text-white',
  };

  // Determine size classes
  const sizeClasses = {
    sm: 'display-number-sm',
    md: 'display-number-md',
    default: 'display-number',
    lg: 'display-number-lg',
  };

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center',
        'p-6 md:p-8',
        'rounded-lg shadow-lg',
        'transition-transform duration-200 hover:scale-105',
        colorClasses[variant],
        className
      )}
    >
      {/* Primary Label (uppercase, above number) */}
      <div className="text-xs md:text-sm uppercase tracking-wider font-semibold mb-2 md:mb-3 text-center opacity-90">
        {label}
      </div>

      {/* Display Number with Optional Ordinal */}
      <div className="flex items-baseline justify-center">
        <span className={cn(sizeClasses[size], 'text-white')}>
          {value}
          {ordinal && (
            <span className="ordinal-superscript text-white">{ordinal}</span>
          )}
        </span>
      </div>

      {/* Secondary Description (below number) */}
      {description && (
        <div className="text-xs md:text-sm mt-2 md:mt-3 text-center opacity-90">
          {description}
        </div>
      )}
    </div>
  );
}

/**
 * Helper function to generate ordinal suffix for a number
 * @param n - Number to get ordinal suffix for
 * @returns Ordinal suffix (st, nd, rd, th)
 */
export function getOrdinalSuffix(n: number): string {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
}

/**
 * Helper function to create a stat card with ordinal
 * @param value - Numeric value
 * @param label - Primary label
 * @param description - Optional description
 * @param variant - Color variant
 * @returns StatCard props with ordinal
 */
export function createOrdinalStatCard(
  value: number,
  label: string,
  description?: string,
  variant?: 'orange' | 'purple'
): StatCardProps {
  return {
    value,
    ordinal: getOrdinalSuffix(value),
    label,
    description,
    variant,
  };
}
