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
 * Defensive statistics data structure for a single player
 */
export interface DefenseStatsData {
  player: string;
  tackles: number;
  soloTackles: number;
  tacklesForLoss: number;
  sacks: number;
  interceptions: number;
  passesDefended: number;
  fumblesRecovered: number;
  team: 'clemson' | 'opponent';
}

/**
 * Props for DefenseStatsChart component
 */
export interface DefenseStatsChartProps {
  /** Array of defensive statistics data for multiple players */
  data: DefenseStatsData[];
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
 * Custom tooltip component for displaying player defensive stats
 */
const CustomTooltip: React.FC<TooltipProps<number, string>> = ({
  active,
  payload,
  label,
}) => {
  if (!active || !payload || !payload.length) {
    return null;
  }

  // Get the full player data from the first payload item
  const playerData = payload[0]?.payload as DefenseStatsData | undefined;

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-2.5 sm:p-3 min-w-[200px]">
      <p className="font-semibold text-xs sm:text-sm text-gray-900 mb-2 border-b pb-1">
        {playerData?.player || label}
      </p>
      <div className="space-y-1">
        <div className="flex justify-between gap-4 text-xs sm:text-sm">
          <span className="text-gray-700">Total Tackles:</span>
          <span className="font-medium text-gray-900">{playerData?.tackles}</span>
        </div>
        <div className="flex justify-between gap-4 text-xs sm:text-sm">
          <span className="text-gray-700">Solo:</span>
          <span className="font-medium text-gray-900">{playerData?.soloTackles}</span>
        </div>
        <div className="flex justify-between gap-4 text-xs sm:text-sm">
          <span className="text-gray-700">TFL:</span>
          <span className="font-medium text-gray-900">
            {playerData?.tacklesForLoss}
          </span>
        </div>
        <div className="flex justify-between gap-4 text-xs sm:text-sm">
          <span className="text-gray-700">Sacks:</span>
          <span className="font-medium text-gray-900">{playerData?.sacks}</span>
        </div>
        <div className="flex justify-between gap-4 text-xs sm:text-sm">
          <span className="text-gray-700">INT:</span>
          <span className="font-medium text-gray-900">
            {playerData?.interceptions}
          </span>
        </div>
        <div className="flex justify-between gap-4 text-xs sm:text-sm">
          <span className="text-gray-700">PD:</span>
          <span className="font-medium text-gray-900">
            {playerData?.passesDefended}
          </span>
        </div>
        <div className="flex justify-between gap-4 text-xs sm:text-sm">
          <span className="text-gray-700">FR:</span>
          <span className="font-medium text-gray-900">
            {playerData?.fumblesRecovered}
          </span>
        </div>
      </div>
    </div>
  );
};

/**
 * DefenseStatsChart Component
 *
 * Displays defensive statistics for multiple players using grouped bar chart.
 * Compares top defensive players from both teams with Clemson orange and opponent purple colors.
 * Includes GSAP scroll reveal animation for enhanced user experience.
 *
 * @example
 * ```tsx
 * const data = [
 *   {
 *     player: 'Barrett Carter',
 *     tackles: 12,
 *     soloTackles: 7,
 *     tacklesForLoss: 2.5,
 *     sacks: 1.0,
 *     interceptions: 1,
 *     passesDefended: 2,
 *     fumblesRecovered: 0,
 *     team: 'clemson'
 *   },
 *   {
 *     player: 'Jeremiah Trotter Jr.',
 *     tackles: 10,
 *     soloTackles: 6,
 *     tacklesForLoss: 1.5,
 *     sacks: 0.5,
 *     interceptions: 0,
 *     passesDefended: 1,
 *     fumblesRecovered: 1,
 *     team: 'clemson'
 *   },
 *   {
 *     player: 'Opponent LB',
 *     tackles: 9,
 *     soloTackles: 5,
 *     tacklesForLoss: 1.0,
 *     sacks: 0,
 *     interceptions: 0,
 *     passesDefended: 1,
 *     fumblesRecovered: 0,
 *     team: 'opponent'
 *   }
 * ];
 *
 * <DefenseStatsChart
 *   data={data}
 *   title="Defensive Leaders"
 *   height={400}
 *   showLegend={true}
 * />
 * ```
 */
export const DefenseStatsChart = React.forwardRef<
  HTMLDivElement,
  DefenseStatsChartProps
>(
  (
    {
      data,
      title = 'DEFENSIVE STATISTICS',
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
    const getBarColor = (player: DefenseStatsData) => {
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
                value: 'Total Tackles',
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
              dataKey="tackles"
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
                  dataKey="tackles"
                  fill={getBarColor(entry)}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        {/* Stats summary below chart */}
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 sm:gap-3 text-xs sm:text-sm">
          <div className="text-center p-2 bg-gray-50 rounded">
            <div className="font-semibold text-gray-900">Solo</div>
            <div className="text-gray-600 mt-1">
              {data.map((p, i) => (
                <div key={i} className="truncate" style={{ color: getBarColor(p) }}>
                  {p.soloTackles}
                </div>
              ))}
            </div>
          </div>
          <div className="text-center p-2 bg-gray-50 rounded">
            <div className="font-semibold text-gray-900">TFL</div>
            <div className="text-gray-600 mt-1">
              {data.map((p, i) => (
                <div key={i} className="truncate" style={{ color: getBarColor(p) }}>
                  {p.tacklesForLoss}
                </div>
              ))}
            </div>
          </div>
          <div className="text-center p-2 bg-gray-50 rounded">
            <div className="font-semibold text-gray-900">Sacks</div>
            <div className="text-gray-600 mt-1">
              {data.map((p, i) => (
                <div key={i} className="truncate" style={{ color: getBarColor(p) }}>
                  {p.sacks}
                </div>
              ))}
            </div>
          </div>
          <div className="text-center p-2 bg-gray-50 rounded">
            <div className="font-semibold text-gray-900">INT</div>
            <div className="text-gray-600 mt-1">
              {data.map((p, i) => (
                <div key={i} className="truncate" style={{ color: getBarColor(p) }}>
                  {p.interceptions}
                </div>
              ))}
            </div>
          </div>
          <div className="text-center p-2 bg-gray-50 rounded">
            <div className="font-semibold text-gray-900">PD</div>
            <div className="text-gray-600 mt-1">
              {data.map((p, i) => (
                <div key={i} className="truncate" style={{ color: getBarColor(p) }}>
                  {p.passesDefended}
                </div>
              ))}
            </div>
          </div>
          <div className="text-center p-2 bg-gray-50 rounded">
            <div className="font-semibold text-gray-900">FR</div>
            <div className="text-gray-600 mt-1">
              {data.map((p, i) => (
                <div key={i} className="truncate" style={{ color: getBarColor(p) }}>
                  {p.fumblesRecovered}
                </div>
              ))}
            </div>
          </div>
          <div className="text-center p-2 bg-gray-50 rounded">
            <div className="font-semibold text-gray-900">Assists</div>
            <div className="text-gray-600 mt-1">
              {data.map((p, i) => (
                <div key={i} className="truncate" style={{ color: getBarColor(p) }}>
                  {p.tackles - p.soloTackles}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
);

DefenseStatsChart.displayName = 'DefenseStatsChart';
