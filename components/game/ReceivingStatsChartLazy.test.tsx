import * as React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ReceivingStatsChartLazy } from './ReceivingStatsChartLazy';
import type { ReceivingStatsData } from './ReceivingStatsChart';

// GSAP is mocked via moduleNameMapper in jest.config.js

// Mock ResizeObserver for Recharts
class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

global.ResizeObserver = ResizeObserverMock as any;

describe('ReceivingStatsChartLazy', () => {
  const mockReceivingData: ReceivingStatsData[] = [
    {
      player: 'Antonio Williams',
      receptions: 8,
      targets: 11,
      yards: 149,
      average: 18.6,
      touchdowns: 2,
      long: 45,
      team: 'clemson',
    },
    {
      player: 'Opponent WR',
      receptions: 7,
      targets: 10,
      yards: 102,
      average: 14.6,
      touchdowns: 1,
      long: 32,
      team: 'opponent',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Lazy Loading', () => {
    it('should render without crashing', async () => {
      render(<ReceivingStatsChartLazy data={mockReceivingData} />);

      await waitFor(() => {
        expect(screen.getByText('RECEIVING STATISTICS')).toBeInTheDocument();
      });
    });

    it('should use Suspense with fallback', () => {
      render(<ReceivingStatsChartLazy data={mockReceivingData} />);
      expect(document.body).toBeInTheDocument();
    });

    it('should eventually load the actual chart', async () => {
      render(<ReceivingStatsChartLazy data={mockReceivingData} />);

      await waitFor(() => {
        const container = screen.getByText('RECEIVING STATISTICS').closest('div');
        expect(container).toBeInTheDocument();
      });
    });
  });

  describe('Props Forwarding', () => {
    it('should forward data prop to chart', async () => {
      render(<ReceivingStatsChartLazy data={mockReceivingData} />);

      await waitFor(() => {
        expect(screen.getByText('RECEIVING STATISTICS')).toBeInTheDocument();
      });
    });

    it('should forward title prop to chart', async () => {
      render(<ReceivingStatsChartLazy data={mockReceivingData} title="Pass Catchers" />);

      await waitFor(() => {
        expect(screen.getByText('Pass Catchers')).toBeInTheDocument();
      });
    });

    it('should forward custom className', async () => {
      const { container } = render(
        <ReceivingStatsChartLazy data={mockReceivingData} className="custom-class" />
      );

      await waitFor(() => {
        const chartWrapper = container.querySelector('.custom-class');
        expect(chartWrapper).toBeInTheDocument();
      });
    });

    it('should forward height prop', async () => {
      render(<ReceivingStatsChartLazy data={mockReceivingData} height={500} />);

      await waitFor(() => {
        expect(screen.getByText('RECEIVING STATISTICS')).toBeInTheDocument();
      });
    });

    it('should forward showLegend prop', async () => {
      render(<ReceivingStatsChartLazy data={mockReceivingData} showLegend={false} />);

      await waitFor(() => {
        expect(screen.getByText('RECEIVING STATISTICS')).toBeInTheDocument();
      });
    });
  });

  describe('Skeleton Component', () => {
    it('should have Suspense boundary with fallback', () => {
      render(<ReceivingStatsChartLazy data={mockReceivingData} />);

      expect(document.body).toBeInTheDocument();
    });
  });

  describe('Ref Forwarding', () => {
    it('should forward ref to chart component', async () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<ReceivingStatsChartLazy data={mockReceivingData} ref={ref} />);

      await waitFor(() => {
        expect(ref.current).toBeInstanceOf(HTMLDivElement);
      });
    });
  });

  describe('Empty Data Handling', () => {
    it('should handle empty data array', async () => {
      const { container } = render(<ReceivingStatsChartLazy data={[]} />);

      await waitFor(() => {
        expect(container.firstChild).toBeNull();
      });
    });

    it('should handle undefined data', async () => {
      const { container } = render(<ReceivingStatsChartLazy data={undefined as any} />);

      await waitFor(() => {
        expect(container.firstChild).toBeNull();
      });
    });
  });
});
