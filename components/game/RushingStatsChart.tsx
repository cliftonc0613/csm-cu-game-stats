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
 * Rushing statistics data structure for a single player
 */
export interface RushingStatsData {
  player: string;
  attempts: number;
  yards: number;
  average: number;
  touchdowns: number;
  long: number;
  team: 'clemson' | 'opponent';
}

/**
 * Props for RushingStatsChart component
 */
export interface RushingStatsChartProps {
  /** Array of rushing statistics data for multiple players */
  data: RushingStatsData[];
  /** Chart title displayed above the visualization */
  title?: string;
  /** Height of the chart in pixels */
  height?: number;
  /** Whether to show the legend */
  showLegend?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Custom tooltip component for displaying player rushing stats
 */
const CustomTooltip: React.FC<any> = ({
  active,
  payload,
  label,
}) => {
  if (!active || !payload || !payload.length) {
    return null;
  }

  // Get the full player data from the first payload item
  const playerData = payload[0]?.payload as RushingStatsData | undefined;

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-2.5 sm:p-3 min-w-[180px]">
      <p className="font-semibold text-xs sm:text-sm text-gray-900 mb-2 border-b pb-1">
        {playerData?.player || label}
      </p>
      <div className="space-y-1">
        <div className="flex justify-between gap-4 text-xs sm:text-sm">
          <span className="text-gray-700">Attempts:</span>
          <span className="font-medium text-gray-900">{playerData?.attempts}</span>
        </div>
        <div className="flex justify-between gap-4 text-xs sm:text-sm">
          <span className="text-gray-700">Yards:</span>
          <span className="font-medium text-gray-900">{playerData?.yards}</span>
        </div>
        <div className="flex justify-between gap-4 text-xs sm:text-sm">
          <span className="text-gray-700">Average:</span>
          <span className="font-medium text-gray-900">
            {playerData?.average.toFixed(1)}
          </span>
        </div>
        <div className="flex justify-between gap-4 text-xs sm:text-sm">
          <span className="text-gray-700">TD:</span>
          <span className="font-medium text-gray-900">{playerData?.touchdowns}</span>
        </div>
        <div className="flex justify-between gap-4 text-xs sm:text-sm">
          <span className="text-gray-700">Long:</span>
          <span className="font-medium text-gray-900">{playerData?.long}</span>
        </div>
      </div>
    </div>
  );
};

/**
 * RushingStatsChart Component
 *
 * Displays rushing statistics for multiple players using grouped bar chart.
 * Compares top rushers from both teams with Clemson orange and opponent purple colors.
 * Includes GSAP scroll reveal animation for enhanced user experience.
 *
 * @example
 * ```tsx
 * const data = [
 *   {
 *     player: 'Phil Mafah',
 *     attempts: 21,
 *     yards: 186,
 *     average: 8.9,
 *     touchdowns: 2,
 *     long: 45,
 *     team: 'clemson'
 *   },
 *   {
 *     player: 'Jay Haynes',
 *     attempts: 8,
 *     yards: 52,
 *     average: 6.5,
 *     touchdowns: 1,
 *     long: 18,
 *     team: 'clemson'
 *   },
 *   {
 *     player: 'Opponent RB',
 *     attempts: 15,
 *     yards: 87,
 *     average: 5.8,
 *     touchdowns: 1,
 *     long: 22,
 *     team: 'opponent'
 *   }
 * ];
 *
 * <RushingStatsChart
 *   data={data}
 *   title="Rushing Leaders"
 *   height={400}
 *   showLegend={true}
 * />
 * ```
 */
export const RushingStatsChart = React.forwardRef<
  HTMLDivElement,
  RushingStatsChartProps
>(
  (
    {
      data,
      title = 'RUSHING STATISTICS',
      height = 400,
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

    // Determine bar color based on team
    const getBarColor = (player: RushingStatsData) => {
      return player.team === 'clemson' ? CHART_COLORS.clemson : CHART_COLORS.opponent;
    };

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
            margin={{
              top: 5,
              right: 15,
              left: 5,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="player"
              tick={{ fill: '#374151', fontSize: 11, fontWeight: 500 }}
              stroke="#9ca3af"
              angle={-15}
              textAnchor="end"
              height={60}
            />
            <YAxis
              tick={{ fill: '#6b7280', fontSize: 12 }}
              stroke="#9ca3af"
              label={{
                value: 'Yards',
                angle: -90,
                position: 'insideLeft',
                style: { fill: '#6b7280', fontSize: 11 },
              }}
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
                  <span className="text-xs sm:text-sm text-gray-700">
                    {value}
                  </span>
                )}
              />
            )}
            <Bar
              dataKey="yards"
              fill="#8884d8"
              radius={[4, 4, 0, 0]}
              animationBegin={0}
              animationDuration={800}
              animationEasing="ease-out"
              isAnimationActive={isVisible}
            >
              {data.map((entry, index) => (
                <Bar
                  key={`bar-${index}`}
                  dataKey="yards"
                  fill={getBarColor(entry)}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        {/* Stats summary below chart */}
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 text-xs sm:text-sm">
          <div className="text-center p-2 bg-gray-50 rounded">
            <div className="font-semibold text-gray-900">Attempts</div>
            <div className="text-gray-600 mt-1">
              {data.map((p, i) => (
                <div key={i} className="truncate" style={{ color: getBarColor(p) }}>
                  {p.attempts}
                </div>
              ))}
            </div>
          </div>
          <div className="text-center p-2 bg-gray-50 rounded">
            <div className="font-semibold text-gray-900">Avg</div>
            <div className="text-gray-600 mt-1">
              {data.map((p, i) => (
                <div key={i} className="truncate" style={{ color: getBarColor(p) }}>
                  {p.average.toFixed(1)}
                </div>
              ))}
            </div>
          </div>
          <div className="text-center p-2 bg-gray-50 rounded">
            <div className="font-semibold text-gray-900">TD</div>
            <div className="text-gray-600 mt-1">
              {data.map((p, i) => (
                <div key={i} className="truncate" style={{ color: getBarColor(p) }}>
                  {p.touchdowns}
                </div>
              ))}
            </div>
          </div>
          <div className="text-center p-2 bg-gray-50 rounded">
            <div className="font-semibold text-gray-900">Long</div>
            <div className="text-gray-600 mt-1">
              {data.map((p, i) => (
                <div key={i} className="truncate" style={{ color: getBarColor(p) }}>
                  {p.long}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
);

RushingStatsChart.displayName = 'RushingStatsChart';
