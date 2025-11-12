/**
 * Unit tests for table utility functions
 */

import { describe, it, expect } from '@jest/globals';
import { createTableColumns } from './tables';

describe('createTableColumns', () => {
  it('should create table columns with basic properties', () => {
    const columns = createTableColumns([
      { key: 'name', label: 'Name' },
      { key: 'score', label: 'Score' },
      { key: 'rank', label: 'Rank' },
    ]);

    expect(columns).toHaveLength(3);
    expect(columns[0]).toEqual({ key: 'name', label: 'Name' });
    expect(columns[1]).toEqual({ key: 'score', label: 'Score' });
    expect(columns[2]).toEqual({ key: 'rank', label: 'Rank' });
  });

  it('should handle sortable columns', () => {
    const columns = createTableColumns([
      { key: 'name', label: 'Name', sortable: true },
      { key: 'score', label: 'Score', sortable: true },
      { key: 'id', label: 'ID', sortable: false },
    ]);

    expect(columns[0].sortable).toBe(true);
    expect(columns[1].sortable).toBe(true);
    expect(columns[2].sortable).toBe(false);
  });

  it('should handle alignment options', () => {
    const columns = createTableColumns([
      { key: 'name', label: 'Name', align: 'left' },
      { key: 'score', label: 'Score', align: 'center' },
      { key: 'rank', label: 'Rank', align: 'right' },
    ]);

    expect(columns[0].align).toBe('left');
    expect(columns[1].align).toBe('center');
    expect(columns[2].align).toBe('right');
  });

  it('should handle width property', () => {
    const columns = createTableColumns([
      { key: 'name', label: 'Name', width: '200px' },
      { key: 'score', label: 'Score', width: '100px' },
      { key: 'rank', label: 'Rank', width: '80px' },
    ]);

    expect(columns[0].width).toBe('200px');
    expect(columns[1].width).toBe('100px');
    expect(columns[2].width).toBe('80px');
  });

  it('should handle custom render functions', () => {
    const renderFn = (value: any) => value.toUpperCase();

    const columns = createTableColumns([
      { key: 'name', label: 'Name', render: renderFn },
      { key: 'score', label: 'Score' },
    ]);

    expect(columns[0].render).toBe(renderFn);
    expect(columns[1].render).toBeUndefined();
  });

  it('should handle all properties combined', () => {
    const renderFn = (value: any) => `${value}pts`;

    const columns = createTableColumns([
      {
        key: 'score',
        label: 'Score',
        sortable: true,
        align: 'right',
        width: '100px',
        render: renderFn,
      },
    ]);

    expect(columns[0]).toEqual({
      key: 'score',
      label: 'Score',
      sortable: true,
      align: 'right',
      width: '100px',
      render: renderFn,
    });
  });

  it('should handle empty array', () => {
    const columns = createTableColumns([]);
    expect(columns).toEqual([]);
  });
});
