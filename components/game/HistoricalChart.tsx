'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { cn } from '@/lib/utils';
import { fadeInUp } from '@/lib/utils/animations';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { CLEMSON_COLORS } from '@/lib/constants/colors';

export interface ChartDataPoint {
  /**
   * X-axis value (typically year)
   */
  year: number | string;
  /**
   * Clemson data point value
   */
  clemson: number;
  /**
   * Opponent data point value
   */
  opponent: number;
  /**
   * Optional label for the data point
   */
  label?: string;
}

export interface HistoricalChartProps {
  /**
   * Chart data points
   */
  data: ChartDataPoint[];
  /**
   * Chart title (displayed in uppercase)
   */
  title?: string;
  /**
   * Chart type
   * @default 'area'
   */
  type?: 'line' | 'area';
  /**
   * Height of the chart in pixels
   * @default 400
   */
  height?: number;
  /**
   * Y-axis label
   */
  yAxisLabel?: string;
  /**
   * X-axis label
   */
  xAxisLabel?: string;
  /**
   * Label for Clemson data
   * @default 'Clemson'
   */
  clemsonLabel?: string;
  /**
   * Label for opponent data
   * @default 'Opponent'
   */
  opponentLabel?: string;
  /**
   * Whether to show grid lines
   * @default true
   */
  showGrid?: boolean;
  /**
   * Whether to show legend
   * @default true
   */
  showLegend?: boolean;
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * Custom tooltip component for the chart
 */
const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload || !payload.length) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-3">
      <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
        {label}
      </p>
      {payload.map((entry: any, index: number) => (
        <div key={`item-${index}`} className="flex items-center gap-2 text-sm">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-gray-600 dark:text-gray-300">
            {entry.name}:
          </span>
          <span className="font-semibold text-gray-900 dark:text-gray-100">
            {entry.value}
          </span>
        </div>
      ))}
    </div>
  );
};

/**
 * HistoricalChart Component
 *
 * Displays a line or area chart with:
 * - Dual-color overlays (orange for Clemson, purple for opponent)
 * - Semi-transparent area fills for overlap visibility
 * - Subtle grid lines for readability
 * - Clear axis labels
 * - Chart title in uppercase
 * - Responsive sizing
 * - Hover tooltips showing precise values
 */
export function HistoricalChart({
  data,
  title,
  type = 'area',
  height = 400,
  yAxisLabel,
  xAxisLabel,
  clemsonLabel = 'Clemson',
  opponentLabel = 'Opponent',
  showGrid = true,
  showLegend = true,
  className,
}: HistoricalChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const ChartComponent = type === 'area' ? AreaChart : LineChart;
  const DataComponent = type === 'area' ? Area : Line;

  // Scroll reveal animation
  useGSAP(
    () => {
      if (chartRef.current) {
        fadeInUp(chartRef.current, {
          duration: 0.6,
          y: 40,
        });
      }
    },
    { scope: chartRef }
  );

  return (
    <div ref={chartRef} className={cn('w-full', className)}>
      {/* Chart Title */}
      {title && (
        <h3 className="text-lg md:text-xl font-semibold uppercase tracking-wide text-center mb-4 md:mb-6">
          {title}
        </h3>
      )}

      {/* Chart Container */}
      <div className="w-full" style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <ChartComponent
            data={data}
            margin={{
              top: 10,
              right: 30,
              left: 0,
              bottom: 20,
            }}
          >
            {/* Grid Lines (subtle) */}
            {showGrid && (
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#e5e7eb"
                strokeOpacity={0.5}
              />
            )}

            {/* X Axis */}
            <XAxis
              dataKey="year"
              label={
                xAxisLabel
                  ? {
                      value: xAxisLabel,
                      position: 'insideBottom',
                      offset: -10,
                      style: { fontSize: '14px', fill: '#6b7280' },
                    }
                  : undefined
              }
              tick={{ fontSize: 12, fill: '#6b7280' }}
              stroke="#9ca3af"
            />

            {/* Y Axis */}
            <YAxis
              label={
                yAxisLabel
                  ? {
                      value: yAxisLabel,
                      angle: -90,
                      position: 'insideLeft',
                      style: { fontSize: '14px', fill: '#6b7280' },
                    }
                  : undefined
              }
              tick={{ fontSize: 12, fill: '#6b7280' }}
              stroke="#9ca3af"
            />

            {/* Tooltip */}
            <Tooltip content={<CustomTooltip />} />

            {/* Legend */}
            {showLegend && (
              <Legend
                wrapperStyle={{
                  paddingTop: '20px',
                  fontSize: '14px',
                }}
                iconType="circle"
              />
            )}

            {/* Clemson Data (Orange) */}
            <DataComponent
              type="monotone"
              dataKey="clemson"
              name={clemsonLabel}
              stroke={CLEMSON_COLORS.orange}
              fill={CLEMSON_COLORS.orange}
              fillOpacity={type === 'area' ? 0.3 : undefined}
              strokeWidth={3}
              dot={{ fill: CLEMSON_COLORS.orange, r: 4 }}
              activeDot={{ r: 6 }}
            />

            {/* Opponent Data (Purple) */}
            <DataComponent
              type="monotone"
              dataKey="opponent"
              name={opponentLabel}
              stroke={CLEMSON_COLORS.purple}
              fill={CLEMSON_COLORS.purple}
              fillOpacity={type === 'area' ? 0.3 : undefined}
              strokeWidth={3}
              dot={{ fill: CLEMSON_COLORS.purple, r: 4 }}
              activeDot={{ r: 6 }}
            />
          </ChartComponent>
        </ResponsiveContainer>
      </div>

      {/* Axis Labels (if not using built-in labels) */}
      {(xAxisLabel || yAxisLabel) && !showGrid && (
        <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground">
          {yAxisLabel && <span className="rotate-[-90deg]">{yAxisLabel}</span>}
          {xAxisLabel && <span className="ml-auto">{xAxisLabel}</span>}
        </div>
      )}
    </div>
  );
}
