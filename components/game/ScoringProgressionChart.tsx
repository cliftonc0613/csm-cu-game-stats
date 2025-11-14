'use client';

import * as React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  
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
 * Scoring progression data structure
 */
export interface ScoringProgressionData {
  quarter: string;
  clemson: number;
  opponent: number;
}

/**
 * Props for ScoringProgressionChart component
 */
export interface ScoringProgressionChartProps {
  /** Array of scoring progression data (cumulative scores per quarter) */
  data: ScoringProgressionData[];
  /** Chart title displayed above the visualization */
  title?: string;
  /** Height of the chart in pixels */
  height?: number;
  /** Whether to show the grid lines */
  showGrid?: boolean;
  /** Whether to show the legend */
  showLegend?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Custom tooltip component for displaying quarter and scores
 */
const CustomTooltip: React.FC<any> = ({
  active,
  payload,
  label,
}) => {
  if (!active || !payload || !payload.length) {
    return null;
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-2.5 sm:p-3 min-w-[160px]">
      <p className="font-semibold text-xs sm:text-sm text-gray-900 mb-1.5 sm:mb-2">
        {label} Quarter
      </p>
      {payload.map((entry: any, index: number) => (
        <div key={`item-${index}`} className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div
              className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-xs sm:text-sm text-gray-700 capitalize">
              {entry.name}:
            </span>
          </div>
          <span className="text-xs sm:text-sm font-bold text-gray-900">
            {entry.value}
          </span>
        </div>
      ))}
    </div>
  );
};

/**
 * ScoringProgressionChart Component
 *
 * Displays quarter-by-quarter cumulative scoring progression using a line chart.
 * Shows both teams' scores with Clemson orange and opponent purple colors.
 * Includes progressive drawing animation for enhanced visual experience.
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
 * <ScoringProgressionChart
 *   data={data}
 *   title="Scoring Progression"
 *   height={400}
 *   showGrid={true}
 *   showLegend={true}
 * />
 * ```
 */
export const ScoringProgressionChart = React.forwardRef<
  HTMLDivElement,
  ScoringProgressionChartProps
>(
  (
    {
      data,
      title = 'SCORING PROGRESSION',
      height = 400,
      showGrid = true,
      showLegend = true,
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
          <LineChart
            data={data}
            margin={{
              top: 5,
              right: 15,
              left: 5,
              bottom: 5,
            }}
          >
            {showGrid && (
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#e5e7eb"
                vertical={true}
              />
            )}
            <XAxis
              dataKey="quarter"
              tick={{ fill: '#374151', fontSize: 12, fontWeight: 500 }}
              stroke="#9ca3af"
              label={{
                value: 'Quarter',
                position: 'insideBottom',
                offset: -5,
                style: { fill: '#6b7280', fontSize: 11 },
              }}
            />
            <YAxis
              tick={{ fill: '#6b7280', fontSize: 12 }}
              stroke="#9ca3af"
              label={{
                value: 'Score',
                angle: -90,
                position: 'insideLeft',
                style: { fill: '#6b7280', fontSize: 11 },
              }}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ stroke: '#9ca3af', strokeWidth: 1 }}
            />
            {showLegend && (
              <Legend
                wrapperStyle={{
                  paddingTop: '16px',
                }}
                iconType="line"
                formatter={(value) => (
                  <span className="text-xs sm:text-sm text-gray-700 capitalize">
                    {value}
                  </span>
                )}
              />
            )}
            <Line
              type="monotone"
              dataKey="clemson"
              stroke={CHART_COLORS.clemson}
              strokeWidth={3}
              dot={{ fill: CHART_COLORS.clemson, r: 5 }}
              activeDot={{ r: 7 }}
              animationBegin={0}
              animationDuration={1200}
              animationEasing="ease-in-out"
              isAnimationActive={isVisible}
            />
            <Line
              type="monotone"
              dataKey="opponent"
              stroke={CHART_COLORS.opponent}
              strokeWidth={3}
              dot={{ fill: CHART_COLORS.opponent, r: 5 }}
              activeDot={{ r: 7 }}
              animationBegin={200}
              animationDuration={1200}
              animationEasing="ease-in-out"
              isAnimationActive={isVisible}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  }
);

ScoringProgressionChart.displayName = 'ScoringProgressionChart';
