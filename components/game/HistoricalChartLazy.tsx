'use client';

import dynamic from 'next/dynamic';
import type { HistoricalChartProps } from './HistoricalChart';

/**
 * Lazy-loaded HistoricalChart Component
 *
 * Uses Next.js dynamic import to code-split the Recharts library
 * and reduce initial bundle size. The chart component will only be
 * loaded when it's needed.
 *
 * Benefits:
 * - Reduces initial JavaScript bundle size
 * - Improves First Contentful Paint (FCP)
 * - Improves Time to Interactive (TTI)
 * - Better Core Web Vitals scores
 *
 * @example
 * ```tsx
 * import { HistoricalChartLazy } from '@/components/game/HistoricalChartLazy';
 *
 * <HistoricalChartLazy
 *   data={chartData}
 *   title="Historical Performance"
 *   type="area"
 * />
 * ```
 */
export const HistoricalChartLazy = dynamic<HistoricalChartProps>(
  () => import('./HistoricalChart').then((mod) => mod.HistoricalChart),
  {
    loading: () => (
      <div className="w-full flex items-center justify-center p-12">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-clemson-orange"></div>
          <p className="text-sm text-muted-foreground">Loading chart...</p>
        </div>
      </div>
    ),
    ssr: true, // Enable SSR for better SEO
  }
);

// Export the props type for convenience
export type { HistoricalChartProps };
