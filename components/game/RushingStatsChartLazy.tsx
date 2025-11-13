'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import type { RushingStatsChartProps } from './RushingStatsChart';

// Lazy load the RushingStatsChart component
const RushingStatsChart = React.lazy(() =>
  import('./RushingStatsChart').then((module) => ({
    default: module.RushingStatsChart,
  }))
);

/**
 * Skeleton component displayed while RushingStatsChart is loading
 */
const RushingStatsChartSkeleton: React.FC<{
  title?: string;
  height?: number;
  className?: string;
}> = ({ title = 'RUSHING STATISTICS', height = 400, className }) => {
  return (
    <div
      className={cn(
        'w-full rounded-lg bg-white shadow-sm border border-gray-100',
        'p-4 sm:p-5 md:p-6 lg:p-8',
        className
      )}
    >
      {title && (
        <div className="mb-4 sm:mb-5 md:mb-6">
          <div className="h-6 w-48 bg-gray-200 rounded animate-pulse" />
        </div>
      )}

      {/* Chart skeleton */}
      <div
        className="w-full bg-gray-50 rounded-lg overflow-hidden"
        style={{ height: `${height}px` }}
      >
        <div className="h-full flex items-end justify-around p-8 gap-4">
          {/* Skeleton bars for players */}
          {[75, 50, 60, 40].map((heightPercent, index) => (
            <div key={index} className="flex-1 flex flex-col items-center gap-2">
              {/* Bar */}
              <div
                className="w-full bg-gray-300 rounded-t animate-pulse"
                style={{
                  height: `${heightPercent}%`,
                  animationDelay: `${index * 150}ms`,
                }}
              />
              {/* Player name placeholder */}
              <div className="w-16 h-3 bg-gray-300 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>

      {/* Stats summary skeleton */}
      <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
        {['Attempts', 'Avg', 'TD', 'Long'].map((label, index) => (
          <div key={label} className="text-center p-2 bg-gray-50 rounded">
            <div className="h-4 w-14 bg-gray-300 rounded mx-auto mb-2 animate-pulse" />
            <div className="space-y-1">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="h-3 w-8 bg-gray-200 rounded mx-auto animate-pulse"
                  style={{ animationDelay: `${(index * 3 + i) * 100}ms` }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * RushingStatsChartLazy Component
 *
 * Lazy-loaded wrapper for RushingStatsChart with Suspense boundary.
 * Displays a skeleton loader while the chart component is being loaded.
 *
 * @example
 * ```tsx
 * <RushingStatsChartLazy
 *   data={rushingData}
 *   title="Ground Game Leaders"
 *   height={400}
 *   showLegend={true}
 * />
 * ```
 */
export const RushingStatsChartLazy = React.forwardRef<
  HTMLDivElement,
  RushingStatsChartProps
>((props, ref) => {
  return (
    <React.Suspense
      fallback={
        <RushingStatsChartSkeleton
          title={props.title}
          height={props.height}
          className={props.className}
        />
      }
    >
      <RushingStatsChart ref={ref} {...props} />
    </React.Suspense>
  );
});

RushingStatsChartLazy.displayName = 'RushingStatsChartLazy';
