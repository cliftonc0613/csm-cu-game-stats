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
 * Receiving statistics data structure for a single player
 */
export interface ReceivingStatsData {
  player: string;
  receptions: number;
  targets: number;
  yards: number;
  average: number;
  touchdowns: number;
  long: number;
  team: 'clemson' | 'opponent';
}

/**
 * Props for ReceivingStatsChart component
 */
export interface ReceivingStatsChartProps {
  /** Array of receiving statistics data for multiple players */
  data: ReceivingStatsData[];
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
 * Custom tooltip component for displaying player receiving stats
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
  const playerData = payload[0]?.payload as ReceivingStatsData | undefined;

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-2.5 sm:p-3 min-w-[200px]">
      <p className="font-semibold text-xs sm:text-sm text-gray-900 mb-2 border-b pb-1">
        {playerData?.player || label}
      </p>
      <div className="space-y-1">
        <div className="flex justify-between gap-4 text-xs sm:text-sm">
          <span className="text-gray-700">Rec-Tgt:</span>
          <span className="font-medium text-gray-900">
            {playerData?.receptions}-{playerData?.targets}
          </span>
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
 * ReceivingStatsChart Component
 *
 * Displays receiving statistics for multiple players using grouped bar chart.
 * Compares top receivers from both teams with Clemson orange and opponent purple colors.
 * Includes GSAP scroll reveal animation for enhanced user experience.
 *
 * @example
 * ```tsx
 * const data = [
 *   {
 *     player: 'Antonio Williams',
 *     receptions: 8,
 *     targets: 11,
 *     yards: 149,
 *     average: 18.6,
 *     touchdowns: 2,
 *     long: 45,
 *     team: 'clemson'
 *   },
 *   {
 *     player: 'Tyler Brown',
 *     receptions: 6,
 *     targets: 8,
 *     yards: 87,
 *     average: 14.5,
 *     touchdowns: 1,
 *     long: 28,
 *     team: 'clemson'
 *   },
 *   {
 *     player: 'Opponent WR',
 *     receptions: 7,
 *     targets: 10,
 *     yards: 102,
 *     average: 14.6,
 *     touchdowns: 1,
 *     long: 32,
 *     team: 'opponent'
 *   }
 * ];
 *
 * <ReceivingStatsChart
 *   data={data}
 *   title="Receiving Leaders"
 *   height={400}
 *   showLegend={true}
 * />
 * ```
 */
export const ReceivingStatsChart = React.forwardRef<
  HTMLDivElement,
  ReceivingStatsChartProps
>(
  (
    {
      data,
      title = 'RECEIVING STATISTICS',
      height = 400,
      showLegend = true,
      className,
    },
    ref
  ) => {
    const chartRef = React.useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = React.useState(false);
    const chartId = React.useId();
    const descriptionId = `${chartId}-desc`;

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
    const getBarColor = (player: ReceivingStatsData) => {
      return player.team === 'clemson' ? CHART_COLORS.clemson : CHART_COLORS.opponent;
    };

    // Generate accessible description
    const chartDescription = `Bar chart displaying receiving statistics for ${data.length} player(s). Metrics include receptions, targets, yards, average yards per reception, touchdowns, and longest reception.`;

    return (
      <div
        ref={chartRef}
        className={cn(
          'w-full rounded-lg bg-white shadow-sm border border-gray-100',
          'p-4 sm:p-5 md:p-6 lg:p-8',
          className
        )}
        role="region"
        aria-labelledby={chartId}
      >
        {title && (
          <h3
            id={chartId}
            className="text-base sm:text-lg md:text-xl font-bold uppercase tracking-wide text-gray-900 mb-4 sm:mb-5 md:mb-6"
          >
            {title}
          </h3>
        )}

        {/* Screen reader description */}
        <div id={descriptionId} className="sr-only">
          {chartDescription}
        </div>

        <ResponsiveContainer
          width="100%"
          height={height}
          role="img"
          aria-label={title || 'Receiving Statistics'}
          aria-describedby={descriptionId}
        >
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
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-3 text-xs sm:text-sm">
          <div className="text-center p-2 bg-gray-50 rounded">
            <div className="font-semibold text-gray-900">Rec</div>
            <div className="text-gray-600 mt-1">
              {data.map((p, i) => (
                <div key={i} className="truncate" style={{ color: getBarColor(p) }}>
                  {p.receptions}
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
          <div className="text-center p-2 bg-gray-50 rounded col-span-2 sm:col-span-1">
            <div className="font-semibold text-gray-900">Catch%</div>
            <div className="text-gray-600 mt-1">
              {data.map((p, i) => (
                <div key={i} className="truncate" style={{ color: getBarColor(p) }}>
                  {((p.receptions / p.targets) * 100).toFixed(1)}%
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
);

ReceivingStatsChart.displayName = 'ReceivingStatsChart';
