'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { cn, fadeInUp } from '@/lib/utils';
import { StatCard } from './StatCard';

export interface StatData {
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
   * Optional variant override (if not set, alternates automatically)
   */
  variant?: 'orange' | 'purple';
  /**
   * Size variant for the display number
   */
  size?: 'sm' | 'md' | 'default' | 'lg';
}

export interface StatCardGridProps {
  /**
   * Array of stat data to display
   */
  stats: StatData[];
  /**
   * Number of columns on desktop
   * @default 4
   */
  columns?: 2 | 3 | 4;
  /**
   * Whether to automatically alternate orange/purple backgrounds
   * @default true
   */
  autoAlternate?: boolean;
  /**
   * Starting color for alternation (only used if autoAlternate is true)
   * @default 'orange'
   */
  startColor?: 'orange' | 'purple';
  /**
   * Gap size between cards
   * @default 'md'
   */
  gap?: 'sm' | 'md' | 'lg';
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * StatCardGrid Component
 *
 * Displays a grid of stat cards with:
 * - Responsive grid layout: 1 col (mobile), 2 cols (tablet), 3-4 cols (desktop)
 * - Accepts array of stat objects as props
 * - Automatically alternates orange/purple backgrounds
 * - Maps stat data to StatCard components
 */
export function StatCardGrid({
  stats,
  columns = 4,
  autoAlternate = true,
  startColor = 'orange',
  gap = 'md',
  className,
}: StatCardGridProps) {
  const gridRef = useRef<HTMLDivElement>(null);

  // Scroll reveal animation for stat cards
  useGSAP(
    () => {
      if (gridRef.current) {
        const cards = gridRef.current.querySelectorAll('.stat-card-item');
        if (cards.length > 0) {
          fadeInUp(cards, {
            duration: 0.5,
            stagger: 0.1,
            y: 30,
          });
        }
      }
    },
    { scope: gridRef }
  );

  // Determine grid column classes based on columns prop
  const columnClasses = {
    2: 'lg:grid-cols-2',
    3: 'lg:grid-cols-3',
    4: 'lg:grid-cols-4',
  };

  // Determine gap classes
  const gapClasses = {
    sm: 'gap-3',
    md: 'gap-4',
    lg: 'gap-6',
  };

  return (
    <div
      ref={gridRef}
      className={cn(
        'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2',
        columnClasses[columns],
        gapClasses[gap],
        className
      )}
    >
      {stats.map((stat, index) => {
        // Determine variant (use explicit variant or auto-alternate)
        let variant: 'orange' | 'purple';
        if (stat.variant) {
          variant = stat.variant;
        } else if (autoAlternate) {
          // Alternate based on index and starting color
          const isEven = index % 2 === 0;
          variant = (startColor === 'orange' && isEven) || (startColor === 'purple' && !isEven)
            ? 'orange'
            : 'purple';
        } else {
          variant = 'orange';
        }

        return (
          <StatCard
            key={`stat-${index}-${stat.label}`}
            value={stat.value}
            ordinal={stat.ordinal}
            label={stat.label}
            description={stat.description}
            variant={variant}
            size={stat.size}
            className="stat-card-item"
          />
        );
      })}
    </div>
  );
}
