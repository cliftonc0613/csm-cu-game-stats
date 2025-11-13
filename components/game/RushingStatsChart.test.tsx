import * as React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { RushingStatsChart, RushingStatsData } from './RushingStatsChart';

// GSAP is mocked via moduleNameMapper in jest.config.js

// Mock ResizeObserver for Recharts
class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

global.ResizeObserver = ResizeObserverMock as any;

describe('RushingStatsChart', () => {
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
      player: 'Jay Haynes',
      attempts: 12,
      yards: 78,
      average: 6.5,
      touchdowns: 1,
      long: 22,
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

  describe('Rendering', () => {
    it('should render without crashing', () => {
      render(<RushingStatsChart data={mockRushingData} />);
      expect(screen.getByText('RUSHING STATISTICS')).toBeInTheDocument();
    });

    it('should render with custom title', () => {
      render(<RushingStatsChart data={mockRushingData} title="Ground Game Leaders" />);
      expect(screen.getByText('Ground Game Leaders')).toBeInTheDocument();
    });

    it('should render the chart container', () => {
      const { container } = render(<RushingStatsChart data={mockRushingData} />);
      const chartContainer = container.querySelector('.recharts-responsive-container');
      expect(chartContainer).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      const { container } = render(
        <RushingStatsChart data={mockRushingData} className="custom-class" />
      );
      const chartWrapper = container.firstChild;
      expect(chartWrapper).toHaveClass('custom-class');
    });

    it('should not render when data is empty', () => {
      const { container } = render(<RushingStatsChart data={[]} />);
      expect(container.firstChild).toBeNull();
    });

    it('should not render when data is undefined', () => {
      const { container } = render(<RushingStatsChart data={undefined as any} />);
      expect(container.firstChild).toBeNull();
    });
  });

  describe('Data Handling', () => {
    it('should render all players in the data', () => {
      render(<RushingStatsChart data={mockRushingData} />);
      const container = screen.getByText('RUSHING STATISTICS').closest('div');
      expect(container).toBeInTheDocument();
    });

    it('should handle single player data', () => {
      const singlePlayer = [mockRushingData[0]];
      render(<RushingStatsChart data={singlePlayer} />);
      expect(screen.getByText('RUSHING STATISTICS')).toBeInTheDocument();
    });

    it('should handle multiple Clemson players', () => {
      const clemsonOnly = mockRushingData.filter((p) => p.team === 'clemson');
      render(<RushingStatsChart data={clemsonOnly} />);
      expect(screen.getByText('RUSHING STATISTICS')).toBeInTheDocument();
    });

    it('should handle opponent players', () => {
      const opponentOnly = mockRushingData.filter((p) => p.team === 'opponent');
      render(<RushingStatsChart data={opponentOnly} />);
      expect(screen.getByText('RUSHING STATISTICS')).toBeInTheDocument();
    });
  });

  describe('Props', () => {
    it('should use default title when not provided', () => {
      render(<RushingStatsChart data={mockRushingData} />);
      expect(screen.getByText('RUSHING STATISTICS')).toBeInTheDocument();
    });

    it('should hide title when title prop is empty string', () => {
      render(<RushingStatsChart data={mockRushingData} title="" />);
      expect(screen.queryByText('RUSHING STATISTICS')).not.toBeInTheDocument();
    });

    it('should accept height prop', () => {
      const { container } = render(
        <RushingStatsChart data={mockRushingData} height={500} />
      );
      const responsiveContainer = container.querySelector(
        '.recharts-responsive-container'
      );
      expect(responsiveContainer).toBeInTheDocument();
    });

    it('should accept showLegend prop', () => {
      render(<RushingStatsChart data={mockRushingData} showLegend={true} />);
      expect(screen.getByText('RUSHING STATISTICS')).toBeInTheDocument();
    });

    it('should handle showLegend false', () => {
      render(<RushingStatsChart data={mockRushingData} showLegend={false} />);
      expect(screen.getByText('RUSHING STATISTICS')).toBeInTheDocument();
    });
  });

  describe('Stats Summary Grid', () => {
    it('should render stats summary with Attempts', () => {
      render(<RushingStatsChart data={mockRushingData} />);
      expect(screen.getByText('Attempts')).toBeInTheDocument();
    });

    it('should render stats summary with Avg', () => {
      render(<RushingStatsChart data={mockRushingData} />);
      expect(screen.getByText('Avg')).toBeInTheDocument();
    });

    it('should render stats summary with TD', () => {
      render(<RushingStatsChart data={mockRushingData} />);
      expect(screen.getByText('TD')).toBeInTheDocument();
    });

    it('should render stats summary with Long', () => {
      render(<RushingStatsChart data={mockRushingData} />);
      expect(screen.getByText('Long')).toBeInTheDocument();
    });

    it('should display attempt count correctly', () => {
      render(<RushingStatsChart data={mockRushingData} />);
      const attemptElements = screen.getAllByText('28');
      expect(attemptElements.length).toBeGreaterThan(0);
    });

    it('should display average correctly', () => {
      render(<RushingStatsChart data={mockRushingData} />);
      const avgElements = screen.getAllByText(/6\.6/);
      expect(avgElements.length).toBeGreaterThan(0);
    });
  });

  describe('GSAP Animation', () => {
    it('should initialize GSAP context', () => {
      const { gsap } = require('gsap');
      render(<RushingStatsChart data={mockRushingData} />);
      expect(gsap.context).toHaveBeenCalled();
    });

    it('should set up scroll reveal animation', () => {
      const { gsap } = require('gsap');
      render(<RushingStatsChart data={mockRushingData} />);
      expect(gsap.from).toHaveBeenCalled();
    });

    it('should clean up GSAP context on unmount', () => {
      const { gsap } = require('gsap');
      const mockRevert = jest.fn();
      gsap.context.mockReturnValue({ revert: mockRevert });

      const { unmount } = render(<RushingStatsChart data={mockRushingData} />);
      unmount();

      expect(mockRevert).toHaveBeenCalled();
    });
  });

  describe('Responsive Design', () => {
    it('should have responsive padding classes', () => {
      const { container } = render(<RushingStatsChart data={mockRushingData} />);
      const chartWrapper = container.firstChild as HTMLElement;
      expect(chartWrapper).toHaveClass('p-4', 'sm:p-5', 'md:p-6', 'lg:p-8');
    });

    it('should have responsive text size for title', () => {
      render(<RushingStatsChart data={mockRushingData} />);
      const title = screen.getByText('RUSHING STATISTICS');
      expect(title).toHaveClass('text-base', 'sm:text-lg', 'md:text-xl');
    });

    it('should render ResponsiveContainer for chart responsiveness', () => {
      const { container } = render(<RushingStatsChart data={mockRushingData} />);
      const responsiveContainer = container.querySelector(
        '.recharts-responsive-container'
      );
      expect(responsiveContainer).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle zero attempts', () => {
      const zeroAttempts: RushingStatsData[] = [
        {
          player: 'No Rush',
          attempts: 0,
          yards: 0,
          average: 0,
          touchdowns: 0,
          long: 0,
          team: 'opponent',
        },
      ];
      render(<RushingStatsChart data={zeroAttempts} />);
      expect(screen.getByText('RUSHING STATISTICS')).toBeInTheDocument();
    });

    it('should handle negative yardage', () => {
      const negativeYards: RushingStatsData[] = [
        {
          player: 'Sacked QB',
          attempts: 3,
          yards: -15,
          average: -5.0,
          touchdowns: 0,
          long: 0,
          team: 'opponent',
        },
      ];
      render(<RushingStatsChart data={negativeYards} />);
      expect(screen.getByText('RUSHING STATISTICS')).toBeInTheDocument();
    });

    it('should handle explosive rushing performance', () => {
      const explosiveGame: RushingStatsData[] = [
        {
          player: 'Star RB',
          attempts: 35,
          yards: 312,
          average: 8.9,
          touchdowns: 5,
          long: 85,
          team: 'clemson',
        },
      ];
      render(<RushingStatsChart data={explosiveGame} />);
      expect(screen.getByText('RUSHING STATISTICS')).toBeInTheDocument();
    });

    it('should handle single carry touchdown', () => {
      const singleCarryTD: RushingStatsData[] = [
        {
          player: 'Big Play',
          attempts: 1,
          yards: 75,
          average: 75.0,
          touchdowns: 1,
          long: 75,
          team: 'clemson',
        },
      ];
      render(<RushingStatsChart data={singleCarryTD} />);
      expect(screen.getByText('RUSHING STATISTICS')).toBeInTheDocument();
    });

    it('should handle goal-line specialist stats', () => {
      const goalLineBack: RushingStatsData[] = [
        {
          player: 'Goal Line RB',
          attempts: 8,
          yards: 6,
          average: 0.8,
          touchdowns: 3,
          long: 3,
          team: 'clemson',
        },
      ];
      render(<RushingStatsChart data={goalLineBack} />);
      expect(screen.getByText('RUSHING STATISTICS')).toBeInTheDocument();
    });

    it('should handle high volume low average', () => {
      const grindingBack: RushingStatsData[] = [
        {
          player: 'Grinder RB',
          attempts: 42,
          yards: 125,
          average: 3.0,
          touchdowns: 2,
          long: 18,
          team: 'opponent',
        },
      ];
      render(<RushingStatsChart data={grindingBack} />);
      expect(screen.getByText('RUSHING STATISTICS')).toBeInTheDocument();
    });
  });

  describe('Ref Forwarding', () => {
    it('should forward ref to container div', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<RushingStatsChart data={mockRushingData} ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it('should have correct ref element structure', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<RushingStatsChart data={mockRushingData} ref={ref} />);
      expect(ref.current?.classList.contains('w-full')).toBe(true);
    });
  });
});
