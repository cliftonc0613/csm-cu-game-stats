'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';

export interface TableColumn {
  /**
   * Unique key for the column
   */
  key: string;
  /**
   * Display label for the column header
   */
  label: string;
  /**
   * Whether this column is sortable
   * @default false
   */
  sortable?: boolean;
  /**
   * Optional custom render function for cell content
   */
  render?: (value: any, row: TableRow) => React.ReactNode;
  /**
   * Text alignment
   * @default 'left'
   */
  align?: 'left' | 'center' | 'right';
  /**
   * Optional width (CSS value)
   */
  width?: string;
}

export interface TableRow {
  /**
   * Unique identifier for the row
   */
  id: string | number;
  /**
   * Row data with keys matching column keys
   */
  [key: string]: any;
}

export interface GameTableProps {
  /**
   * Column definitions
   */
  columns: TableColumn[];
  /**
   * Table data rows
   */
  data: TableRow[];
  /**
   * Optional table caption
   */
  caption?: string;
  /**
   * Whether to show table borders
   * @default true
   */
  showBorders?: boolean;
  /**
   * Whether to enable row striping
   * @default false
   */
  striped?: boolean;
  /**
   * Whether to enable hover effects
   * @default true
   */
  hoverable?: boolean;
  /**
   * Additional CSS classes
   */
  className?: string;
  /**
   * Callback when sort changes
   */
  onSortChange?: (column: string, direction: 'asc' | 'desc') => void;
}

type SortState = {
  column: string | null;
  direction: 'asc' | 'desc';
};

/**
 * GameTable Component
 *
 * Displays a sortable table with:
 * - Shadcn Table component as base
 * - Accepts table data as props (columns and rows)
 * - Sortable columns with sort indicators
 * - Clemson brand styling (borders, text colors)
 * - Responsive horizontal scroll on mobile
 */
export function GameTable({
  columns,
  data,
  caption,
  showBorders = true,
  striped = false,
  hoverable = true,
  className,
  onSortChange,
}: GameTableProps) {
  const [sortState, setSortState] = useState<SortState>({
    column: null,
    direction: 'asc',
  });

  // Handle column sort
  const handleSort = (columnKey: string) => {
    const column = columns.find((col) => col.key === columnKey);
    if (!column?.sortable) return;

    const newDirection =
      sortState.column === columnKey && sortState.direction === 'asc'
        ? 'desc'
        : 'asc';

    setSortState({ column: columnKey, direction: newDirection });
    onSortChange?.(columnKey, newDirection);
  };

  // Sort data based on current sort state
  const sortedData = [...data].sort((a, b) => {
    if (!sortState.column) return 0;

    const aValue = a[sortState.column];
    const bValue = b[sortState.column];

    // Handle different types
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortState.direction === 'asc' ? aValue - bValue : bValue - aValue;
    }

    // String comparison
    const aStr = String(aValue || '').toLowerCase();
    const bStr = String(bValue || '').toLowerCase();

    if (aStr < bStr) return sortState.direction === 'asc' ? -1 : 1;
    if (aStr > bStr) return sortState.direction === 'asc' ? 1 : -1;
    return 0;
  });

  // Render sort indicator
  const renderSortIndicator = (columnKey: string) => {
    if (sortState.column === columnKey) {
      return sortState.direction === 'asc' ? (
        <ChevronUp className="ml-1 h-4 w-4 inline-block" />
      ) : (
        <ChevronDown className="ml-1 h-4 w-4 inline-block" />
      );
    }
    return <ChevronsUpDown className="ml-1 h-4 w-4 inline-block opacity-50" />;
  };

  return (
    <div
      className={cn(
        'w-full rounded-lg',
        showBorders && 'border border-clemson-orange/20',
        className
      )}
    >
      {/* Responsive container with horizontal scroll on mobile */}
      <div className="w-full overflow-x-auto">
        <Table>
          {caption && (
            <caption className="text-sm text-muted-foreground mb-4">
              {caption}
            </caption>
          )}
          <TableHeader>
            <TableRow className="border-b-2 border-clemson-orange/30 hover:bg-transparent">
              {columns.map((column) => (
                <TableHead
                  key={column.key}
                  className={cn(
                    'font-semibold text-clemson-dark uppercase tracking-wide',
                    column.align === 'center' && 'text-center',
                    column.align === 'right' && 'text-right',
                    column.sortable && 'cursor-pointer select-none hover:bg-muted/50',
                    'transition-colors'
                  )}
                  style={{ width: column.width }}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className="flex items-center">
                    {column.label}
                    {column.sortable && renderSortIndicator(column.key)}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="text-center py-8 text-muted-foreground"
                >
                  No data available
                </TableCell>
              </TableRow>
            ) : (
              sortedData.map((row, rowIndex) => (
                <TableRow
                  key={row.id}
                  className={cn(
                    'border-b border-muted',
                    hoverable && 'hover:bg-muted/30',
                    striped && rowIndex % 2 === 1 && 'bg-muted/10'
                  )}
                >
                  {columns.map((column) => {
                    const value = row[column.key];
                    const displayValue = column.render
                      ? column.render(value, row)
                      : value;

                    return (
                      <TableCell
                        key={`${row.id}-${column.key}`}
                        className={cn(
                          'text-clemson-dark',
                          column.align === 'center' && 'text-center',
                          column.align === 'right' && 'text-right'
                        )}
                      >
                        {displayValue}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
