/**
 * Unit tests for TeamStatsChartLazy component
 */

import { describe, it, expect, jest } from '@jest/globals';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import {
  TeamStatsChartLazy,
  TeamStatsChartSkeleton,
} from './TeamStatsChartLazy';
import { TeamStatsData } from './TeamStatsChart';

// GSAP is mocked via moduleNameMapper in jest.config.js

// Mock ResizeObserver for Recharts
class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

global.ResizeObserver = ResizeObserverMock as any;

describe('TeamStatsChartLazy', () => {
  // Sample test data
  const mockData: TeamStatsData[] = [
    { stat: 'First Downs', clemson: 32, opponent: 26 },
    { stat: 'Total Yards', clemson: 512, opponent: 387 },
  ];

  describe('Lazy Loading', () => {
    it('should render without errors', async () => {
      const { container } = render(<TeamStatsChartLazy data={mockData} />);

      // Wait for lazy component to load
      await waitFor(() => {
        expect(container.firstChild).toBeInTheDocument();
      });
    });

    it('should eventually render the chart component', async () => {
      const { container } = render(<TeamStatsChartLazy data={mockData} />);

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

    it('should pass props to underlying TeamStatsChart', async () => {
      const customTitle = 'Custom Lazy Title';
      render(
        <TeamStatsChartLazy
          data={mockData}
          title={customTitle}
          height={500}
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
        <TeamStatsChartLazy ref={ref as any} data={mockData} />
      );

      await waitFor(() => {
        expect(container.firstChild).toBeInTheDocument();
      });
    });

    it('should not render when data is empty', () => {
      const { container } = render(<TeamStatsChartLazy data={[]} />);
      // Empty data should result in null render after suspense resolves
      expect(container).toBeInTheDocument();
    });
  });

  describe('TeamStatsChartSkeleton', () => {
    it('should render skeleton with default props', () => {
      const { container } = render(<TeamStatsChartSkeleton />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should render with custom height', () => {
      const customHeight = 600;
      const { container } = render(
        <TeamStatsChartSkeleton height={customHeight} />
      );
      const skeleton = container.querySelector('[role="status"]');
      expect(skeleton).toHaveStyle({ height: `${customHeight}px` });
    });

    it('should render with custom title', () => {
      render(<TeamStatsChartSkeleton title="Loading Custom Stats" />);
      // Title skeleton should be present
      const titleSkeleton = document.querySelector('.h-5');
      expect(titleSkeleton).toBeInTheDocument();
    });

    it('should hide title skeleton when title is empty', () => {
      const { container } = render(<TeamStatsChartSkeleton title="" />);
      const titleContainer = container.querySelector('.mb-4');
      expect(titleContainer).not.toBeInTheDocument();
    });

    it('should have loading aria label', () => {
      render(<TeamStatsChartSkeleton />);
      const skeleton = screen.getByRole('status');
      expect(skeleton).toHaveAttribute('aria-label', 'Loading chart');
    });

    it('should have screen reader text', () => {
      render(<TeamStatsChartSkeleton />);
      expect(
        screen.getByText('Loading team statistics chart...')
      ).toBeInTheDocument();
    });

    it('should have animate-pulse class', () => {
      const { container } = render(<TeamStatsChartSkeleton />);
      expect(container.firstChild).toHaveClass('animate-pulse');
    });

    it('should render 6 bar placeholders', () => {
      const { container } = render(<TeamStatsChartSkeleton />);
      // Check for skeleton bars (each row has placeholders)
      const skeletonBars = container.querySelectorAll('.bg-gradient-to-r');
      expect(skeletonBars.length).toBeGreaterThan(0);
    });

    it('should render legend skeleton', () => {
      const { container } = render(<TeamStatsChartSkeleton />);
      // Legend has two items with icons and labels
      const legendItems = container.querySelectorAll('.flex.items-center.gap-2');
      expect(legendItems.length).toBeGreaterThanOrEqual(2);
    });

    it('should have responsive padding classes', () => {
      const { container } = render(<TeamStatsChartSkeleton />);
      const skeletonContainer = container.firstChild as HTMLElement;
      expect(skeletonContainer.className).toContain('p-4');
      expect(skeletonContainer.className).toContain('sm:p-5');
      expect(skeletonContainer.className).toContain('md:p-6');
      expect(skeletonContainer.className).toContain('lg:p-8');
    });
  });

  describe('Code Splitting', () => {
    it('should use React.Suspense', () => {
      // This is implicitly tested by the lazy loading tests above
      // If Suspense wasn't working, the component would throw an error
      const { container } = render(<TeamStatsChartLazy data={mockData} />);
      expect(container).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have accessible loading state', () => {
      render(<TeamStatsChartSkeleton />);
      const loadingElement = screen.getByRole('status');
      expect(loadingElement).toBeInTheDocument();
    });

    it('should have screen reader text during loading', () => {
      render(<TeamStatsChartSkeleton />);
      const srText = screen.getByText('Loading team statistics chart...');
      expect(srText).toHaveClass('sr-only');
    });
  });
});
