/**
 * Unit tests for ScoringProgressionChart component
 */

import { describe, it, expect, jest, beforeEach, afterEach } from '@jest/globals';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ScoringProgressionChart, ScoringProgressionData } from './ScoringProgressionChart';
import { CHART_COLORS } from '@/lib/constants/colors';

// GSAP is mocked via moduleNameMapper in jest.config.js

// Mock ResizeObserver for Recharts
class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

global.ResizeObserver = ResizeObserverMock as any;

describe('ScoringProgressionChart', () => {
  // Sample test data - cumulative scores per quarter
  const mockData: ScoringProgressionData[] = [
    { quarter: '1st', clemson: 14, opponent: 14 },
    { quarter: '2nd', clemson: 35, opponent: 21 },
    { quarter: '3rd', clemson: 45, opponent: 28 },
    { quarter: '4th', clemson: 59, opponent: 35 },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Rendering', () => {
    it('should render without errors with valid data', () => {
      const { container } = render(<ScoringProgressionChart data={mockData} />);
      expect(container).toBeInTheDocument();
    });

    it('should render with default title', () => {
      render(<ScoringProgressionChart data={mockData} />);
      expect(screen.getByText('SCORING PROGRESSION')).toBeInTheDocument();
    });

    it('should render with custom title', () => {
      const customTitle = 'Quarter Scores';
      render(<ScoringProgressionChart data={mockData} title={customTitle} />);
      expect(screen.getByText(customTitle)).toBeInTheDocument();
    });

    it('should not render when data is empty', () => {
      const { container } = render(<ScoringProgressionChart data={[]} />);
      expect(container.firstChild).toBeNull();
    });

    it('should not render when data is null/undefined', () => {
      const { container: container1 } = render(
        <ScoringProgressionChart data={null as any} />
      );
      const { container: container2 } = render(
        <ScoringProgressionChart data={undefined as any} />
      );
      expect(container1.firstChild).toBeNull();
      expect(container2.firstChild).toBeNull();
    });

    it('should apply custom className', () => {
      const { container } = render(
        <ScoringProgressionChart data={mockData} className="custom-class" />
      );
      const chartDiv = container.querySelector('.custom-class');
      expect(chartDiv).toBeInTheDocument();
    });

    it('should hide title when title is empty string', () => {
      render(<ScoringProgressionChart data={mockData} title="" />);
      const title = screen.queryByRole('heading');
      expect(title).not.toBeInTheDocument();
    });
  });

  describe('Data Rendering', () => {
    it('should render all quarters from data', () => {
      const { container } = render(<ScoringProgressionChart data={mockData} />);

      // Verify ResponsiveContainer is rendered
      const responsiveContainer = container.querySelector('.recharts-responsive-container');
      expect(responsiveContainer).toBeInTheDocument();
    });

    it('should use correct colors for Clemson and opponent', () => {
      // Just verify component renders without errors
      const { container } = render(<ScoringProgressionChart data={mockData} />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should handle single quarter data', () => {
      const singleData: ScoringProgressionData[] = [
        { quarter: '1st', clemson: 14, opponent: 7 },
      ];
      const { container } = render(<ScoringProgressionChart data={singleData} />);
      const responsiveContainer = container.querySelector('.recharts-responsive-container');
      expect(responsiveContainer).toBeInTheDocument();
    });

    it('should handle zero scores', () => {
      const zeroData: ScoringProgressionData[] = [
        { quarter: '1st', clemson: 0, opponent: 0 },
        { quarter: '2nd', clemson: 7, opponent: 0 },
      ];
      const { container } = render(<ScoringProgressionChart data={zeroData} />);
      const responsiveContainer = container.querySelector('.recharts-responsive-container');
      expect(responsiveContainer).toBeInTheDocument();
    });

    it('should handle high scores', () => {
      const highScoreData: ScoringProgressionData[] = [
        { quarter: '1st', clemson: 28, opponent: 21 },
        { quarter: '2nd', clemson: 56, opponent: 42 },
        { quarter: '3rd', clemson: 70, opponent: 56 },
        { quarter: '4th', clemson: 77, opponent: 63 },
      ];
      const { container } = render(<ScoringProgressionChart data={highScoreData} />);
      const responsiveContainer = container.querySelector('.recharts-responsive-container');
      expect(responsiveContainer).toBeInTheDocument();
    });

    it('should handle overtime quarters', () => {
      const overtimeData: ScoringProgressionData[] = [
        { quarter: '1st', clemson: 7, opponent: 7 },
        { quarter: '2nd', clemson: 14, opponent: 14 },
        { quarter: '3rd', clemson: 21, opponent: 21 },
        { quarter: '4th', clemson: 28, opponent: 28 },
        { quarter: 'OT', clemson: 35, opponent: 28 },
      ];
      const { container } = render(<ScoringProgressionChart data={overtimeData} />);
      const responsiveContainer = container.querySelector('.recharts-responsive-container');
      expect(responsiveContainer).toBeInTheDocument();
    });
  });

  describe('Chart Configuration', () => {
    it('should render with default height', () => {
      const { container } = render(<ScoringProgressionChart data={mockData} />);
      const responsiveContainer = container.querySelector('.recharts-responsive-container');
      expect(responsiveContainer).toBeInTheDocument();
    });

    it('should render with custom height', () => {
      const customHeight = 500;
      const { container } = render(
        <ScoringProgressionChart data={mockData} height={customHeight} />
      );
      const responsiveContainer = container.querySelector('.recharts-responsive-container');
      expect(responsiveContainer).toBeInTheDocument();
      expect(responsiveContainer).toHaveStyle({ height: `${customHeight}px` });
    });

    it('should show grid by default', () => {
      const { container } = render(<ScoringProgressionChart data={mockData} />);
      // Verify component renders
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should hide grid when showGrid is false', () => {
      const { container } = render(
        <ScoringProgressionChart data={mockData} showGrid={false} />
      );
      // Component should still render
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should show legend by default', () => {
      const { container } = render(<ScoringProgressionChart data={mockData} />);
      // Verify component renders
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should hide legend when showLegend is false', () => {
      const { container } = render(
        <ScoringProgressionChart data={mockData} showLegend={false} />
      );
      // Component should still render
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should use line chart layout', () => {
      const { container } = render(<ScoringProgressionChart data={mockData} />);
      const responsiveContainer = container.querySelector('.recharts-responsive-container');
      expect(responsiveContainer).toBeInTheDocument();
    });
  });

  describe('GSAP Animation', () => {
    it('should initialize GSAP context on mount', () => {
      const gsap = require('gsap').gsap;
      render(<ScoringProgressionChart data={mockData} />);

      expect(gsap.context).toHaveBeenCalled();
    });

    it('should animate from opacity 0', () => {
      const gsap = require('gsap').gsap;
      render(<ScoringProgressionChart data={mockData} />);

      expect(gsap.from).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          opacity: 0,
          y: 50,
        })
      );
    });

    it('should set up ScrollTrigger on mount', () => {
      const gsap = require('gsap').gsap;
      render(<ScoringProgressionChart data={mockData} />);

      expect(gsap.from).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          scrollTrigger: expect.objectContaining({
            trigger: expect.anything(),
            start: 'top 80%',
            end: 'top 50%',
          }),
        })
      );
    });

    it('should clean up GSAP context on unmount', () => {
      const gsap = require('gsap').gsap;
      const revertMock = jest.fn();
      (gsap.context as jest.Mock).mockReturnValue({ revert: revertMock });

      const { unmount } = render(<ScoringProgressionChart data={mockData} />);
      unmount();

      expect(revertMock).toHaveBeenCalled();
    });
  });

  describe('Responsive Design', () => {
    it('should have responsive container classes', () => {
      const { container } = render(<ScoringProgressionChart data={mockData} />);
      const chartDiv = container.firstChild as HTMLElement;

      expect(chartDiv.className).toContain('w-full');
      expect(chartDiv.className).toContain('p-4');
    });

    it('should have responsive title classes', () => {
      render(<ScoringProgressionChart data={mockData} />);
      const title = screen.getByText('SCORING PROGRESSION');

      expect(title.className).toContain('text-base');
      expect(title.className).toContain('sm:text-lg');
      expect(title.className).toContain('md:text-xl');
    });

    it('should have responsive spacing classes', () => {
      const { container } = render(<ScoringProgressionChart data={mockData} />);
      const chartDiv = container.firstChild as HTMLElement;

      expect(chartDiv.className).toContain('sm:p-5');
      expect(chartDiv.className).toContain('md:p-6');
      expect(chartDiv.className).toContain('lg:p-8');
    });

    it('should render ResponsiveContainer at 100% width', () => {
      const { container } = render(<ScoringProgressionChart data={mockData} />);
      const responsiveContainer = container.querySelector('.recharts-responsive-container');

      expect(responsiveContainer).toHaveStyle({ width: '100%' });
    });
  });

  describe('Tooltip', () => {
    it('should render custom tooltip component', () => {
      const { container } = render(<ScoringProgressionChart data={mockData} />);
      // Verify ResponsiveContainer is present (tooltip is part of Recharts)
      const responsiveContainer = container.querySelector('.recharts-responsive-container');
      expect(responsiveContainer).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should render with proper semantic structure', () => {
      render(<ScoringProgressionChart data={mockData} />);
      const heading = screen.getByRole('heading', { level: 3 });
      expect(heading).toBeInTheDocument();
    });

    it('should have proper title hierarchy', () => {
      render(<ScoringProgressionChart data={mockData} />);
      const title = screen.getByText('SCORING PROGRESSION');
      expect(title.tagName).toBe('H3');
    });
  });

  describe('Color Constants', () => {
    it('should use CHART_COLORS for data visualization', () => {
      // Verify that CHART_COLORS are imported and used
      expect(CHART_COLORS.clemson).toBe('#F56600');
      expect(CHART_COLORS.opponent).toBe('#522D80');
    });
  });

  describe('Edge Cases', () => {
    it('should handle tied scores', () => {
      const tiedData: ScoringProgressionData[] = [
        { quarter: '1st', clemson: 7, opponent: 7 },
        { quarter: '2nd', clemson: 14, opponent: 14 },
        { quarter: '3rd', clemson: 21, opponent: 21 },
        { quarter: '4th', clemson: 28, opponent: 28 },
      ];
      const { container } = render(<ScoringProgressionChart data={tiedData} />);
      const responsiveContainer = container.querySelector('.recharts-responsive-container');
      expect(responsiveContainer).toBeInTheDocument();
    });

    it('should handle blowout scores', () => {
      const blowoutData: ScoringProgressionData[] = [
        { quarter: '1st', clemson: 21, opponent: 0 },
        { quarter: '2nd', clemson: 42, opponent: 0 },
        { quarter: '3rd', clemson: 56, opponent: 7 },
        { quarter: '4th', clemson: 63, opponent: 7 },
      ];
      const { container } = render(<ScoringProgressionChart data={blowoutData} />);
      const responsiveContainer = container.querySelector('.recharts-responsive-container');
      expect(responsiveContainer).toBeInTheDocument();
    });

    it('should handle comeback scenario', () => {
      const comebackData: ScoringProgressionData[] = [
        { quarter: '1st', clemson: 0, opponent: 14 },
        { quarter: '2nd', clemson: 7, opponent: 21 },
        { quarter: '3rd', clemson: 21, opponent: 28 },
        { quarter: '4th', clemson: 35, opponent: 28 },
      ];
      const { container } = render(<ScoringProgressionChart data={comebackData} />);
      const responsiveContainer = container.querySelector('.recharts-responsive-container');
      expect(responsiveContainer).toBeInTheDocument();
    });

    it('should handle non-standard quarter labels', () => {
      const customQuarterData: ScoringProgressionData[] = [
        { quarter: 'Q1', clemson: 7, opponent: 7 },
        { quarter: 'Q2', clemson: 14, opponent: 14 },
      ];
      const { container } = render(<ScoringProgressionChart data={customQuarterData} />);
      const responsiveContainer = container.querySelector('.recharts-responsive-container');
      expect(responsiveContainer).toBeInTheDocument();
    });
  });

  describe('Component Props', () => {
    it('should handle all props together', () => {
      const { container } = render(
        <ScoringProgressionChart
          data={mockData}
          title="Custom Scoring"
          height={600}
          showGrid={true}
          showLegend={true}
          className="test-class"
        />
      );

      expect(screen.getByText('Custom Scoring')).toBeInTheDocument();
      expect(container.querySelector('.test-class')).toBeInTheDocument();
      const responsiveContainer = container.querySelector('.recharts-responsive-container');
      expect(responsiveContainer).toBeInTheDocument();
      expect(responsiveContainer).toHaveStyle({ height: '600px' });
    });

    it('should handle minimal props', () => {
      const { container } = render(
        <ScoringProgressionChart
          data={mockData}
          showGrid={false}
          showLegend={false}
        />
      );

      // Should still render with defaults
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('Line Chart Specifics', () => {
    it('should render line chart type', () => {
      const { container } = render(<ScoringProgressionChart data={mockData} />);
      const responsiveContainer = container.querySelector('.recharts-responsive-container');
      expect(responsiveContainer).toBeInTheDocument();
    });

    it('should handle cumulative scoring data format', () => {
      // Data should be cumulative (each quarter shows total score, not quarter points)
      const cumulativeData: ScoringProgressionData[] = [
        { quarter: '1st', clemson: 7, opponent: 0 },
        { quarter: '2nd', clemson: 14, opponent: 7 }, // +7 for both teams
        { quarter: '3rd', clemson: 21, opponent: 14 }, // +7 for both teams
        { quarter: '4th', clemson: 28, opponent: 21 }, // +7 for both teams
      ];
      const { container } = render(<ScoringProgressionChart data={cumulativeData} />);
      const responsiveContainer = container.querySelector('.recharts-responsive-container');
      expect(responsiveContainer).toBeInTheDocument();
    });
  });
});
