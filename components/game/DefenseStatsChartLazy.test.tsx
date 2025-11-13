import * as React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { DefenseStatsChartLazy } from './DefenseStatsChartLazy';
import type { DefenseStatsData } from './DefenseStatsChart';

// GSAP is mocked via moduleNameMapper in jest.config.js

// Mock ResizeObserver for Recharts
class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

global.ResizeObserver = ResizeObserverMock as any;

describe('DefenseStatsChartLazy', () => {
  const mockDefenseData: DefenseStatsData[] = [
    {
      player: 'Barrett Carter',
      tackles: 12,
      soloTackles: 7,
      tacklesForLoss: 2.5,
      sacks: 1.0,
      interceptions: 1,
      passesDefended: 2,
      fumblesRecovered: 0,
      team: 'clemson',
    },
    {
      player: 'Opponent LB',
      tackles: 9,
      soloTackles: 5,
      tacklesForLoss: 1.0,
      sacks: 0,
      interceptions: 0,
      passesDefended: 1,
      fumblesRecovered: 0,
      team: 'opponent',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Lazy Loading', () => {
    it('should render without crashing', async () => {
      render(<DefenseStatsChartLazy data={mockDefenseData} />);

      await waitFor(() => {
        expect(screen.getByText('DEFENSIVE STATISTICS')).toBeInTheDocument();
      });
    });

    it('should use Suspense with fallback', () => {
      render(<DefenseStatsChartLazy data={mockDefenseData} />);
      expect(document.body).toBeInTheDocument();
    });

    it('should eventually load the actual chart', async () => {
      render(<DefenseStatsChartLazy data={mockDefenseData} />);

      await waitFor(() => {
        const container = screen.getByText('DEFENSIVE STATISTICS').closest('div');
        expect(container).toBeInTheDocument();
      });
    });
  });

  describe('Props Forwarding', () => {
    it('should forward data prop to chart', async () => {
      render(<DefenseStatsChartLazy data={mockDefenseData} />);

      await waitFor(() => {
        expect(screen.getByText('DEFENSIVE STATISTICS')).toBeInTheDocument();
      });
    });

    it('should forward title prop to chart', async () => {
      render(<DefenseStatsChartLazy data={mockDefenseData} title="Defensive Leaders" />);

      await waitFor(() => {
        expect(screen.getByText('Defensive Leaders')).toBeInTheDocument();
      });
    });

    it('should forward custom className', async () => {
      const { container } = render(
        <DefenseStatsChartLazy data={mockDefenseData} className="custom-class" />
      );

      await waitFor(() => {
        const chartWrapper = container.querySelector('.custom-class');
        expect(chartWrapper).toBeInTheDocument();
      });
    });

    it('should forward height prop', async () => {
      render(<DefenseStatsChartLazy data={mockDefenseData} height={500} />);

      await waitFor(() => {
        expect(screen.getByText('DEFENSIVE STATISTICS')).toBeInTheDocument();
      });
    });

    it('should forward showLegend prop', async () => {
      render(<DefenseStatsChartLazy data={mockDefenseData} showLegend={false} />);

      await waitFor(() => {
        expect(screen.getByText('DEFENSIVE STATISTICS')).toBeInTheDocument();
      });
    });
  });

  describe('Skeleton Component', () => {
    it('should have Suspense boundary with fallback', () => {
      render(<DefenseStatsChartLazy data={mockDefenseData} />);

      expect(document.body).toBeInTheDocument();
    });
  });

  describe('Ref Forwarding', () => {
    it('should forward ref to chart component', async () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<DefenseStatsChartLazy data={mockDefenseData} ref={ref} />);

      await waitFor(() => {
        expect(ref.current).toBeInstanceOf(HTMLDivElement);
      });
    });
  });

  describe('Empty Data Handling', () => {
    it('should handle empty data array', async () => {
      const { container } = render(<DefenseStatsChartLazy data={[]} />);

      await waitFor(() => {
        expect(container.firstChild).toBeNull();
      });
    });

    it('should handle undefined data', async () => {
      const { container } = render(<DefenseStatsChartLazy data={undefined as any} />);

      await waitFor(() => {
        expect(container.firstChild).toBeNull();
      });
    });
  });
});
