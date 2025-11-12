'use client';

import * as React from 'react';
import { ScoringProgressionChartProps } from './ScoringProgressionChart';
import { cn } from '@/lib/utils';

/**
 * Lazy-loaded ScoringProgressionChart component for code splitting
 * Uses React.lazy() and Suspense to defer loading until needed
 */
const ScoringProgressionChart = React.lazy(() =>
  import('./ScoringProgressionChart').then((module) => ({
    default: module.ScoringProgressionChart,
  }))
);

/**
 * Loading skeleton for ScoringProgressionChart
 * Displays while the chart component is being loaded
 */
const ScoringProgressionChartSkeleton: React.FC<{
  height?: number;
  title?: string;
}> = ({ height = 400, title = 'SCORING PROGRESSION' }) => {
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
          <div className="h-5 sm:h-6 md:h-7 bg-gray-200 rounded w-56 max-w-full" />
        </div>
      )}

      {/* Chart skeleton */}
      <div
        className="bg-gray-100 rounded relative overflow-hidden"
        style={{ height: `${height}px` }}
        role="status"
        aria-label="Loading chart"
      >
        {/* Y-axis skeleton */}
        <div className="absolute left-2 top-4 bottom-8 flex flex-col justify-between">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="w-8 h-2 bg-gray-200 rounded" />
          ))}
        </div>

        {/* X-axis skeleton */}
        <div className="absolute left-12 right-4 bottom-2 flex justify-around items-end">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="w-8 h-2 bg-gray-200 rounded" />
          ))}
        </div>

        {/* Line chart skeleton - showing a line progression */}
        <div className="absolute left-12 right-4 top-8 bottom-12">
          <svg width="100%" height="100%" className="overflow-visible">
            {/* Grid lines */}
            <g opacity="0.1">
              <line x1="0" y1="20%" x2="100%" y2="20%" stroke="#9ca3af" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="0" y1="40%" x2="100%" y2="40%" stroke="#9ca3af" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="0" y1="60%" x2="100%" y2="60%" stroke="#9ca3af" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="0" y1="80%" x2="100%" y2="80%" stroke="#9ca3af" strokeWidth="1" strokeDasharray="3 3" />
            </g>

            {/* Skeleton line 1 (orange) */}
            <polyline
              points="0,80% 33%,60% 66%,40% 100%,20%"
              fill="none"
              stroke="#F56600"
              strokeWidth="3"
              opacity="0.2"
            />
            {/* Data points for line 1 */}
            <circle cx="0%" cy="80%" r="4" fill="#F56600" opacity="0.2" />
            <circle cx="33%" cy="60%" r="4" fill="#F56600" opacity="0.2" />
            <circle cx="66%" cy="40%" r="4" fill="#F56600" opacity="0.2" />
            <circle cx="100%" cy="20%" r="4" fill="#F56600" opacity="0.2" />

            {/* Skeleton line 2 (purple) */}
            <polyline
              points="0,70% 33%,55% 66%,45% 100%,35%"
              fill="none"
              stroke="#522D80"
              strokeWidth="3"
              opacity="0.2"
            />
            {/* Data points for line 2 */}
            <circle cx="0%" cy="70%" r="4" fill="#522D80" opacity="0.2" />
            <circle cx="33%" cy="55%" r="4" fill="#522D80" opacity="0.2" />
            <circle cx="66%" cy="45%" r="4" fill="#522D80" opacity="0.2" />
            <circle cx="100%" cy="35%" r="4" fill="#522D80" opacity="0.2" />
          </svg>
        </div>

        {/* Legend skeleton */}
        <div className="absolute left-1/2 -translate-x-1/2 bottom-2 flex gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-0.5 bg-gray-300 rounded" />
            <div className="w-16 h-2 bg-gray-200 rounded" />
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-0.5 bg-gray-300 rounded" />
            <div className="w-16 h-2 bg-gray-200 rounded" />
          </div>
        </div>
      </div>

      {/* Screen reader text */}
      <span className="sr-only">Loading scoring progression chart...</span>
    </div>
  );
};

/**
 * ScoringProgressionChartLazy Component
 *
 * Lazy-loaded wrapper for ScoringProgressionChart component.
 * Provides code splitting and loading states for better performance.
 *
 * @example
 * ```tsx
 * const data = [
 *   { quarter: '1st', clemson: 14, opponent: 14 },
 *   { quarter: '2nd', clemson: 35, opponent: 21 },
 *   { quarter: '3rd', clemson: 45, opponent: 28 },
 *   { quarter: '4th', clemson: 59, opponent: 35 },
 * ];
 *
 * <ScoringProgressionChartLazy
 *   data={data}
 *   title="Scoring Progression"
 *   height={400}
 *   showGrid={true}
 *   showLegend={true}
 * />
 * ```
 */
export const ScoringProgressionChartLazy = React.forwardRef<
  HTMLDivElement,
  ScoringProgressionChartProps
>((props, ref) => {
  return (
    <React.Suspense
      fallback={
        <ScoringProgressionChartSkeleton height={props.height} title={props.title} />
      }
    >
      <ScoringProgressionChart ref={ref} {...props} />
    </React.Suspense>
  );
});

ScoringProgressionChartLazy.displayName = 'ScoringProgressionChartLazy';

// Export skeleton for testing purposes
export { ScoringProgressionChartSkeleton };
