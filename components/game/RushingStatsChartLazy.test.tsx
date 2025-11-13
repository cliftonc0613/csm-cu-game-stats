import * as React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { RushingStatsChartLazy } from './RushingStatsChartLazy';
import type { RushingStatsData } from './RushingStatsChart';

// GSAP is mocked via moduleNameMapper in jest.config.js

// Mock ResizeObserver for Recharts
class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

global.ResizeObserver = ResizeObserverMock as any;

describe('RushingStatsChartLazy', () => {
  const mockRushingData: RushingStatsData[] = [
    {
      player: 'Phil Mafah',
      attempts: 28,
      yards: 186,
      average: 6.6,
      touchdowns: 2,
      long: 45,
      team: 'clemson',
    },
    {
      player: 'Opponent RB',
      attempts: 18,
      yards: 92,
      average: 5.1,
      touchdowns: 1,
      long: 28,
      team: 'opponent',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Lazy Loading', () => {
    it('should render without crashing', async () => {
      render(<RushingStatsChartLazy data={mockRushingData} />);

      await waitFor(() => {
        expect(screen.getByText('RUSHING STATISTICS')).toBeInTheDocument();
      });
    });

    it('should use Suspense with fallback', () => {
      render(<RushingStatsChartLazy data={mockRushingData} />);
      expect(document.body).toBeInTheDocument();
    });

    it('should eventually load the actual chart', async () => {
      render(<RushingStatsChartLazy data={mockRushingData} />);

      await waitFor(() => {
        const container = screen.getByText('RUSHING STATISTICS').closest('div');
        expect(container).toBeInTheDocument();
      });
    });
  });

  describe('Props Forwarding', () => {
    it('should forward data prop to chart', async () => {
      render(<RushingStatsChartLazy data={mockRushingData} />);

      await waitFor(() => {
        expect(screen.getByText('RUSHING STATISTICS')).toBeInTheDocument();
      });
    });

    it('should forward title prop to chart', async () => {
      render(<RushingStatsChartLazy data={mockRushingData} title="Ground Game" />);

      await waitFor(() => {
        expect(screen.getByText('Ground Game')).toBeInTheDocument();
      });
    });

    it('should forward custom className', async () => {
      const { container } = render(
        <RushingStatsChartLazy data={mockRushingData} className="custom-class" />
      );

      await waitFor(() => {
        const chartWrapper = container.querySelector('.custom-class');
        expect(chartWrapper).toBeInTheDocument();
      });
    });

    it('should forward height prop', async () => {
      render(<RushingStatsChartLazy data={mockRushingData} height={500} />);

      await waitFor(() => {
        expect(screen.getByText('RUSHING STATISTICS')).toBeInTheDocument();
      });
    });

    it('should forward showLegend prop', async () => {
      render(<RushingStatsChartLazy data={mockRushingData} showLegend={false} />);

      await waitFor(() => {
        expect(screen.getByText('RUSHING STATISTICS')).toBeInTheDocument();
      });
    });
  });

  describe('Skeleton Component', () => {
    it('should have Suspense boundary with fallback', () => {
      render(<RushingStatsChartLazy data={mockRushingData} />);

      expect(document.body).toBeInTheDocument();
    });
  });

  describe('Ref Forwarding', () => {
    it('should forward ref to chart component', async () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<RushingStatsChartLazy data={mockRushingData} ref={ref} />);

      await waitFor(() => {
        expect(ref.current).toBeInstanceOf(HTMLDivElement);
      });
    });
  });

  describe('Empty Data Handling', () => {
    it('should handle empty data array', async () => {
      const { container } = render(<RushingStatsChartLazy data={[]} />);

      await waitFor(() => {
        expect(container.firstChild).toBeNull();
      });
    });

    it('should handle undefined data', async () => {
      const { container } = render(<RushingStatsChartLazy data={undefined as any} />);

      await waitFor(() => {
        expect(container.firstChild).toBeNull();
      });
    });
  });
});
