import * as React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { PassingStatsChart, PassingStatsData } from './PassingStatsChart';

// GSAP is mocked via moduleNameMapper in jest.config.js

// Mock ResizeObserver for Recharts
class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

global.ResizeObserver = ResizeObserverMock as any;

describe('PassingStatsChart', () => {
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
      player: 'Christopher Vizzina',
      completions: 3,
      attempts: 5,
      yards: 42,
      touchdowns: 0,
      interceptions: 0,
      rating: 128.2,
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

  describe('Rendering', () => {
    it('should render without crashing', () => {
      render(<PassingStatsChart data={mockPassingData} />);
      expect(screen.getByText('PASSING STATISTICS')).toBeInTheDocument();
    });

    it('should render with custom title', () => {
      render(<PassingStatsChart data={mockPassingData} title="QB Performance" />);
      expect(screen.getByText('QB Performance')).toBeInTheDocument();
    });

    it('should render the chart container', () => {
      const { container } = render(<PassingStatsChart data={mockPassingData} />);
      const chartContainer = container.querySelector('.recharts-responsive-container');
      expect(chartContainer).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      const { container } = render(
        <PassingStatsChart data={mockPassingData} className="custom-class" />
      );
      const chartWrapper = container.firstChild;
      expect(chartWrapper).toHaveClass('custom-class');
    });

    it('should not render when data is empty', () => {
      const { container } = render(<PassingStatsChart data={[]} />);
      expect(container.firstChild).toBeNull();
    });

    it('should not render when data is undefined', () => {
      const { container } = render(<PassingStatsChart data={undefined as any} />);
      expect(container.firstChild).toBeNull();
    });
  });

  describe('Data Handling', () => {
    it('should render all players in the data', () => {
      render(<PassingStatsChart data={mockPassingData} />);
      const container = screen.getByText('PASSING STATISTICS').closest('div');
      expect(container).toBeInTheDocument();
    });

    it('should handle single player data', () => {
      const singlePlayer = [mockPassingData[0]];
      render(<PassingStatsChart data={singlePlayer} />);
      expect(screen.getByText('PASSING STATISTICS')).toBeInTheDocument();
    });

    it('should handle multiple Clemson players', () => {
      const clemsonOnly = mockPassingData.filter((p) => p.team === 'clemson');
      render(<PassingStatsChart data={clemsonOnly} />);
      expect(screen.getByText('PASSING STATISTICS')).toBeInTheDocument();
    });

    it('should handle opponent players', () => {
      const opponentOnly = mockPassingData.filter((p) => p.team === 'opponent');
      render(<PassingStatsChart data={opponentOnly} />);
      expect(screen.getByText('PASSING STATISTICS')).toBeInTheDocument();
    });
  });

  describe('Props', () => {
    it('should use default title when not provided', () => {
      render(<PassingStatsChart data={mockPassingData} />);
      expect(screen.getByText('PASSING STATISTICS')).toBeInTheDocument();
    });

    it('should hide title when title prop is empty string', () => {
      render(<PassingStatsChart data={mockPassingData} title="" />);
      expect(screen.queryByText('PASSING STATISTICS')).not.toBeInTheDocument();
    });

    it('should accept height prop', () => {
      const { container } = render(
        <PassingStatsChart data={mockPassingData} height={500} />
      );
      const responsiveContainer = container.querySelector(
        '.recharts-responsive-container'
      );
      expect(responsiveContainer).toBeInTheDocument();
    });

    it('should accept showLegend prop', () => {
      render(<PassingStatsChart data={mockPassingData} showLegend={true} />);
      expect(screen.getByText('PASSING STATISTICS')).toBeInTheDocument();
    });

    it('should handle showLegend false', () => {
      render(<PassingStatsChart data={mockPassingData} showLegend={false} />);
      expect(screen.getByText('PASSING STATISTICS')).toBeInTheDocument();
    });
  });

  describe('Stats Summary Grid', () => {
    it('should render stats summary with Comp%', () => {
      render(<PassingStatsChart data={mockPassingData} />);
      expect(screen.getByText('Comp%')).toBeInTheDocument();
    });

    it('should render stats summary with YPA', () => {
      render(<PassingStatsChart data={mockPassingData} />);
      expect(screen.getByText('YPA')).toBeInTheDocument();
    });

    it('should render stats summary with TD', () => {
      render(<PassingStatsChart data={mockPassingData} />);
      expect(screen.getByText('TD')).toBeInTheDocument();
    });

    it('should render stats summary with INT', () => {
      render(<PassingStatsChart data={mockPassingData} />);
      expect(screen.getByText('INT')).toBeInTheDocument();
    });

    it('should render stats summary with Rating', () => {
      render(<PassingStatsChart data={mockPassingData} />);
      expect(screen.getByText('Rating')).toBeInTheDocument();
    });

    it('should calculate completion percentage correctly', () => {
      render(<PassingStatsChart data={mockPassingData} />);
      // Klubnik: 24/35 = 68.6%
      const compPercentageElements = screen.getAllByText(/68\.6%/);
      expect(compPercentageElements.length).toBeGreaterThan(0);
    });

    it('should calculate yards per attempt correctly', () => {
      render(<PassingStatsChart data={mockPassingData} />);
      // Klubnik: 378/35 = 10.8
      const ypaElements = screen.getAllByText(/10\.8/);
      expect(ypaElements.length).toBeGreaterThan(0);
    });
  });

  describe('GSAP Animation', () => {
    it('should initialize GSAP context', () => {
      const { gsap } = require('gsap');
      render(<PassingStatsChart data={mockPassingData} />);
      expect(gsap.context).toHaveBeenCalled();
    });

    it('should set up scroll reveal animation', () => {
      const { gsap } = require('gsap');
      render(<PassingStatsChart data={mockPassingData} />);
      expect(gsap.from).toHaveBeenCalled();
    });

    it('should clean up GSAP context on unmount', () => {
      const { gsap } = require('gsap');
      const mockRevert = jest.fn();
      gsap.context.mockReturnValue({ revert: mockRevert });

      const { unmount } = render(<PassingStatsChart data={mockPassingData} />);
      unmount();

      expect(mockRevert).toHaveBeenCalled();
    });
  });

  describe('Responsive Design', () => {
    it('should have responsive padding classes', () => {
      const { container } = render(<PassingStatsChart data={mockPassingData} />);
      const chartWrapper = container.firstChild as HTMLElement;
      expect(chartWrapper).toHaveClass('p-4', 'sm:p-5', 'md:p-6', 'lg:p-8');
    });

    it('should have responsive text size for title', () => {
      render(<PassingStatsChart data={mockPassingData} />);
      const title = screen.getByText('PASSING STATISTICS');
      expect(title).toHaveClass('text-base', 'sm:text-lg', 'md:text-xl');
    });

    it('should render ResponsiveContainer for chart responsiveness', () => {
      const { container } = render(<PassingStatsChart data={mockPassingData} />);
      const responsiveContainer = container.querySelector(
        '.recharts-responsive-container'
      );
      expect(responsiveContainer).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle zero completions', () => {
      const zeroCompletions: PassingStatsData[] = [
        {
          player: 'Zero QB',
          completions: 0,
          attempts: 5,
          yards: 0,
          touchdowns: 0,
          interceptions: 0,
          rating: 39.6,
          team: 'opponent',
        },
      ];
      render(<PassingStatsChart data={zeroCompletions} />);
      expect(screen.getByText('PASSING STATISTICS')).toBeInTheDocument();
    });

    it('should handle perfect passer rating scenario', () => {
      const perfectRating: PassingStatsData[] = [
        {
          player: 'Perfect QB',
          completions: 10,
          attempts: 10,
          yards: 400,
          touchdowns: 5,
          interceptions: 0,
          rating: 197.6,
          team: 'clemson',
        },
      ];
      render(<PassingStatsChart data={perfectRating} />);
      expect(screen.getByText('PASSING STATISTICS')).toBeInTheDocument();
    });

    it('should handle multiple interceptions', () => {
      const multipleInts: PassingStatsData[] = [
        {
          player: 'Struggling QB',
          completions: 15,
          attempts: 30,
          yards: 180,
          touchdowns: 1,
          interceptions: 4,
          rating: 65.2,
          team: 'opponent',
        },
      ];
      render(<PassingStatsChart data={multipleInts} />);
      expect(screen.getByText('PASSING STATISTICS')).toBeInTheDocument();
    });

    it('should handle high yardage game', () => {
      const highYardage: PassingStatsData[] = [
        {
          player: 'Elite QB',
          completions: 35,
          attempts: 45,
          yards: 525,
          touchdowns: 6,
          interceptions: 1,
          rating: 185.4,
          team: 'clemson',
        },
      ];
      render(<PassingStatsChart data={highYardage} />);
      expect(screen.getByText('PASSING STATISTICS')).toBeInTheDocument();
    });

    it('should handle backup QB minimal stats', () => {
      const backupQB: PassingStatsData[] = [
        {
          player: 'Backup QB',
          completions: 1,
          attempts: 1,
          yards: 5,
          touchdowns: 0,
          interceptions: 0,
          rating: 95.8,
          team: 'clemson',
        },
      ];
      render(<PassingStatsChart data={backupQB} />);
      expect(screen.getByText('PASSING STATISTICS')).toBeInTheDocument();
    });
  });

  describe('Ref Forwarding', () => {
    it('should forward ref to container div', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<PassingStatsChart data={mockPassingData} ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it('should have correct ref element structure', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<PassingStatsChart data={mockPassingData} ref={ref} />);
      expect(ref.current?.classList.contains('w-full')).toBe(true);
    });
  });
});
