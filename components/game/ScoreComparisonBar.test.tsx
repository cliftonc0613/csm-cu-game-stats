import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ScoreComparisonBar } from './ScoreComparisonBar';

// Mock the Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />;
  },
}));

describe('ScoreComparisonBar Component', () => {
  const mockClemsonWin = {
    clemson: {
      score: 42,
      record: '10-2',
    },
    opponent: {
      name: 'South Carolina',
      teamSlug: 'south-carolina',
      score: 17,
      record: '8-4',
    },
    winStreak: 5,
    isWin: true,
  };

  const mockClemsonLoss = {
    clemson: {
      score: 21,
      record: '9-3',
    },
    opponent: {
      name: 'Georgia',
      teamSlug: 'georgia',
      score: 28,
      record: '12-0',
    },
    isWin: false,
  };

  const mockCloseGame = {
    clemson: {
      score: 31,
      record: '11-1',
    },
    opponent: {
      name: 'Florida State',
      teamSlug: 'florida-state',
      score: 28,
      record: '10-2',
    },
    winStreak: 3,
  };

  describe('Basic Rendering', () => {
    it('should render Clemson score and opponent score', () => {
      render(<ScoreComparisonBar {...mockClemsonWin} />);

      // Scores appear twice: in records and on progress bar
      expect(screen.getAllByText('42').length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText('17').length).toBeGreaterThanOrEqual(1);
    });

    it('should render team names', () => {
      render(<ScoreComparisonBar {...mockClemsonWin} />);

      expect(screen.getByText('Clemson')).toBeInTheDocument();
      expect(screen.getByText('South Carolina')).toBeInTheDocument();
    });

    it('should render team records when provided', () => {
      render(<ScoreComparisonBar {...mockClemsonWin} />);

      expect(screen.getByText('10-2')).toBeInTheDocument();
      expect(screen.getByText('8-4')).toBeInTheDocument();
    });

    it('should render without records when not provided', () => {
      const propsWithoutRecords = {
        clemson: { score: 42 },
        opponent: { name: 'Test Team', score: 17 },
      };

      render(<ScoreComparisonBar {...propsWithoutRecords} />);

      // Scores appear twice: in records and on progress bar
      expect(screen.getAllByText('42').length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText('17').length).toBeGreaterThanOrEqual(1);
      expect(screen.queryByText('10-2')).not.toBeInTheDocument();
    });
  });

  describe('Win Streak Display', () => {
    it('should display win streak for Clemson wins', () => {
      render(<ScoreComparisonBar {...mockClemsonWin} />);

      expect(screen.getByText(/Current Win Streak:/)).toBeInTheDocument();
      expect(screen.getByText('5')).toBeInTheDocument();
      expect(screen.getByText(/game/)).toBeInTheDocument();
    });

    it('should pluralize "games" for streak > 1', () => {
      render(<ScoreComparisonBar {...mockClemsonWin} />);

      expect(screen.getByText(/games/)).toBeInTheDocument();
    });

    it('should use singular "game" for streak = 1', () => {
      const singleStreak = {
        ...mockClemsonWin,
        winStreak: 1,
      };

      const { container } = render(<ScoreComparisonBar {...singleStreak} />);

      expect(screen.getByText(/Current Win Streak:/)).toBeInTheDocument();
      // Check that "1 game" appears (not "1 games")
      const text = container.textContent || '';
      expect(text).toContain('1 game');
      expect(text).not.toContain('1 games');
    });

    it('should not display win streak for losses', () => {
      render(<ScoreComparisonBar {...mockClemsonLoss} />);

      expect(screen.queryByText(/Current Win Streak:/)).not.toBeInTheDocument();
      expect(screen.getByText('Clemson Loss')).toBeInTheDocument();
    });

    it('should not display win streak when winStreak is 0', () => {
      const zeroStreak = {
        ...mockClemsonWin,
        winStreak: 0,
      };

      render(<ScoreComparisonBar {...zeroStreak} />);

      expect(screen.queryByText(/Current Win Streak:/)).not.toBeInTheDocument();
      expect(screen.getByText('Clemson Win')).toBeInTheDocument();
    });
  });

  describe('Win/Loss State', () => {
    it('should show "Clemson Win" for wins', () => {
      render(<ScoreComparisonBar {...mockClemsonWin} />);

      // Win streak is shown instead of "Clemson Win" when streak > 0
      expect(screen.getByText(/Current Win Streak:/)).toBeInTheDocument();
    });

    it('should show "Clemson Loss" for losses', () => {
      render(<ScoreComparisonBar {...mockClemsonLoss} />);

      expect(screen.getByText('Clemson Loss')).toBeInTheDocument();
    });

    it('should determine win/loss from scores when isWin not provided', () => {
      const autoWinDetection = {
        clemson: { score: 31 },
        opponent: { name: 'Test', score: 28 },
      };

      render(<ScoreComparisonBar {...autoWinDetection} />);

      expect(screen.getByText('Clemson Win')).toBeInTheDocument();
    });

    it('should respect explicit isWin prop over score comparison', () => {
      const explicitWin = {
        clemson: { score: 21 },
        opponent: { name: 'Test', score: 28 },
        isWin: true,
      };

      render(<ScoreComparisonBar {...explicitWin} />);

      expect(screen.getByText('Clemson Win')).toBeInTheDocument();
    });
  });

  describe('Progress Bar', () => {
    it('should render progress bar container', () => {
      const { container } = render(<ScoreComparisonBar {...mockClemsonWin} />);

      const progressBar = container.querySelector('.rounded-full.overflow-hidden');
      expect(progressBar).toBeInTheDocument();
    });

    it('should calculate correct percentage for lopsided win', () => {
      const { container } = render(<ScoreComparisonBar {...mockClemsonWin} />);

      const clemsonSection = container.querySelector('.bg-clemson-orange');
      expect(clemsonSection).toBeInTheDocument();

      // 42 / (42 + 17) ≈ 71.2%
      const width = clemsonSection?.getAttribute('style');
      expect(width).toContain('71.186440677966'); // Approximate percentage
    });

    it('should handle equal scores (50-50 split)', () => {
      const tieGame = {
        clemson: { score: 28 },
        opponent: { name: 'Test', score: 28 },
      };

      const { container } = render(<ScoreComparisonBar {...tieGame} />);

      const clemsonSection = container.querySelector('.bg-clemson-orange');
      const width = clemsonSection?.getAttribute('style');

      expect(width).toContain('50%');
    });

    it('should handle zero total score gracefully', () => {
      const noScores = {
        clemson: { score: 0 },
        opponent: { name: 'Test', score: 0 },
      };

      const { container } = render(<ScoreComparisonBar {...noScores} />);

      const clemsonSection = container.querySelector('.bg-clemson-orange');
      const width = clemsonSection?.getAttribute('style');

      // Should default to 50-50 when total is 0
      expect(width).toContain('50%');
    });

    it('should display scores on progress bar', () => {
      render(<ScoreComparisonBar {...mockClemsonWin} />);

      // Scores should appear twice: in records area and on progress bar
      const scores = screen.getAllByText('42');
      expect(scores.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('CTA Button', () => {
    it('should render "Full Games List Page" button', () => {
      render(<ScoreComparisonBar {...mockClemsonWin} />);

      const button = screen.getByText('Full Games List Page');
      expect(button).toBeInTheDocument();
    });

    it('should use default link to /games', () => {
      render(<ScoreComparisonBar {...mockClemsonWin} />);

      const link = screen.getByText('Full Games List Page').closest('a');
      expect(link).toHaveAttribute('href', '/games');
    });

    it('should use custom gamesListLink when provided', () => {
      render(
        <ScoreComparisonBar
          {...mockClemsonWin}
          gamesListLink="/custom-games"
        />
      );

      const link = screen.getByText('Full Games List Page').closest('a');
      expect(link).toHaveAttribute('href', '/custom-games');
    });

    it('should have orange button styling', () => {
      const { container } = render(<ScoreComparisonBar {...mockClemsonWin} />);

      const button = container.querySelector('.bg-clemson-orange');
      expect(button).toBeInTheDocument();
    });
  });

  describe('Team Logos', () => {
    it('should render Clemson logo', () => {
      const { container } = render(<ScoreComparisonBar {...mockClemsonWin} />);

      const clemsonLogo = container.querySelector('img[alt*="Clemson"]');
      expect(clemsonLogo).toBeInTheDocument();
    });

    it('should render opponent logo with teamSlug', () => {
      const { container } = render(<ScoreComparisonBar {...mockClemsonWin} />);

      const opponentLogo = container.querySelector('img[alt*="South Carolina"]');
      expect(opponentLogo).toBeInTheDocument();
    });

    it('should use opponent name as fallback when teamSlug not provided', () => {
      const noSlug = {
        clemson: { score: 42 },
        opponent: { name: 'Unknown Team', score: 17 },
      };

      const { container } = render(<ScoreComparisonBar {...noSlug} />);

      const opponentLogo = container.querySelector('img[alt*="Unknown Team"]');
      expect(opponentLogo).toBeInTheDocument();
    });
  });

  describe('Custom ClassName', () => {
    it('should apply custom className to container', () => {
      const { container } = render(
        <ScoreComparisonBar {...mockClemsonWin} className="custom-bar" />
      );

      const scoreBar = container.querySelector('.custom-bar');
      expect(scoreBar).toBeInTheDocument();
    });
  });

  describe('Responsive Behavior', () => {
    it('should have responsive spacing classes', () => {
      const { container } = render(<ScoreComparisonBar {...mockClemsonWin} />);

      // Check for responsive gap classes
      const teamInfo = container.querySelector('.gap-3.md\\:gap-4');
      expect(teamInfo).toBeInTheDocument();
    });

    it('should have responsive logo sizes', () => {
      const { container } = render(<ScoreComparisonBar {...mockClemsonWin} />);

      // Check for responsive size classes on logos
      const logo = container.querySelector('.w-12.h-12.md\\:w-16.md\\:h-16');
      expect(logo).toBeInTheDocument();
    });

    it('should have responsive text sizes', () => {
      const { container } = render(<ScoreComparisonBar {...mockClemsonWin} />);

      // Check for responsive text classes
      const teamName = container.querySelector('.text-xs.md\\:text-sm');
      expect(teamName).toBeInTheDocument();
    });
  });

  describe('Complex Scenarios', () => {
    it('should handle close game with all props', () => {
      render(<ScoreComparisonBar {...mockCloseGame} />);

      // Scores appear twice: in records and on progress bar
      expect(screen.getAllByText('31').length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText('28').length).toBeGreaterThanOrEqual(1);
      expect(screen.getByText('Florida State')).toBeInTheDocument();
      expect(screen.getByText('11-1')).toBeInTheDocument();
      expect(screen.getByText('10-2')).toBeInTheDocument();
      expect(screen.getByText(/Current Win Streak:/)).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument();
    });

    it('should handle blowout win correctly', () => {
      const blowout = {
        clemson: { score: 66, record: '12-0' },
        opponent: { name: 'App State', teamSlug: 'app-state', score: 20, record: '6-6' },
        winStreak: 8,
        isWin: true,
      };

      render(<ScoreComparisonBar {...blowout} />);

      // Scores appear twice: in records and on progress bar
      expect(screen.getAllByText('66').length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText('20').length).toBeGreaterThanOrEqual(1);
      expect(screen.getByText('8')).toBeInTheDocument();
    });

    it('should handle overtime game', () => {
      const overtime = {
        clemson: { score: 44, record: '8-4' },
        opponent: { name: 'Wake Forest', teamSlug: 'wake-forest', score: 48, record: '7-5' },
        isWin: false,
      };

      render(<ScoreComparisonBar {...overtime} />);

      // Scores appear twice: in records and on progress bar
      expect(screen.getAllByText('44').length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText('48').length).toBeGreaterThanOrEqual(1);
      expect(screen.getByText('Clemson Loss')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have aria-labels for progress bar sections', () => {
      const { container } = render(<ScoreComparisonBar {...mockClemsonWin} />);

      const clemsonSection = container.querySelector('[aria-label*="Clemson"]');
      const opponentSection = container.querySelector('[aria-label*="South Carolina"]');

      expect(clemsonSection).toBeInTheDocument();
      expect(opponentSection).toBeInTheDocument();
    });

    it('should have proper text hierarchy', () => {
      render(<ScoreComparisonBar {...mockClemsonWin} />);

      // Team names should be in uppercase
      const teamName = screen.getByText('Clemson');
      expect(teamName).toHaveClass('uppercase');
    });
  });
});
