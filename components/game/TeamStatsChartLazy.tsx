'use client';

import * as React from 'react';
import { TeamStatsChartProps } from './TeamStatsChart';
import { cn } from '@/lib/utils';

/**
 * Lazy-loaded TeamStatsChart component for code splitting
 * Uses React.lazy() and Suspense to defer loading until needed
 */
const TeamStatsChart = React.lazy(() =>
  import('./TeamStatsChart').then((module) => ({
    default: module.TeamStatsChart,
  }))
);

/**
 * Loading skeleton for TeamStatsChart
 * Displays while the chart component is being loaded
 */
const TeamStatsChartSkeleton: React.FC<{
  height?: number;
  title?: string;
}> = ({ height = 400, title = 'TEAM STATISTICS' }) => {
  return (
    <div
      className={cn(
        'w-full rounded-lg bg-white shadow-sm border border-gray-100',
        'p-4 sm:p-5 md:p-6 lg:p-8',
        'animate-pulse'
      )}
    >
      {/* Title skeleton */}
      {title && (
        <div className="mb-4 sm:mb-5 md:mb-6">
          <div className="h-5 sm:h-6 md:h-7 bg-gray-200 rounded w-48 max-w-full" />
        </div>
      )}

      {/* Chart skeleton */}
      <div
        className="bg-gray-100 rounded"
        style={{ height: `${height}px` }}
        role="status"
        aria-label="Loading chart"
      >
        {/* Horizontal bars skeleton */}
        <div className="flex flex-col justify-around h-full p-4 sm:p-6">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="flex items-center gap-4">
              {/* Y-axis label placeholder */}
              <div className="w-16 sm:w-20 h-3 bg-gray-200 rounded flex-shrink-0" />
              {/* Bar placeholders */}
              <div className="flex-1 flex gap-2">
                <div
                  className="h-6 sm:h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded"
                  style={{ width: `${30 + Math.random() * 50}%` }}
                />
                <div
                  className="h-6 sm:h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded"
                  style={{ width: `${20 + Math.random() * 40}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Legend skeleton */}
        <div className="flex justify-center gap-4 mt-4 pb-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gray-300 rounded" />
            <div className="w-16 h-3 bg-gray-200 rounded" />
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gray-300 rounded" />
            <div className="w-16 h-3 bg-gray-200 rounded" />
          </div>
        </div>
      </div>

      {/* Screen reader text */}
      <span className="sr-only">Loading team statistics chart...</span>
    </div>
  );
};

/**
 * TeamStatsChartLazy Component
 *
 * Lazy-loaded wrapper for TeamStatsChart component.
 * Provides code splitting and loading states for better performance.
 *
 * @example
 * ```tsx
 * const data = [
 *   { stat: 'First Downs', clemson: 32, opponent: 26 },
 *   { stat: 'Total Yards', clemson: 512, opponent: 387 },
 * ];
 *
 * <TeamStatsChartLazy
 *   data={data}
 *   title="Team Statistics Comparison"
 *   height={400}
 *   showLegend={true}
 * />
 * ```
 */
export const TeamStatsChartLazy = React.forwardRef<
  HTMLDivElement,
  TeamStatsChartProps
>((props, ref) => {
  return (
    <React.Suspense
      fallback={
        <TeamStatsChartSkeleton height={props.height} title={props.title} />
      }
    >
      <TeamStatsChart ref={ref} {...props} />
    </React.Suspense>
  );
});

TeamStatsChartLazy.displayName = 'TeamStatsChartLazy';

// Export skeleton for testing purposes
export { TeamStatsChartSkeleton };
