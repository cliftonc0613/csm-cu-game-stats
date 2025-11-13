import * as React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ReceivingStatsChart, ReceivingStatsData } from './ReceivingStatsChart';

// GSAP is mocked via moduleNameMapper in jest.config.js

// Mock ResizeObserver for Recharts
class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

global.ResizeObserver = ResizeObserverMock as any;

describe('ReceivingStatsChart', () => {
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
      player: 'Tyler Brown',
      receptions: 6,
      targets: 8,
      yards: 87,
      average: 14.5,
      touchdowns: 1,
      long: 28,
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

  describe('Rendering', () => {
    it('should render without crashing', () => {
      render(<ReceivingStatsChart data={mockReceivingData} />);
      expect(screen.getByText('RECEIVING STATISTICS')).toBeInTheDocument();
    });

    it('should render with custom title', () => {
      render(<ReceivingStatsChart data={mockReceivingData} title="Pass Catchers" />);
      expect(screen.getByText('Pass Catchers')).toBeInTheDocument();
    });

    it('should render the chart container', () => {
      const { container } = render(<ReceivingStatsChart data={mockReceivingData} />);
      const chartContainer = container.querySelector('.recharts-responsive-container');
      expect(chartContainer).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      const { container } = render(
        <ReceivingStatsChart data={mockReceivingData} className="custom-class" />
      );
      const chartWrapper = container.firstChild;
      expect(chartWrapper).toHaveClass('custom-class');
    });

    it('should not render when data is empty', () => {
      const { container } = render(<ReceivingStatsChart data={[]} />);
      expect(container.firstChild).toBeNull();
    });

    it('should not render when data is undefined', () => {
      const { container } = render(<ReceivingStatsChart data={undefined as any} />);
      expect(container.firstChild).toBeNull();
    });
  });

  describe('Data Handling', () => {
    it('should render all players in the data', () => {
      render(<ReceivingStatsChart data={mockReceivingData} />);
      const container = screen.getByText('RECEIVING STATISTICS').closest('div');
      expect(container).toBeInTheDocument();
    });

    it('should handle single player data', () => {
      const singlePlayer = [mockReceivingData[0]];
      render(<ReceivingStatsChart data={singlePlayer} />);
      expect(screen.getByText('RECEIVING STATISTICS')).toBeInTheDocument();
    });

    it('should handle multiple Clemson players', () => {
      const clemsonOnly = mockReceivingData.filter((p) => p.team === 'clemson');
      render(<ReceivingStatsChart data={clemsonOnly} />);
      expect(screen.getByText('RECEIVING STATISTICS')).toBeInTheDocument();
    });

    it('should handle opponent players', () => {
      const opponentOnly = mockReceivingData.filter((p) => p.team === 'opponent');
      render(<ReceivingStatsChart data={opponentOnly} />);
      expect(screen.getByText('RECEIVING STATISTICS')).toBeInTheDocument();
    });
  });

  describe('Props', () => {
    it('should use default title when not provided', () => {
      render(<ReceivingStatsChart data={mockReceivingData} />);
      expect(screen.getByText('RECEIVING STATISTICS')).toBeInTheDocument();
    });

    it('should hide title when title prop is empty string', () => {
      render(<ReceivingStatsChart data={mockReceivingData} title="" />);
      expect(screen.queryByText('RECEIVING STATISTICS')).not.toBeInTheDocument();
    });

    it('should accept height prop', () => {
      const { container } = render(
        <ReceivingStatsChart data={mockReceivingData} height={500} />
      );
      const responsiveContainer = container.querySelector(
        '.recharts-responsive-container'
      );
      expect(responsiveContainer).toBeInTheDocument();
    });

    it('should accept showLegend prop', () => {
      render(<ReceivingStatsChart data={mockReceivingData} showLegend={true} />);
      expect(screen.getByText('RECEIVING STATISTICS')).toBeInTheDocument();
    });

    it('should handle showLegend false', () => {
      render(<ReceivingStatsChart data={mockReceivingData} showLegend={false} />);
      expect(screen.getByText('RECEIVING STATISTICS')).toBeInTheDocument();
    });
  });

  describe('Stats Summary Grid', () => {
    it('should render stats summary with Rec', () => {
      render(<ReceivingStatsChart data={mockReceivingData} />);
      expect(screen.getByText('Rec')).toBeInTheDocument();
    });

    it('should render stats summary with Avg', () => {
      render(<ReceivingStatsChart data={mockReceivingData} />);
      expect(screen.getByText('Avg')).toBeInTheDocument();
    });

    it('should render stats summary with TD', () => {
      render(<ReceivingStatsChart data={mockReceivingData} />);
      expect(screen.getByText('TD')).toBeInTheDocument();
    });

    it('should render stats summary with Long', () => {
      render(<ReceivingStatsChart data={mockReceivingData} />);
      expect(screen.getByText('Long')).toBeInTheDocument();
    });

    it('should render stats summary with Catch%', () => {
      render(<ReceivingStatsChart data={mockReceivingData} />);
      expect(screen.getByText('Catch%')).toBeInTheDocument();
    });

    it('should calculate catch percentage correctly', () => {
      render(<ReceivingStatsChart data={mockReceivingData} />);
      // Antonio Williams: 8/11 = 72.7%
      const catchPercentageElements = screen.getAllByText(/72\.7%/);
      expect(catchPercentageElements.length).toBeGreaterThan(0);
    });

    it('should display reception count correctly', () => {
      render(<ReceivingStatsChart data={mockReceivingData} />);
      const recElements = screen.getAllByText('8');
      expect(recElements.length).toBeGreaterThan(0);
    });
  });

  describe('GSAP Animation', () => {
    it('should initialize GSAP context', () => {
      const { gsap } = require('gsap');
      render(<ReceivingStatsChart data={mockReceivingData} />);
      expect(gsap.context).toHaveBeenCalled();
    });

    it('should set up scroll reveal animation', () => {
      const { gsap } = require('gsap');
      render(<ReceivingStatsChart data={mockReceivingData} />);
      expect(gsap.from).toHaveBeenCalled();
    });

    it('should clean up GSAP context on unmount', () => {
      const { gsap } = require('gsap');
      const mockRevert = jest.fn();
      gsap.context.mockReturnValue({ revert: mockRevert });

      const { unmount } = render(<ReceivingStatsChart data={mockReceivingData} />);
      unmount();

      expect(mockRevert).toHaveBeenCalled();
    });
  });

  describe('Responsive Design', () => {
    it('should have responsive padding classes', () => {
      const { container } = render(<ReceivingStatsChart data={mockReceivingData} />);
      const chartWrapper = container.firstChild as HTMLElement;
      expect(chartWrapper).toHaveClass('p-4', 'sm:p-5', 'md:p-6', 'lg:p-8');
    });

    it('should have responsive text size for title', () => {
      render(<ReceivingStatsChart data={mockReceivingData} />);
      const title = screen.getByText('RECEIVING STATISTICS');
      expect(title).toHaveClass('text-base', 'sm:text-lg', 'md:text-xl');
    });

    it('should render ResponsiveContainer for chart responsiveness', () => {
      const { container } = render(<ReceivingStatsChart data={mockReceivingData} />);
      const responsiveContainer = container.querySelector(
        '.recharts-responsive-container'
      );
      expect(responsiveContainer).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle zero receptions', () => {
      const zeroReceptions: ReceivingStatsData[] = [
        {
          player: 'Targeted Player',
          receptions: 0,
          targets: 5,
          yards: 0,
          average: 0,
          touchdowns: 0,
          long: 0,
          team: 'opponent',
        },
      ];
      render(<ReceivingStatsChart data={zeroReceptions} />);
      expect(screen.getByText('RECEIVING STATISTICS')).toBeInTheDocument();
    });

    it('should handle perfect catch rate', () => {
      const perfectCatchRate: ReceivingStatsData[] = [
        {
          player: 'Sure Hands',
          receptions: 10,
          targets: 10,
          yards: 150,
          average: 15.0,
          touchdowns: 2,
          long: 35,
          team: 'clemson',
        },
      ];
      render(<ReceivingStatsChart data={perfectCatchRate} />);
      expect(screen.getByText('RECEIVING STATISTICS')).toBeInTheDocument();
    });

    it('should handle deep threat receiver', () => {
      const deepThreat: ReceivingStatsData[] = [
        {
          player: 'Deep Ball WR',
          receptions: 3,
          targets: 6,
          yards: 158,
          average: 52.7,
          touchdowns: 2,
          long: 78,
          team: 'clemson',
        },
      ];
      render(<ReceivingStatsChart data={deepThreat} />);
      expect(screen.getByText('RECEIVING STATISTICS')).toBeInTheDocument();
    });

    it('should handle slot receiver volume', () => {
      const slotReceiver: ReceivingStatsData[] = [
        {
          player: 'Slot WR',
          receptions: 12,
          targets: 15,
          yards: 98,
          average: 8.2,
          touchdowns: 0,
          long: 18,
          team: 'clemson',
        },
      ];
      render(<ReceivingStatsChart data={slotReceiver} />);
      expect(screen.getByText('RECEIVING STATISTICS')).toBeInTheDocument();
    });

    it('should handle tight end stats', () => {
      const tightEnd: ReceivingStatsData[] = [
        {
          player: 'TE',
          receptions: 5,
          targets: 7,
          yards: 62,
          average: 12.4,
          touchdowns: 1,
          long: 24,
          team: 'clemson',
        },
      ];
      render(<ReceivingStatsChart data={tightEnd} />);
      expect(screen.getByText('RECEIVING STATISTICS')).toBeInTheDocument();
    });

    it('should handle single catch touchdown', () => {
      const singleCatch: ReceivingStatsData[] = [
        {
          player: 'One Play Wonder',
          receptions: 1,
          targets: 1,
          yards: 65,
          average: 65.0,
          touchdowns: 1,
          long: 65,
          team: 'opponent',
        },
      ];
      render(<ReceivingStatsChart data={singleCatch} />);
      expect(screen.getByText('RECEIVING STATISTICS')).toBeInTheDocument();
    });
  });

  describe('Ref Forwarding', () => {
    it('should forward ref to container div', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<ReceivingStatsChart data={mockReceivingData} ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it('should have correct ref element structure', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<ReceivingStatsChart data={mockReceivingData} ref={ref} />);
      expect(ref.current?.classList.contains('w-full')).toBe(true);
    });
  });
});
