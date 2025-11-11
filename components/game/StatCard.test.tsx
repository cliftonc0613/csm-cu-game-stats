import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { StatCard } from './StatCard';

describe('StatCard Component', () => {
  describe('Basic Rendering', () => {
    it('should render the stat card with value and label', () => {
      render(<StatCard value={42} label="Points Scored" />);

      expect(screen.getByText('42')).toBeInTheDocument();
      expect(screen.getByText('Points Scored')).toBeInTheDocument();
    });

    it('should render with description text', () => {
      render(
        <StatCard
          value={489}
          label="Total Yards"
          description="offense"
        />
      );

      expect(screen.getByText('489')).toBeInTheDocument();
      expect(screen.getByText('Total Yards')).toBeInTheDocument();
      expect(screen.getByText('offense')).toBeInTheDocument();
    });
  });

  describe('Ordinal Suffixes', () => {
    it('should render ordinal suffix for 1st place', () => {
      render(
        <StatCard value={1} ordinal="st" label="ACC Standing" />
      );

      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('st')).toBeInTheDocument();
      expect(screen.getByText('ACC Standing')).toBeInTheDocument();
    });

    it('should render ordinal suffix for 2nd place', () => {
      render(
        <StatCard value={2} ordinal="nd" label="National Rank" />
      );

      expect(screen.getByText('2')).toBeInTheDocument();
      expect(screen.getByText('nd')).toBeInTheDocument();
    });

    it('should render ordinal suffix for 3rd place', () => {
      render(
        <StatCard value={3} ordinal="rd" label="Total Defense" />
      );

      expect(screen.getByText('3')).toBeInTheDocument();
      expect(screen.getByText('rd')).toBeInTheDocument();
    });

    it('should render ordinal suffix for 99th place', () => {
      render(
        <StatCard value={99} ordinal="th" label="National Ranking" />
      );

      expect(screen.getByText('99')).toBeInTheDocument();
      expect(screen.getByText('th')).toBeInTheDocument();
    });
  });

  describe('Color Variants', () => {
    it('should apply orange variant styles', () => {
      const { container } = render(
        <StatCard value={42} label="Points" variant="orange" />
      );

      const card = container.querySelector('.bg-clemson-orange');
      expect(card).toBeInTheDocument();
    });

    it('should apply purple variant styles', () => {
      const { container } = render(
        <StatCard value={17} label="Points" variant="purple" />
      );

      const card = container.querySelector('.bg-clemson-purple');
      expect(card).toBeInTheDocument();
    });

    it('should default to orange variant when not specified', () => {
      const { container } = render(
        <StatCard value={100} label="Test" />
      );

      const card = container.querySelector('.bg-clemson-orange');
      expect(card).toBeInTheDocument();
    });
  });

  describe('Size Variants', () => {
    it('should apply small size display number class', () => {
      const { container } = render(
        <StatCard value={85} label="Small Card" size="sm" />
      );

      const displayNumber = container.querySelector('.display-number-sm');
      expect(displayNumber).toBeInTheDocument();
    });

    it('should apply medium size display number class', () => {
      const { container } = render(
        <StatCard value={72} label="Medium Card" size="md" />
      );

      const displayNumber = container.querySelector('.display-number-md');
      expect(displayNumber).toBeInTheDocument();
    });

    it('should apply large size display number class', () => {
      const { container } = render(
        <StatCard value={99} label="Large Card" size="lg" />
      );

      const displayNumber = container.querySelector('.display-number-lg');
      expect(displayNumber).toBeInTheDocument();
    });

    it('should use default size when not specified', () => {
      const { container } = render(
        <StatCard value={50} label="Default Card" />
      );

      const displayNumber = container.querySelector('.display-number');
      expect(displayNumber).toBeInTheDocument();
    });

    it('should have consistent padding (p-6 md:p-8) regardless of size', () => {
      const { container } = render(
        <StatCard value={42} label="Test" size="lg" />
      );

      const card = container.querySelector('.p-6');
      expect(card).toBeInTheDocument();
    });
  });

  describe('Custom ClassName', () => {
    it('should apply custom className', () => {
      const { container } = render(
        <StatCard value={42} label="Test" className="custom-class" />
      );

      const card = container.querySelector('.custom-class');
      expect(card).toBeInTheDocument();
    });
  });

  describe('Complex Scenarios', () => {
    it('should render complete stat card with all props', () => {
      render(
        <StatCard
          value={99}
          ordinal="th"
          label="National Ranking"
          description="of 134 teams"
          variant="orange"
          size="lg"
          className="test-card"
        />
      );

      expect(screen.getByText('99')).toBeInTheDocument();
      expect(screen.getByText('th')).toBeInTheDocument();
      expect(screen.getByText('National Ranking')).toBeInTheDocument();
      expect(screen.getByText('of 134 teams')).toBeInTheDocument();
    });

    it('should handle large numbers', () => {
      render(<StatCard value={99999} label="Large Number" />);

      expect(screen.getByText('99999')).toBeInTheDocument();
    });

    it('should handle zero value', () => {
      render(<StatCard value={0} label="Zero Value" />);

      expect(screen.getByText('0')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper heading hierarchy', () => {
      render(
        <StatCard
          value={42}
          label="Points Scored"
          description="in the game"
        />
      );

      // Label should be in uppercase
      const label = screen.getByText('Points Scored');
      expect(label).toHaveClass('uppercase');
    });

    it('should render text in white for contrast on colored background', () => {
      const { container } = render(
        <StatCard value={42} label="Test" variant="orange" />
      );

      const textElements = container.querySelectorAll('.text-white');
      expect(textElements.length).toBeGreaterThan(0);
    });
  });
});
