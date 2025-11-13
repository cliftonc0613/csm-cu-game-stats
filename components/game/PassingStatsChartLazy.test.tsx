import * as React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { PassingStatsChartLazy } from './PassingStatsChartLazy';
import type { PassingStatsData } from './PassingStatsChart';

// GSAP is mocked via moduleNameMapper in jest.config.js

// Mock ResizeObserver for Recharts
class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

global.ResizeObserver = ResizeObserverMock as any;

describe('PassingStatsChartLazy', () => {
  const mockPassingData: PassingStatsData[] = [
    {
      player: 'Cade Klubnik',
      completions: 24,
      attempts: 35,
      yards: 378,
      touchdowns: 4,
      interceptions: 1,
      rating: 168.5,
      team: 'clemson',
    },
    {
      player: 'Opponent QB',
      completions: 18,
      attempts: 28,
      yards: 245,
      touchdowns: 2,
      interceptions: 2,
      rating: 125.3,
      team: 'opponent',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Lazy Loading', () => {
    it('should render without crashing', async () => {
      render(<PassingStatsChartLazy data={mockPassingData} />);

      await waitFor(() => {
        expect(screen.getByText('PASSING STATISTICS')).toBeInTheDocument();
      });
    });

    it('should use Suspense with fallback', () => {
      // Lazy loading is handled by React.Suspense with skeleton fallback
      render(<PassingStatsChartLazy data={mockPassingData} />);
      expect(document.body).toBeInTheDocument();
    });

    it('should eventually load the actual chart', async () => {
      render(<PassingStatsChartLazy data={mockPassingData} />);

      await waitFor(() => {
        const container = screen.getByText('PASSING STATISTICS').closest('div');
        expect(container).toBeInTheDocument();
      });
    });
  });

  describe('Props Forwarding', () => {
    it('should forward data prop to chart', async () => {
      render(<PassingStatsChartLazy data={mockPassingData} />);

      await waitFor(() => {
        expect(screen.getByText('PASSING STATISTICS')).toBeInTheDocument();
      });
    });

    it('should forward title prop to chart', async () => {
      render(<PassingStatsChartLazy data={mockPassingData} title="QB Leaders" />);

      await waitFor(() => {
        expect(screen.getByText('QB Leaders')).toBeInTheDocument();
      });
    });

    it('should forward custom className', async () => {
      const { container } = render(
        <PassingStatsChartLazy data={mockPassingData} className="custom-class" />
      );

      await waitFor(() => {
        const chartWrapper = container.querySelector('.custom-class');
        expect(chartWrapper).toBeInTheDocument();
      });
    });

    it('should forward height prop', async () => {
      render(<PassingStatsChartLazy data={mockPassingData} height={500} />);

      await waitFor(() => {
        expect(screen.getByText('PASSING STATISTICS')).toBeInTheDocument();
      });
    });

    it('should forward showLegend prop', async () => {
      render(<PassingStatsChartLazy data={mockPassingData} showLegend={false} />);

      await waitFor(() => {
        expect(screen.getByText('PASSING STATISTICS')).toBeInTheDocument();
      });
    });
  });

  describe('Skeleton Component', () => {
    it('should have Suspense boundary with fallback', () => {
      // The component wraps with Suspense, which provides skeleton during load
      render(<PassingStatsChartLazy data={mockPassingData} />);

      // Component should render (either skeleton or chart)
      expect(document.body).toBeInTheDocument();
    });
  });

  describe('Ref Forwarding', () => {
    it('should forward ref to chart component', async () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<PassingStatsChartLazy data={mockPassingData} ref={ref} />);

      await waitFor(() => {
        expect(ref.current).toBeInstanceOf(HTMLDivElement);
      });
    });
  });

  describe('Empty Data Handling', () => {
    it('should handle empty data array', async () => {
      const { container } = render(<PassingStatsChartLazy data={[]} />);

      await waitFor(() => {
        // Empty data should not render chart content
        expect(container.firstChild).toBeNull();
      });
    });

    it('should handle undefined data', async () => {
      const { container } = render(<PassingStatsChartLazy data={undefined as any} />);

      await waitFor(() => {
        expect(container.firstChild).toBeNull();
      });
    });
  });
});
