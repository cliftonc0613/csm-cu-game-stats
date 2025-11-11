/**
 * Utility functions for table data manipulation
 */

import type { TableColumn, TableRow } from '@/components/game/GameTable';

/**
 * Helper function to create table columns
 * @param columns - Array of column definitions
 * @returns Typed TableColumn array
 */
export function createTableColumns(
  columns: Array<{
    key: string;
    label: string;
    sortable?: boolean;
    render?: (value: any, row: TableRow) => React.ReactNode;
    align?: 'left' | 'center' | 'right';
    width?: string;
  }>
): TableColumn[] {
  return columns;
}
