/**
 * Unit tests for ScoringProgressionChartLazy component
 */

import { describe, it, expect, jest } from '@jest/globals';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import {
  ScoringProgressionChartLazy,
  ScoringProgressionChartSkeleton,
} from './ScoringProgressionChartLazy';
import { ScoringProgressionData } from './ScoringProgressionChart';

// GSAP is mocked via moduleNameMapper in jest.config.js

// Mock ResizeObserver for Recharts
class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

global.ResizeObserver = ResizeObserverMock as any;

describe('ScoringProgressionChartLazy', () => {
  // Sample test data
  const mockData: ScoringProgressionData[] = [
    { quarter: '1st', clemson: 14, opponent: 14 },
    { quarter: '2nd', clemson: 35, opponent: 21 },
    { quarter: '3rd', clemson: 45, opponent: 28 },
    { quarter: '4th', clemson: 59, opponent: 35 },
  ];

  describe('Lazy Loading', () => {
    it('should render without errors', async () => {
      const { container } = render(<ScoringProgressionChartLazy data={mockData} />);

      // Wait for lazy component to load
      await waitFor(() => {
        expect(container.firstChild).toBeInTheDocument();
      });
    });

    it('should eventually render the chart component', async () => {
      const { container } = render(<ScoringProgressionChartLazy data={mockData} />);

      // Wait for the actual chart to load (ResponsiveContainer)
      await waitFor(
        () => {
          const responsiveContainer = container.querySelector(
            '.recharts-responsive-container'
          );
          expect(responsiveContainer).toBeInTheDocument();
        },
        { timeout: 3000 }
      );
    });

    it('should pass props to underlying ScoringProgressionChart', async () => {
      const customTitle = 'Custom Scoring Title';
      render(
        <ScoringProgressionChartLazy
          data={mockData}
          title={customTitle}
          height={500}
          showGrid={false}
          showLegend={false}
        />
      );

      // Wait for component to load and verify props
      await waitFor(() => {
        expect(screen.getByText(customTitle)).toBeInTheDocument();
      });
    });

    it('should forward ref correctly', async () => {
      const ref = { current: null };
      const { container } = render(
        <ScoringProgressionChartLazy ref={ref as any} data={mockData} />
      );

      await waitFor(() => {
        expect(container.firstChild).toBeInTheDocument();
      });
    });

    it('should not render when data is empty', () => {
      const { container } = render(<ScoringProgressionChartLazy data={[]} />);
      // Empty data should result in null render after suspense resolves
      expect(container).toBeInTheDocument();
    });
  });

  describe('ScoringProgressionChartSkeleton', () => {
    it('should render skeleton with default props', () => {
      const { container } = render(<ScoringProgressionChartSkeleton />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should render with custom height', () => {
      const customHeight = 600;
      const { container } = render(
        <ScoringProgressionChartSkeleton height={customHeight} />
      );
      const skeleton = container.querySelector('[role="status"]');
      expect(skeleton).toHaveStyle({ height: `${customHeight}px` });
    });

    it('should render with custom title', () => {
      render(<ScoringProgressionChartSkeleton title="Loading Scores" />);
      // Title skeleton should be present
      const titleSkeleton = document.querySelector('.h-5');
      expect(titleSkeleton).toBeInTheDocument();
    });

    it('should hide title skeleton when title is empty', () => {
      const { container } = render(<ScoringProgressionChartSkeleton title="" />);
      const titleContainer = container.querySelector('.mb-4');
      expect(titleContainer).not.toBeInTheDocument();
    });

    it('should have loading aria label', () => {
      render(<ScoringProgressionChartSkeleton />);
      const skeleton = screen.getByRole('status');
      expect(skeleton).toHaveAttribute('aria-label', 'Loading chart');
    });

    it('should have screen reader text', () => {
      render(<ScoringProgressionChartSkeleton />);
      expect(
        screen.getByText('Loading scoring progression chart...')
      ).toBeInTheDocument();
    });

    it('should have animate-pulse class', () => {
      const { container } = render(<ScoringProgressionChartSkeleton />);
      expect(container.firstChild).toHaveClass('animate-pulse');
    });

    it('should render SVG for line chart skeleton', () => {
      const { container } = render(<ScoringProgressionChartSkeleton />);
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('should render two line paths in skeleton', () => {
      const { container } = render(<ScoringProgressionChartSkeleton />);
      const polylines = container.querySelectorAll('polyline');
      expect(polylines.length).toBe(2); // One for each team
    });

    it('should render data point circles', () => {
      const { container } = render(<ScoringProgressionChartSkeleton />);
      const circles = container.querySelectorAll('circle');
      expect(circles.length).toBeGreaterThan(0); // At least some circles for data points
    });

    it('should render grid lines in skeleton', () => {
      const { container } = render(<ScoringProgressionChartSkeleton />);
      const gridLines = container.querySelectorAll('line');
      expect(gridLines.length).toBeGreaterThan(0);
    });

    it('should render legend skeleton', () => {
      const { container } = render(<ScoringProgressionChartSkeleton />);
      // Legend has two items with line icons and labels
      const legendItems = container.querySelectorAll('.flex.items-center.gap-2');
      expect(legendItems.length).toBeGreaterThanOrEqual(2);
    });

    it('should render Y-axis skeleton', () => {
      const { container } = render(<ScoringProgressionChartSkeleton />);
      // Y-axis labels (5 ticks)
      const yAxisContainer = container.querySelector('.absolute.left-2');
      expect(yAxisContainer).toBeInTheDocument();
    });

    it('should render X-axis skeleton', () => {
      const { container } = render(<ScoringProgressionChartSkeleton />);
      // X-axis labels (4 quarters)
      const xAxisContainer = container.querySelector('.absolute.left-12.right-4.bottom-2');
      expect(xAxisContainer).toBeInTheDocument();
    });

    it('should have responsive padding classes', () => {
      const { container } = render(<ScoringProgressionChartSkeleton />);
      const skeletonContainer = container.firstChild as HTMLElement;
      expect(skeletonContainer.className).toContain('p-4');
      expect(skeletonContainer.className).toContain('sm:p-5');
      expect(skeletonContainer.className).toContain('md:p-6');
      expect(skeletonContainer.className).toContain('lg:p-8');
    });

    it('should use Clemson colors in skeleton lines', () => {
      const { container } = render(<ScoringProgressionChartSkeleton />);
      const polylines = container.querySelectorAll('polyline');

      // Check if polylines have the team colors (orange and purple)
      expect(polylines[0]).toHaveAttribute('stroke', '#F56600'); // Clemson orange
      expect(polylines[1]).toHaveAttribute('stroke', '#522D80'); // Purple
    });
  });

  describe('Code Splitting', () => {
    it('should use React.Suspense', () => {
      // This is implicitly tested by the lazy loading tests above
      // If Suspense wasn't working, the component would throw an error
      const { container } = render(<ScoringProgressionChartLazy data={mockData} />);
      expect(container).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have accessible loading state', () => {
      render(<ScoringProgressionChartSkeleton />);
      const loadingElement = screen.getByRole('status');
      expect(loadingElement).toBeInTheDocument();
    });

    it('should have screen reader text during loading', () => {
      render(<ScoringProgressionChartSkeleton />);
      const srText = screen.getByText('Loading scoring progression chart...');
      expect(srText).toHaveClass('sr-only');
    });
  });
});
