'use client';

import * as React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  TooltipProps,
} from 'recharts';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CHART_COLORS } from '@/lib/constants/colors';
import { cn } from '@/lib/utils';

// Register GSAP plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Team statistics data structure
 */
export interface TeamStatsData {
  stat: string;
  clemson: number;
  opponent: number;
}

/**
 * Props for TeamStatsChart component
 */
export interface TeamStatsChartProps {
  /** Array of team statistics data */
  data: TeamStatsData[];
  /** Chart title displayed above the visualization */
  title?: string;
  /** Height of the chart in pixels */
  height?: number;
  /** Whether to show the legend */
  showLegend?: boolean;
  /** Chart type - currently only supports 'horizontal-bar' */
  chartType?: 'horizontal-bar';
  /** Additional CSS classes */
  className?: string;
}

/**
 * Custom tooltip component for displaying precise stat values
 */
const CustomTooltip: React.FC<TooltipProps<number, string>> = ({
  active,
  payload,
  label,
}) => {
  if (!active || !payload || !payload.length) {
    return null;
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-2.5 sm:p-3 min-w-[140px]">
      <p className="font-semibold text-xs sm:text-sm text-gray-900 mb-1.5 sm:mb-2">
        {label}
      </p>
      {payload.map((entry, index) => (
        <div key={`item-${index}`} className="flex items-center gap-1.5 sm:gap-2">
          <div
            className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-sm flex-shrink-0"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-xs sm:text-sm text-gray-700 capitalize">
            {entry.name}:
          </span>
          <span className="text-xs sm:text-sm font-medium text-gray-900">
            {entry.value}
          </span>
        </div>
      ))}
    </div>
  );
};

/**
 * TeamStatsChart Component
 *
 * Displays team statistics comparison using horizontal bars.
 * Supports Clemson orange for Clemson stats and purple for opponent stats.
 * Includes GSAP scroll reveal animation for enhanced user experience.
 *
 * @example
 * ```tsx
 * const data = [
 *   { stat: 'First Downs', clemson: 32, opponent: 26 },
 *   { stat: 'Total Yards', clemson: 512, opponent: 387 },
 * ];
 *
 * <TeamStatsChart
 *   data={data}
 *   title="Team Statistics Comparison"
 *   height={400}
 *   showLegend={true}
 * />
 * ```
 */
export const TeamStatsChart = React.forwardRef<
  HTMLDivElement,
  TeamStatsChartProps
>(
  (
    {
      data,
      title = 'TEAM STATISTICS',
      height = 400,
      showLegend = true,
      chartType = 'horizontal-bar',
      className,
    },
    ref
  ) => {
    const chartRef = React.useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = React.useState(false);

    // Combine refs
    React.useImperativeHandle(ref, () => chartRef.current!);

    // GSAP scroll reveal animation
    React.useEffect(() => {
      if (!chartRef.current) return;

      const ctx = gsap.context(() => {
        gsap.from(chartRef.current, {
          opacity: 0,
          y: 50,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: chartRef.current,
            start: 'top 80%',
            end: 'top 50%',
            toggleActions: 'play none none none',
            onEnter: () => setIsVisible(true),
          },
        });
      }, chartRef);

      return () => ctx.revert();
    }, []);

    // Don't render if no data
    if (!data || data.length === 0) {
      return null;
    }

    return (
      <div
        ref={chartRef}
        className={cn(
          'w-full rounded-lg bg-white shadow-sm border border-gray-100',
          'p-4 sm:p-5 md:p-6 lg:p-8',
          className
        )}
      >
        {title && (
          <h3 className="text-base sm:text-lg md:text-xl font-bold uppercase tracking-wide text-gray-900 mb-4 sm:mb-5 md:mb-6">
            {title}
          </h3>
        )}

        <ResponsiveContainer width="100%" height={height}>
          <BarChart
            data={data}
            layout="vertical"
            margin={{
              top: 5,
              right: 15,
              left: 60,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              type="number"
              tick={{ fill: '#6b7280', fontSize: 12 }}
              stroke="#9ca3af"
            />
            <YAxis
              type="category"
              dataKey="stat"
              tick={{ fill: '#374151', fontSize: 12, fontWeight: 500 }}
              stroke="#9ca3af"
              width={60}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
            />
            {showLegend && (
              <Legend
                wrapperStyle={{
                  paddingTop: '16px',
                }}
                iconType="square"
                formatter={(value) => (
                  <span className="text-xs sm:text-sm text-gray-700 capitalize">
                    {value}
                  </span>
                )}
              />
            )}
            <Bar
              dataKey="clemson"
              fill={CHART_COLORS.clemson}
              radius={[0, 4, 4, 0]}
              animationBegin={0}
              animationDuration={800}
              animationEasing="ease-out"
              isAnimationActive={isVisible}
            />
            <Bar
              dataKey="opponent"
              fill={CHART_COLORS.opponent}
              radius={[0, 4, 4, 0]}
              animationBegin={100}
              animationDuration={800}
              animationEasing="ease-out"
              isAnimationActive={isVisible}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }
);

TeamStatsChart.displayName = 'TeamStatsChart';
