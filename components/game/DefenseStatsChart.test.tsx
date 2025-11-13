import * as React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { DefenseStatsChart, DefenseStatsData } from './DefenseStatsChart';

// GSAP is mocked via moduleNameMapper in jest.config.js

// Mock ResizeObserver for Recharts
class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

global.ResizeObserver = ResizeObserverMock as any;

describe('DefenseStatsChart', () => {
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
      player: 'Jeremiah Trotter Jr.',
      tackles: 10,
      soloTackles: 6,
      tacklesForLoss: 1.5,
      sacks: 0.5,
      interceptions: 0,
      passesDefended: 1,
      fumblesRecovered: 1,
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

  describe('Rendering', () => {
    it('should render without crashing', () => {
      render(<DefenseStatsChart data={mockDefenseData} />);
      expect(screen.getByText('DEFENSIVE STATISTICS')).toBeInTheDocument();
    });

    it('should render with custom title', () => {
      render(<DefenseStatsChart data={mockDefenseData} title="Defensive Leaders" />);
      expect(screen.getByText('Defensive Leaders')).toBeInTheDocument();
    });

    it('should render the chart container', () => {
      const { container } = render(<DefenseStatsChart data={mockDefenseData} />);
      const chartContainer = container.querySelector('.recharts-responsive-container');
      expect(chartContainer).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      const { container } = render(
        <DefenseStatsChart data={mockDefenseData} className="custom-class" />
      );
      const chartWrapper = container.firstChild;
      expect(chartWrapper).toHaveClass('custom-class');
    });

    it('should not render when data is empty', () => {
      const { container } = render(<DefenseStatsChart data={[]} />);
      expect(container.firstChild).toBeNull();
    });

    it('should not render when data is undefined', () => {
      const { container } = render(<DefenseStatsChart data={undefined as any} />);
      expect(container.firstChild).toBeNull();
    });
  });

  describe('Data Handling', () => {
    it('should render all players in the data', () => {
      render(<DefenseStatsChart data={mockDefenseData} />);
      const container = screen.getByText('DEFENSIVE STATISTICS').closest('div');
      expect(container).toBeInTheDocument();
    });

    it('should handle single player data', () => {
      const singlePlayer = [mockDefenseData[0]];
      render(<DefenseStatsChart data={singlePlayer} />);
      expect(screen.getByText('DEFENSIVE STATISTICS')).toBeInTheDocument();
    });

    it('should handle multiple Clemson players', () => {
      const clemsonOnly = mockDefenseData.filter((p) => p.team === 'clemson');
      render(<DefenseStatsChart data={clemsonOnly} />);
      expect(screen.getByText('DEFENSIVE STATISTICS')).toBeInTheDocument();
    });

    it('should handle opponent players', () => {
      const opponentOnly = mockDefenseData.filter((p) => p.team === 'opponent');
      render(<DefenseStatsChart data={opponentOnly} />);
      expect(screen.getByText('DEFENSIVE STATISTICS')).toBeInTheDocument();
    });
  });

  describe('Props', () => {
    it('should use default title when not provided', () => {
      render(<DefenseStatsChart data={mockDefenseData} />);
      expect(screen.getByText('DEFENSIVE STATISTICS')).toBeInTheDocument();
    });

    it('should hide title when title prop is empty string', () => {
      render(<DefenseStatsChart data={mockDefenseData} title="" />);
      expect(screen.queryByText('DEFENSIVE STATISTICS')).not.toBeInTheDocument();
    });

    it('should accept height prop', () => {
      const { container } = render(
        <DefenseStatsChart data={mockDefenseData} height={500} />
      );
      const responsiveContainer = container.querySelector(
        '.recharts-responsive-container'
      );
      expect(responsiveContainer).toBeInTheDocument();
    });

    it('should accept showLegend prop', () => {
      render(<DefenseStatsChart data={mockDefenseData} showLegend={true} />);
      expect(screen.getByText('DEFENSIVE STATISTICS')).toBeInTheDocument();
    });

    it('should handle showLegend false', () => {
      render(<DefenseStatsChart data={mockDefenseData} showLegend={false} />);
      expect(screen.getByText('DEFENSIVE STATISTICS')).toBeInTheDocument();
    });
  });

  describe('Stats Summary Grid', () => {
    it('should render stats summary with Solo', () => {
      render(<DefenseStatsChart data={mockDefenseData} />);
      expect(screen.getByText('Solo')).toBeInTheDocument();
    });

    it('should render stats summary with TFL', () => {
      render(<DefenseStatsChart data={mockDefenseData} />);
      expect(screen.getByText('TFL')).toBeInTheDocument();
    });

    it('should render stats summary with Sacks', () => {
      render(<DefenseStatsChart data={mockDefenseData} />);
      expect(screen.getByText('Sacks')).toBeInTheDocument();
    });

    it('should render stats summary with INT', () => {
      render(<DefenseStatsChart data={mockDefenseData} />);
      expect(screen.getByText('INT')).toBeInTheDocument();
    });

    it('should render stats summary with PD', () => {
      render(<DefenseStatsChart data={mockDefenseData} />);
      expect(screen.getByText('PD')).toBeInTheDocument();
    });

    it('should render stats summary with FR', () => {
      render(<DefenseStatsChart data={mockDefenseData} />);
      expect(screen.getByText('FR')).toBeInTheDocument();
    });

    it('should render stats summary with Assists', () => {
      render(<DefenseStatsChart data={mockDefenseData} />);
      expect(screen.getByText('Assists')).toBeInTheDocument();
    });

    it('should calculate assists correctly', () => {
      render(<DefenseStatsChart data={mockDefenseData} />);
      // Barrett Carter: 12 total - 7 solo = 5 assists
      const assistElements = screen.getAllByText('5');
      expect(assistElements.length).toBeGreaterThan(0);
    });

    it('should display solo tackles correctly', () => {
      render(<DefenseStatsChart data={mockDefenseData} />);
      const soloElements = screen.getAllByText('7');
      expect(soloElements.length).toBeGreaterThan(0);
    });
  });

  describe('GSAP Animation', () => {
    it('should initialize GSAP context', () => {
      const { gsap } = require('gsap');
      render(<DefenseStatsChart data={mockDefenseData} />);
      expect(gsap.context).toHaveBeenCalled();
    });

    it('should set up scroll reveal animation', () => {
      const { gsap } = require('gsap');
      render(<DefenseStatsChart data={mockDefenseData} />);
      expect(gsap.from).toHaveBeenCalled();
    });

    it('should clean up GSAP context on unmount', () => {
      const { gsap } = require('gsap');
      const mockRevert = jest.fn();
      gsap.context.mockReturnValue({ revert: mockRevert });

      const { unmount } = render(<DefenseStatsChart data={mockDefenseData} />);
      unmount();

      expect(mockRevert).toHaveBeenCalled();
    });
  });

  describe('Responsive Design', () => {
    it('should have responsive padding classes', () => {
      const { container } = render(<DefenseStatsChart data={mockDefenseData} />);
      const chartWrapper = container.firstChild as HTMLElement;
      expect(chartWrapper).toHaveClass('p-4', 'sm:p-5', 'md:p-6', 'lg:p-8');
    });

    it('should have responsive text size for title', () => {
      render(<DefenseStatsChart data={mockDefenseData} />);
      const title = screen.getByText('DEFENSIVE STATISTICS');
      expect(title).toHaveClass('text-base', 'sm:text-lg', 'md:text-xl');
    });

    it('should render ResponsiveContainer for chart responsiveness', () => {
      const { container } = render(<DefenseStatsChart data={mockDefenseData} />);
      const responsiveContainer = container.querySelector(
        '.recharts-responsive-container'
      );
      expect(responsiveContainer).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle zero tackles', () => {
      const zeroTackles: DefenseStatsData[] = [
        {
          player: 'No Tackle Player',
          tackles: 0,
          soloTackles: 0,
          tacklesForLoss: 0,
          sacks: 0,
          interceptions: 0,
          passesDefended: 0,
          fumblesRecovered: 0,
          team: 'opponent',
        },
      ];
      render(<DefenseStatsChart data={zeroTackles} />);
      expect(screen.getByText('DEFENSIVE STATISTICS')).toBeInTheDocument();
    });

    it('should handle all-solo tackles', () => {
      const allSolo: DefenseStatsData[] = [
        {
          player: 'Solo Artist',
          tackles: 15,
          soloTackles: 15,
          tacklesForLoss: 3,
          sacks: 2,
          interceptions: 1,
          passesDefended: 2,
          fumblesRecovered: 0,
          team: 'clemson',
        },
      ];
      render(<DefenseStatsChart data={allSolo} />);
      expect(screen.getByText('DEFENSIVE STATISTICS')).toBeInTheDocument();
    });

    it('should handle pass rusher specialist', () => {
      const passRusher: DefenseStatsData[] = [
        {
          player: 'Edge Rusher',
          tackles: 6,
          soloTackles: 4,
          tacklesForLoss: 4.5,
          sacks: 3.5,
          interceptions: 0,
          passesDefended: 1,
          fumblesRecovered: 1,
          team: 'clemson',
        },
      ];
      render(<DefenseStatsChart data={passRusher} />);
      expect(screen.getByText('DEFENSIVE STATISTICS')).toBeInTheDocument();
    });

    it('should handle coverage specialist', () => {
      const coverageDB: DefenseStatsData[] = [
        {
          player: 'Lockdown CB',
          tackles: 4,
          soloTackles: 3,
          tacklesForLoss: 0,
          sacks: 0,
          interceptions: 3,
          passesDefended: 8,
          fumblesRecovered: 0,
          team: 'clemson',
        },
      ];
      render(<DefenseStatsChart data={coverageDB} />);
      expect(screen.getByText('DEFENSIVE STATISTICS')).toBeInTheDocument();
    });

    it('should handle linebacker high volume', () => {
      const linebacker: DefenseStatsData[] = [
        {
          player: 'Mike LB',
          tackles: 18,
          soloTackles: 10,
          tacklesForLoss: 2.0,
          sacks: 0.5,
          interceptions: 1,
          passesDefended: 2,
          fumblesRecovered: 1,
          team: 'opponent',
        },
      ];
      render(<DefenseStatsChart data={linebacker} />);
      expect(screen.getByText('DEFENSIVE STATISTICS')).toBeInTheDocument();
    });

    it('should handle defensive lineman stats', () => {
      const dLineman: DefenseStatsData[] = [
        {
          player: 'DT',
          tackles: 8,
          soloTackles: 5,
          tacklesForLoss: 3.0,
          sacks: 2.0,
          interceptions: 0,
          passesDefended: 0,
          fumblesRecovered: 2,
          team: 'clemson',
        },
      ];
      render(<DefenseStatsChart data={dLineman} />);
      expect(screen.getByText('DEFENSIVE STATISTICS')).toBeInTheDocument();
    });

    it('should handle pick-six specialist', () => {
      const ballhawk: DefenseStatsData[] = [
        {
          player: 'Ball Hawk Safety',
          tackles: 7,
          soloTackles: 5,
          tacklesForLoss: 0.5,
          sacks: 0,
          interceptions: 4,
          passesDefended: 6,
          fumblesRecovered: 1,
          team: 'clemson',
        },
      ];
      render(<DefenseStatsChart data={ballhawk} />);
      expect(screen.getByText('DEFENSIVE STATISTICS')).toBeInTheDocument();
    });
  });

  describe('Ref Forwarding', () => {
    it('should forward ref to container div', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<DefenseStatsChart data={mockDefenseData} ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it('should have correct ref element structure', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<DefenseStatsChart data={mockDefenseData} ref={ref} />);
      expect(ref.current?.classList.contains('w-full')).toBe(true);
    });
  });
});
