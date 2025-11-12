/**
 * Unit tests for ComparisonSelector component
 */

import { render, screen, fireEvent } from '@testing-library/react';
import { ComparisonSelector, GameCheckbox } from './ComparisonSelector';
import { useRouter, useSearchParams } from 'next/navigation';

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
}));

describe('GameCheckbox', () => {
  it('renders checkbox with label', () => {
    const onToggle = jest.fn();
    render(
      <GameCheckbox
        slug="test-game"
        isSelected={false}
        isDisabled={false}
        onToggle={onToggle}
      />
    );

    expect(screen.getByLabelText('Select test-game for comparison')).toBeInTheDocument();
    expect(screen.getByText('Compare')).toBeInTheDocument();
  });

  it('calls onToggle when checkbox is clicked', () => {
    const onToggle = jest.fn();
    render(
      <GameCheckbox
        slug="test-game"
        isSelected={false}
        isDisabled={false}
        onToggle={onToggle}
      />
    );

    const checkbox = screen.getByLabelText('Select test-game for comparison');
    fireEvent.click(checkbox);

    expect(onToggle).toHaveBeenCalledWith('test-game');
  });

  it('is checked when isSelected is true', () => {
    const onToggle = jest.fn();
    render(
      <GameCheckbox
        slug="test-game"
        isSelected={true}
        isDisabled={false}
        onToggle={onToggle}
      />
    );

    const checkbox = screen.getByLabelText('Select test-game for comparison') as HTMLInputElement;
    expect(checkbox.checked).toBe(true);
  });

  it('is disabled when isDisabled is true and not selected', () => {
    const onToggle = jest.fn();
    render(
      <GameCheckbox
        slug="test-game"
        isSelected={false}
        isDisabled={true}
        onToggle={onToggle}
      />
    );

    const checkbox = screen.getByLabelText('Select test-game for comparison');
    expect(checkbox).toBeDisabled();
  });

  it('is not disabled when isDisabled is true but isSelected is true', () => {
    const onToggle = jest.fn();
    render(
      <GameCheckbox
        slug="test-game"
        isSelected={true}
        isDisabled={true}
        onToggle={onToggle}
      />
    );

    const checkbox = screen.getByLabelText('Select test-game for comparison');
    expect(checkbox).not.toBeDisabled();
  });
});

describe('ComparisonSelector', () => {
  const mockRouter = {
    push: jest.fn(),
    replace: jest.fn(),
  };

  const mockSearchParams = {
    get: jest.fn(() => null),
    toString: jest.fn(() => ''),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (useSearchParams as jest.Mock).mockReturnValue(mockSearchParams);
  });

  it('does not render when no games are selected', () => {
    const { container } = render(<ComparisonSelector />);
    expect(container.firstChild).toBeNull();
  });

  it('renders selection info when games are selected', () => {
    // Mock URL params with selected games
    mockSearchParams.get.mockReturnValue('game1,game2');

    render(<ComparisonSelector />);

    expect(screen.getByText('2 games selected')).toBeInTheDocument();
  });

  it('shows helper text for minimum games requirement', () => {
    mockSearchParams.get.mockReturnValue('game1');

    render(<ComparisonSelector minGames={2} />);

    expect(screen.getByText('Select at least 2 games to compare')).toBeInTheDocument();
  });

  it('shows ready state when minimum games selected', () => {
    mockSearchParams.get.mockReturnValue('game1,game2');

    render(<ComparisonSelector minGames={2} />);

    expect(screen.getByText('Ready to compare')).toBeInTheDocument();
  });

  it('shows maximum reached message when max games selected', () => {
    mockSearchParams.get.mockReturnValue('game1,game2,game3,game4');

    render(<ComparisonSelector maxGames={4} />);

    expect(screen.getByText('Maximum 4 games reached')).toBeInTheDocument();
  });

  it('disables compare button when below minimum games', () => {
    mockSearchParams.get.mockReturnValue('game1');

    render(<ComparisonSelector minGames={2} />);

    const compareButton = screen.getByLabelText('Compare selected games');
    expect(compareButton).toBeDisabled();
  });

  it('enables compare button when requirements met', () => {
    mockSearchParams.get.mockReturnValue('game1,game2');

    render(<ComparisonSelector minGames={2} />);

    const compareButton = screen.getByLabelText('Compare selected games');
    expect(compareButton).not.toBeDisabled();
  });

  it('renders progress indicator', () => {
    mockSearchParams.get.mockReturnValue('game1,game2');

    const { container } = render(<ComparisonSelector maxGames={4} />);

    const progressBars = container.querySelectorAll('.h-1.flex-1');
    expect(progressBars).toHaveLength(4);
  });

  it('highlights progress bars for selected games', () => {
    mockSearchParams.get.mockReturnValue('game1,game2');

    const { container } = render(<ComparisonSelector maxGames={4} />);

    const progressBars = container.querySelectorAll('.h-1.flex-1');
    // First 2 should be highlighted
    expect(progressBars[0]).toHaveClass('bg-clemson-orange');
    expect(progressBars[1]).toHaveClass('bg-clemson-orange');
    expect(progressBars[2]).toHaveClass('bg-gray-200');
    expect(progressBars[3]).toHaveClass('bg-gray-200');
  });

  it('calls onSelectionChange when selection changes', () => {
    const onSelectionChange = jest.fn();
    mockSearchParams.get.mockReturnValue('game1,game2');

    render(<ComparisonSelector onSelectionChange={onSelectionChange} />);

    expect(onSelectionChange).toHaveBeenCalledWith(['game1', 'game2']);
  });

  it('shows correct count for singular game', () => {
    mockSearchParams.get.mockReturnValue('game1');

    render(<ComparisonSelector />);

    expect(screen.getByText('1 game selected')).toBeInTheDocument();
  });

  it('shows correct count for plural games', () => {
    mockSearchParams.get.mockReturnValue('game1,game2,game3');

    render(<ComparisonSelector />);

    expect(screen.getByText('3 games selected')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    mockSearchParams.get.mockReturnValue('game1');

    const { container } = render(<ComparisonSelector className="custom-class" />);

    expect(container.querySelector('.custom-class')).toBeInTheDocument();
  });

  it('respects maxGames limit from URL params', () => {
    // Try to select 6 games but max is 4
    mockSearchParams.get.mockReturnValue('game1,game2,game3,game4,game5,game6');

    render(<ComparisonSelector maxGames={4} />);

    // Should only show 4 games selected
    expect(screen.getByText('4 games selected')).toBeInTheDocument();
  });

  it('renders GitCompare icon', () => {
    mockSearchParams.get.mockReturnValue('game1');

    const { container } = render(<ComparisonSelector />);

    // Check for the icon by class (lucide-react adds this)
    const icon = container.querySelector('.lucide-git-compare');
    expect(icon).toBeInTheDocument();
  });

  it('renders clear button', () => {
    mockSearchParams.get.mockReturnValue('game1,game2');

    render(<ComparisonSelector />);

    expect(screen.getByLabelText('Clear selection')).toBeInTheDocument();
  });

  it('shows sticky positioning classes', () => {
    mockSearchParams.get.mockReturnValue('game1');

    const { container } = render(<ComparisonSelector />);

    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass('sticky', 'bottom-0');
  });
});
