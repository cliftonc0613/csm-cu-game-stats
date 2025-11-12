import { render, screen, fireEvent } from '@testing-library/react';
import { GameTable, TableColumn, TableRow } from './GameTable';

describe('GameTable', () => {
  const mockColumns: TableColumn[] = [
    { key: 'name', label: 'Player Name', sortable: true },
    { key: 'yards', label: 'Yards', sortable: true, align: 'right' },
    { key: 'touchdowns', label: 'TDs', sortable: true, align: 'center' },
    { key: 'team', label: 'Team', sortable: false },
  ];

  const mockData: TableRow[] = [
    { id: 1, name: 'John Smith', yards: 150, touchdowns: 2, team: 'Clemson' },
    { id: 2, name: 'Alice Johnson', yards: 200, touchdowns: 3, team: 'Clemson' },
    { id: 3, name: 'Bob Williams', yards: 75, touchdowns: 1, team: 'Clemson' },
  ];

  it('renders table with columns and data', () => {
    render(<GameTable columns={mockColumns} data={mockData} />);

    // Check column headers
    expect(screen.getByText('Player Name')).toBeInTheDocument();
    expect(screen.getByText('Yards')).toBeInTheDocument();
    expect(screen.getByText('TDs')).toBeInTheDocument();
    expect(screen.getByText('Team')).toBeInTheDocument();

    // Check data rows
    expect(screen.getByText('John Smith')).toBeInTheDocument();
    expect(screen.getByText('Alice Johnson')).toBeInTheDocument();
    expect(screen.getByText('Bob Williams')).toBeInTheDocument();
  });

  it('sorts data in ascending order when clicking sortable column header', () => {
    render(<GameTable columns={mockColumns} data={mockData} />);

    // Get all rows before sorting
    const nameHeader = screen.getByText('Player Name');
    fireEvent.click(nameHeader);

    // After sorting by name ascending, Alice should be first
    const rows = screen.getAllByRole('row');
    // rows[0] is header, rows[1] should be Alice
    expect(rows[1]).toHaveTextContent('Alice Johnson');
  });

  it('sorts data in descending order when clicking same column header twice', () => {
    render(<GameTable columns={mockColumns} data={mockData} />);

    const nameHeader = screen.getByText('Player Name');

    // First click: ascending
    fireEvent.click(nameHeader);

    // Second click: descending
    fireEvent.click(nameHeader);

    const rows = screen.getAllByRole('row');
    // After sorting descending, John Smith should be first
    expect(rows[1]).toHaveTextContent('John Smith');
  });

  it('sorts numeric values correctly', () => {
    render(<GameTable columns={mockColumns} data={mockData} />);

    const yardsHeader = screen.getByText('Yards');
    fireEvent.click(yardsHeader);

    const rows = screen.getAllByRole('row');
    // After sorting yards ascending, Bob (75) should be first
    expect(rows[1]).toHaveTextContent('Bob Williams');
    expect(rows[1]).toHaveTextContent('75');
  });

  it('does not sort when clicking non-sortable column', () => {
    const onSortChange = jest.fn();
    render(
      <GameTable
        columns={mockColumns}
        data={mockData}
        onSortChange={onSortChange}
      />
    );

    const teamHeader = screen.getByText('Team');
    fireEvent.click(teamHeader);

    // onSortChange should not be called for non-sortable columns
    expect(onSortChange).not.toHaveBeenCalled();
  });

  it('displays sort indicators', () => {
    render(<GameTable columns={mockColumns} data={mockData} />);

    const nameHeader = screen.getByText('Player Name').closest('th');

    // Before clicking, should show unsorted indicator (ChevronsUpDown)
    expect(nameHeader).toBeInTheDocument();

    // Click to sort ascending
    fireEvent.click(nameHeader!);

    // Should show ChevronUp for ascending
    const chevronUp = nameHeader!.querySelector('svg');
    expect(chevronUp).toBeInTheDocument();
  });

  it('calls onSortChange callback when sorting', () => {
    const onSortChange = jest.fn();
    render(
      <GameTable
        columns={mockColumns}
        data={mockData}
        onSortChange={onSortChange}
      />
    );

    const yardsHeader = screen.getByText('Yards');
    fireEvent.click(yardsHeader);

    expect(onSortChange).toHaveBeenCalledWith('yards', 'asc');

    // Click again for descending
    fireEvent.click(yardsHeader);
    expect(onSortChange).toHaveBeenCalledWith('yards', 'desc');
  });

  it('displays empty state when no data', () => {
    render(<GameTable columns={mockColumns} data={[]} />);

    expect(screen.getByText('No data available')).toBeInTheDocument();
  });

  it('renders with custom className', () => {
    const { container } = render(
      <GameTable
        columns={mockColumns}
        data={mockData}
        className="custom-class"
      />
    );

    const tableWrapper = container.querySelector('.custom-class');
    expect(tableWrapper).toBeInTheDocument();
  });

  it('applies striped styling when striped prop is true', () => {
    const { container } = render(
      <GameTable columns={mockColumns} data={mockData} striped={true} />
    );

    const rows = container.querySelectorAll('tbody tr');
    // Second row (index 1) should have striped class
    expect(rows[1]).toHaveClass('bg-muted/10');
  });

  it('renders custom cell content with render function', () => {
    const customColumns: TableColumn[] = [
      {
        key: 'name',
        label: 'Player',
        sortable: true,
        render: (value) => <strong data-testid="custom-cell">{value}</strong>,
      },
    ];

    render(<GameTable columns={customColumns} data={mockData} />);

    const customCells = screen.getAllByTestId('custom-cell');
    expect(customCells).toHaveLength(3);
    expect(customCells[0]).toHaveTextContent('John Smith');
  });

  it('applies correct text alignment based on column align prop', () => {
    const { container } = render(
      <GameTable columns={mockColumns} data={mockData} />
    );

    const headerRow = container.querySelector('thead tr');
    const headers = headerRow?.querySelectorAll('th');

    // First column (default left align) - no specific class
    expect(headers?.[0]).not.toHaveClass('text-center', 'text-right');

    // Second column (right align)
    expect(headers?.[1]).toHaveClass('text-right');

    // Third column (center align)
    expect(headers?.[2]).toHaveClass('text-center');
  });

  it('displays caption when provided', () => {
    render(
      <GameTable
        columns={mockColumns}
        data={mockData}
        caption="Game Statistics"
      />
    );

    expect(screen.getByText('Game Statistics')).toBeInTheDocument();
  });

  it('handles sorting with mixed case strings correctly', () => {
    const mixedCaseData: TableRow[] = [
      { id: 1, name: 'zebra', yards: 100, touchdowns: 1, team: 'Clemson' },
      { id: 2, name: 'Apple', yards: 200, touchdowns: 2, team: 'Clemson' },
      { id: 3, name: 'banana', yards: 150, touchdowns: 1, team: 'Clemson' },
    ];

    render(<GameTable columns={mockColumns} data={mixedCaseData} />);

    const nameHeader = screen.getByText('Player Name');
    fireEvent.click(nameHeader);

    const rows = screen.getAllByRole('row');
    // Should sort case-insensitively: Apple, banana, zebra
    expect(rows[1]).toHaveTextContent('Apple');
    expect(rows[2]).toHaveTextContent('banana');
    expect(rows[3]).toHaveTextContent('zebra');
  });

  it('handles null/undefined values in sorting', () => {
    const dataWithNulls: TableRow[] = [
      { id: 1, name: 'John', yards: null, touchdowns: 1, team: 'Clemson' },
      { id: 2, name: null, yards: 200, touchdowns: 2, team: 'Clemson' },
      { id: 3, name: 'Alice', yards: 150, touchdowns: 1, team: 'Clemson' },
    ];

    render(<GameTable columns={mockColumns} data={dataWithNulls} />);

    const nameHeader = screen.getByText('Player Name');
    fireEvent.click(nameHeader);

    // Should handle nulls without crashing
    const rows = screen.getAllByRole('row');
    expect(rows.length).toBeGreaterThan(0);
  });
});
