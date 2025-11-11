import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { StatCardGrid } from './StatCardGrid';

describe('StatCardGrid Component', () => {
  const mockStats = [
    { value: 1, ordinal: 'st', label: 'ACC Standing' },
    { value: 3, ordinal: 'rd', label: 'Total Defense' },
    { value: 12, ordinal: 'th', label: 'Rushing Offense' },
    { value: 7, ordinal: 'th', label: 'Pass Efficiency' },
  ];

  describe('Basic Rendering', () => {
    it('should render all stat cards in the grid', () => {
      render(<StatCardGrid stats={mockStats} />);

      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('ACC Standing')).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument();
      expect(screen.getByText('Total Defense')).toBeInTheDocument();
      expect(screen.getByText('12')).toBeInTheDocument();
      expect(screen.getByText('Rushing Offense')).toBeInTheDocument();
      expect(screen.getByText('7')).toBeInTheDocument();
      expect(screen.getByText('Pass Efficiency')).toBeInTheDocument();
    });

    it('should render with single stat card', () => {
      render(
        <StatCardGrid stats={[{ value: 42, label: 'Points' }]} />
      );

      expect(screen.getByText('42')).toBeInTheDocument();
      expect(screen.getByText('Points')).toBeInTheDocument();
    });

    it('should render empty grid when stats array is empty', () => {
      const { container } = render(<StatCardGrid stats={[]} />);

      const grid = container.querySelector('.grid');
      expect(grid).toBeInTheDocument();
      expect(grid?.children.length).toBe(0);
    });
  });

  describe('Column Layout', () => {
    it('should apply 4-column layout', () => {
      const { container } = render(
        <StatCardGrid stats={mockStats} columns={4} />
      );

      const grid = container.querySelector('.lg\\:grid-cols-4');
      expect(grid).toBeInTheDocument();
    });

    it('should apply 3-column layout', () => {
      const { container } = render(
        <StatCardGrid stats={mockStats} columns={3} />
      );

      const grid = container.querySelector('.lg\\:grid-cols-3');
      expect(grid).toBeInTheDocument();
    });

    it('should apply 2-column layout', () => {
      const { container } = render(
        <StatCardGrid stats={mockStats} columns={2} />
      );

      const grid = container.querySelector('.lg\\:grid-cols-2');
      expect(grid).toBeInTheDocument();
    });

    it('should default to 4 columns when not specified', () => {
      const { container } = render(<StatCardGrid stats={mockStats} />);

      const grid = container.querySelector('.lg\\:grid-cols-4');
      expect(grid).toBeInTheDocument();
    });

    it('should always have 1 column on mobile', () => {
      const { container } = render(
        <StatCardGrid stats={mockStats} columns={4} />
      );

      const grid = container.querySelector('.grid-cols-1');
      expect(grid).toBeInTheDocument();
    });

    it('should have 2 columns on tablet (sm)', () => {
      const { container } = render(
        <StatCardGrid stats={mockStats} columns={4} />
      );

      const grid = container.querySelector('.sm\\:grid-cols-2');
      expect(grid).toBeInTheDocument();
    });
  });

  describe('Auto-Alternating Colors', () => {
    it('should auto-alternate colors starting with orange', () => {
      const { container } = render(
        <StatCardGrid
          stats={mockStats}
          autoAlternate={true}
          startColor="orange"
        />
      );

      const orangeCards = container.querySelectorAll('.bg-clemson-orange');
      const purpleCards = container.querySelectorAll('.bg-clemson-purple');

      // With 4 stats: orange, purple, orange, purple
      expect(orangeCards.length).toBe(2);
      expect(purpleCards.length).toBe(2);
    });

    it('should auto-alternate colors starting with purple', () => {
      const { container } = render(
        <StatCardGrid
          stats={mockStats}
          autoAlternate={true}
          startColor="purple"
        />
      );

      const orangeCards = container.querySelectorAll('.bg-clemson-orange');
      const purpleCards = container.querySelectorAll('.bg-clemson-purple');

      // With 4 stats: purple, orange, purple, orange
      expect(orangeCards.length).toBe(2);
      expect(purpleCards.length).toBe(2);
    });

    it('should respect explicit variant when autoAlternate is false', () => {
      const stats = [
        { value: 10, label: 'Wins', variant: 'orange' as const },
        { value: 2, label: 'Losses', variant: 'purple' as const },
        { value: 85, label: 'Win %', variant: 'orange' as const },
        { value: 456, label: 'Points', variant: 'purple' as const },
      ];

      const { container } = render(
        <StatCardGrid stats={stats} autoAlternate={false} />
      );

      const orangeCards = container.querySelectorAll('.bg-clemson-orange');
      const purpleCards = container.querySelectorAll('.bg-clemson-purple');

      expect(orangeCards.length).toBe(2);
      expect(purpleCards.length).toBe(2);
    });
  });

  describe('Gap Spacing', () => {
    it('should apply small gap spacing', () => {
      const { container } = render(
        <StatCardGrid stats={mockStats} gap="sm" />
      );

      const grid = container.querySelector('.gap-3');
      expect(grid).toBeInTheDocument();
    });

    it('should apply medium gap spacing', () => {
      const { container } = render(
        <StatCardGrid stats={mockStats} gap="md" />
      );

      const grid = container.querySelector('.gap-4');
      expect(grid).toBeInTheDocument();
    });

    it('should apply large gap spacing', () => {
      const { container } = render(
        <StatCardGrid stats={mockStats} gap="lg" />
      );

      const grid = container.querySelector('.gap-6');
      expect(grid).toBeInTheDocument();
    });

    it('should default to medium gap when not specified', () => {
      const { container } = render(<StatCardGrid stats={mockStats} />);

      const grid = container.querySelector('.gap-4');
      expect(grid).toBeInTheDocument();
    });
  });

  describe('Custom ClassName', () => {
    it('should apply custom className to grid', () => {
      const { container } = render(
        <StatCardGrid stats={mockStats} className="custom-grid" />
      );

      const grid = container.querySelector('.custom-grid');
      expect(grid).toBeInTheDocument();
    });
  });

  describe('Stat Props Pass-through', () => {
    it('should pass through stat size to StatCard', () => {
      const stats = [
        { value: 42, label: 'Large Stat', size: 'lg' as const },
      ];

      render(<StatCardGrid stats={stats} />);

      expect(screen.getByText('42')).toBeInTheDocument();
      expect(screen.getByText('Large Stat')).toBeInTheDocument();
    });

    it('should pass through stat descriptions', () => {
      const stats = [
        {
          value: 489,
          label: 'Total Yards',
          description: 'offense',
        },
      ];

      render(<StatCardGrid stats={stats} />);

      expect(screen.getByText('489')).toBeInTheDocument();
      expect(screen.getByText('Total Yards')).toBeInTheDocument();
      expect(screen.getByText('offense')).toBeInTheDocument();
    });

    it('should pass through ordinals', () => {
      const stats = [
        { value: 1, ordinal: 'st', label: 'Rank' },
        { value: 3, ordinal: 'rd', label: 'Defense' },
      ];

      render(<StatCardGrid stats={stats} />);

      expect(screen.getByText('st')).toBeInTheDocument();
      expect(screen.getByText('rd')).toBeInTheDocument();
    });
  });

  describe('Responsive Behavior', () => {
    it('should have responsive grid classes', () => {
      const { container } = render(
        <StatCardGrid stats={mockStats} columns={4} />
      );

      const grid = container.querySelector('.grid');
      expect(grid).toHaveClass('grid-cols-1'); // mobile
      expect(grid).toHaveClass('sm:grid-cols-2'); // tablet
      expect(grid).toHaveClass('lg:grid-cols-4'); // desktop
    });
  });

  describe('Complex Scenarios', () => {
    it('should render grid with mixed stat types', () => {
      const mixedStats = [
        { value: 99, ordinal: 'th', label: 'National Rank', size: 'lg' as const },
        { value: 489, label: 'Total Yards', description: 'offense' },
        { value: 1, ordinal: 'st', label: 'ACC Standing', variant: 'purple' as const },
        { value: 42, label: 'Points', size: 'md' as const },
      ];

      render(<StatCardGrid stats={mixedStats} columns={4} gap="lg" />);

      expect(screen.getByText('99')).toBeInTheDocument();
      expect(screen.getByText('th')).toBeInTheDocument();
      expect(screen.getByText('489')).toBeInTheDocument();
      expect(screen.getByText('offense')).toBeInTheDocument();
      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('st')).toBeInTheDocument();
      expect(screen.getByText('42')).toBeInTheDocument();
    });

    it('should handle grid with many items', () => {
      const manyStats = Array.from({ length: 12 }, (_, i) => ({
        value: i + 1,
        label: `Stat ${i + 1}`,
      }));

      render(<StatCardGrid stats={manyStats} columns={4} />);

      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('12')).toBeInTheDocument();
      expect(screen.getByText('Stat 1')).toBeInTheDocument();
      expect(screen.getByText('Stat 12')).toBeInTheDocument();
    });
  });
});
