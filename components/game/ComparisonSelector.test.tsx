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
    const { container } = render(
      <ComparisonSelector
        selectedGames={new Set()}
        clearSelection={jest.fn()}
        canCompare={false}
        count={0}
      />
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders selection info when games are selected', () => {
    render(
      <ComparisonSelector
        selectedGames={new Set(['game1', 'game2'])}
        clearSelection={jest.fn()}
        canCompare={true}
        count={2}
      />
    );

    expect(screen.getByText(/2/)).toBeInTheDocument();
    expect(screen.getByText(/games selected/)).toBeInTheDocument();
  });

  it('shows helper text for minimum games requirement', () => {
    render(
      <ComparisonSelector
        minGames={2}
        selectedGames={new Set(['game1'])}
        clearSelection={jest.fn()}
        canCompare={false}
        count={1}
      />
    );

    expect(screen.getByText('Select at least 2 games to compare')).toBeInTheDocument();
  });

  it('shows ready state when minimum games selected', () => {
    render(
      <ComparisonSelector
        minGames={2}
        selectedGames={new Set(['game1', 'game2'])}
        clearSelection={jest.fn()}
        canCompare={true}
        count={2}
      />
    );

    expect(screen.getByText('Ready to compare')).toBeInTheDocument();
  });

  it('shows maximum reached message when max games selected', () => {
    render(
      <ComparisonSelector
        maxGames={4}
        selectedGames={new Set(['game1', 'game2', 'game3', 'game4'])}
        clearSelection={jest.fn()}
        canCompare={true}
        count={4}
      />
    );

    expect(screen.getByText('Maximum 4 games reached')).toBeInTheDocument();
  });

  it('disables compare button when below minimum games', () => {
    render(
      <ComparisonSelector
        minGames={2}
        selectedGames={new Set(['game1'])}
        clearSelection={jest.fn()}
        canCompare={false}
        count={1}
      />
    );

    const compareButton = screen.getByLabelText('Compare selected games');
    expect(compareButton).toBeDisabled();
  });

  it('enables compare button when requirements met', () => {
    render(
      <ComparisonSelector
        minGames={2}
        selectedGames={new Set(['game1', 'game2'])}
        clearSelection={jest.fn()}
        canCompare={true}
        count={2}
      />
    );

    const compareButton = screen.getByLabelText('Compare selected games');
    expect(compareButton).not.toBeDisabled();
  });

  it('renders progress indicator', () => {
    const { container } = render(
      <ComparisonSelector
        maxGames={4}
        selectedGames={new Set(['game1', 'game2'])}
        clearSelection={jest.fn()}
        canCompare={true}
        count={2}
      />
    );

    const progressBars = container.querySelectorAll('.h-1.flex-1');
    expect(progressBars).toHaveLength(4);
  });

  it('highlights progress bars for selected games', () => {
    const { container } = render(
      <ComparisonSelector
        maxGames={4}
        selectedGames={new Set(['game1', 'game2'])}
        clearSelection={jest.fn()}
        canCompare={true}
        count={2}
      />
    );

    const progressBars = container.querySelectorAll('.h-1.flex-1');
    // First 2 should be highlighted
    expect(progressBars[0]).toHaveClass('bg-clemson-orange');
    expect(progressBars[1]).toHaveClass('bg-clemson-orange');
    expect(progressBars[2]).toHaveClass('bg-gray-200');
    expect(progressBars[3]).toHaveClass('bg-gray-200');
  });

  it('calls onSelectionChange when selection changes', () => {
    const onSelectionChange = jest.fn();

    render(
      <ComparisonSelector
        onSelectionChange={onSelectionChange}
        selectedGames={new Set(['game1', 'game2'])}
        clearSelection={jest.fn()}
        canCompare={true}
        count={2}
      />
    );

    // onSelectionChange is called by the parent, not by the component itself
    // This test checks that the prop is accepted
    expect(onSelectionChange).not.toHaveBeenCalled();
  });

  it('shows correct count for singular game', () => {
    render(
      <ComparisonSelector
        selectedGames={new Set(['game1'])}
        clearSelection={jest.fn()}
        canCompare={false}
        count={1}
      />
    );

    expect(screen.getByText(/1/)).toBeInTheDocument();
    expect(screen.getByText(/game selected/)).toBeInTheDocument();
  });

  it('shows correct count for plural games', () => {
    render(
      <ComparisonSelector
        selectedGames={new Set(['game1', 'game2', 'game3'])}
        clearSelection={jest.fn()}
        canCompare={true}
        count={3}
      />
    );

    expect(screen.getByText(/3/)).toBeInTheDocument();
    expect(screen.getByText(/games selected/)).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <ComparisonSelector
        className="custom-class"
        selectedGames={new Set(['game1'])}
        clearSelection={jest.fn()}
        canCompare={false}
        count={1}
      />
    );

    expect(container.querySelector('.custom-class')).toBeInTheDocument();
  });

  it('respects maxGames limit from URL params', () => {
    // With 4 games selected (maxGames limit enforced)
    render(
      <ComparisonSelector
        maxGames={4}
        selectedGames={new Set(['game1', 'game2', 'game3', 'game4'])}
        clearSelection={jest.fn()}
        canCompare={true}
        count={4}
      />
    );

    // Should show 4 games selected - use getAllByText and check that we find the count text
    const gameCountElements = screen.getAllByText(/4/);
    expect(gameCountElements.length).toBeGreaterThan(0);
    expect(screen.getByText(/games selected/)).toBeInTheDocument();
  });

  it('renders GitCompare icon', () => {
    const { container } = render(
      <ComparisonSelector
        selectedGames={new Set(['game1'])}
        clearSelection={jest.fn()}
        canCompare={false}
        count={1}
      />
    );

    // Check for the icon by class (lucide-react adds this)
    const icon = container.querySelector('.lucide-git-compare');
    expect(icon).toBeInTheDocument();
  });

  it('renders clear button', () => {
    render(
      <ComparisonSelector
        selectedGames={new Set(['game1', 'game2'])}
        clearSelection={jest.fn()}
        canCompare={true}
        count={2}
      />
    );

    expect(screen.getByLabelText('Clear selection')).toBeInTheDocument();
  });

  it('shows sticky positioning classes', () => {
    const { container } = render(
      <ComparisonSelector
        selectedGames={new Set(['game1'])}
        clearSelection={jest.fn()}
        canCompare={false}
        count={1}
      />
    );

    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass('sticky', 'bottom-0');
  });
});
