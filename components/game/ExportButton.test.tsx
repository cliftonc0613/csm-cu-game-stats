/**
 * Unit tests for ExportButton component
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ExportButton } from './ExportButton';

// Mock fetch
global.fetch = jest.fn();

// Mock URL methods
global.URL.createObjectURL = jest.fn(() => 'blob:mock-url');
global.URL.revokeObjectURL = jest.fn();

describe('ExportButton', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset fetch mock
    (global.fetch as jest.Mock).mockClear();
  });

  it('renders export button', () => {
    render(<ExportButton slug="test-game" />);

    expect(screen.getByText('Export CSV')).toBeInTheDocument();
    expect(screen.getByLabelText('Export game data as CSV')).toBeInTheDocument();
  });

  it('shows loading state when exporting', async () => {
    // Mock successful fetch
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      headers: new Map([['Content-Disposition', 'attachment; filename="test.csv"']]),
      blob: async () => new Blob(['test data'], { type: 'text/csv' }),
    });

    render(<ExportButton slug="test-game" />);

    const exportButton = screen.getByText('Export CSV');
    fireEvent.click(exportButton);

    // Should show loading state
    expect(screen.getByText('Exporting...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByText('Exporting...')).not.toBeInTheDocument();
    });
  });

  it('calls fetch with correct URL on export', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      headers: new Map([['Content-Disposition', 'attachment; filename="test.csv"']]),
      blob: async () => new Blob(['test data'], { type: 'text/csv' }),
    });

    render(<ExportButton slug="test-game" />);

    const exportButton = screen.getByText('Export CSV');
    fireEvent.click(exportButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/export?slug=test-game&format=csv')
      );
    });
  });

  it('shows dropdown menu when dropdown button is clicked', () => {
    render(<ExportButton slug="test-game" />);

    const dropdownButton = screen.getByLabelText('Show export options');
    fireEvent.click(dropdownButton);

    expect(screen.getByText('Full Export (CSV)')).toBeInTheDocument();
    expect(screen.getByText('Metadata Only (CSV)')).toBeInTheDocument();
    expect(screen.getByText('Tables Only (CSV)')).toBeInTheDocument();
  });

  it('exports with selected format from dropdown', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      headers: new Map([['Content-Disposition', 'attachment; filename="test-metadata.csv"']]),
      blob: async () => new Blob(['metadata'], { type: 'text/csv' }),
    });

    render(<ExportButton slug="test-game" />);

    // Open dropdown
    const dropdownButton = screen.getByLabelText('Show export options');
    fireEvent.click(dropdownButton);

    // Click metadata option
    const metadataOption = screen.getByText('Metadata Only (CSV)');
    fireEvent.click(metadataOption);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('format=metadata-csv')
      );
    });
  });

  it('displays error message on export failure', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      json: async () => ({ error: 'Export failed' }),
    });

    render(<ExportButton slug="test-game" />);

    const exportButton = screen.getByText('Export CSV');
    fireEvent.click(exportButton);

    await waitFor(() => {
      expect(screen.getByText('Export failed')).toBeInTheDocument();
    });
  });

  it('displays success message after successful export', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      headers: new Map([['Content-Disposition', 'attachment; filename="test.csv"']]),
      blob: async () => new Blob(['test data'], { type: 'text/csv' }),
    });

    render(<ExportButton slug="test-game" />);

    const exportButton = screen.getByText('Export CSV');
    fireEvent.click(exportButton);

    await waitFor(() => {
      expect(screen.getByText(/downloaded successfully/i)).toBeInTheDocument();
    });
  });

  it('closes dropdown when clicking outside', () => {
    const { container } = render(<ExportButton slug="test-game" />);

    // Open dropdown
    const dropdownButton = screen.getByLabelText('Show export options');
    fireEvent.click(dropdownButton);

    expect(screen.getByText('Full Export (CSV)')).toBeInTheDocument();

    // Click outside (the backdrop - find by class since it doesn't have role)
    const backdrop = container.querySelector('.fixed.inset-0.z-40');
    if (backdrop) {
      fireEvent.click(backdrop);
    }

    expect(screen.queryByText('Full Export (CSV)')).not.toBeInTheDocument();
  });

  it('disables buttons during loading', async () => {
    (global.fetch as jest.Mock).mockImplementation(
      () =>
        new Promise((resolve) => {
          setTimeout(
            () =>
              resolve({
                ok: true,
                headers: new Map([['Content-Disposition', 'attachment; filename="test.csv"']]),
                blob: async () => new Blob(['test'], { type: 'text/csv' }),
              }),
            100
          );
        })
    );

    render(<ExportButton slug="test-game" />);

    const exportButton = screen.getByLabelText('Export game data as CSV');
    fireEvent.click(exportButton);

    // Buttons should be disabled during loading
    await waitFor(() => {
      expect(screen.getByText('Exporting...')).toBeInTheDocument();
    });

    expect(exportButton).toBeDisabled();
    expect(screen.getByLabelText('Show export options')).toBeDisabled();

    await waitFor(() => {
      expect(screen.queryByText('Exporting...')).not.toBeInTheDocument();
    });
  });

  it('applies custom className', () => {
    const { container } = render(<ExportButton slug="test-game" className="custom-class" />);

    expect(container.querySelector('.custom-class')).toBeInTheDocument();
  });

  it('renders with different variants', () => {
    const { rerender } = render(<ExportButton slug="test-game" variant="outline" />);
    const button = screen.getByLabelText('Export game data as CSV');
    expect(button).toHaveClass('border-2');

    rerender(<ExportButton slug="test-game" variant="ghost" />);
    expect(button).not.toHaveClass('border-2');
  });

  it('renders with different sizes', () => {
    const { rerender } = render(<ExportButton slug="test-game" size="sm" />);
    const button = screen.getByLabelText('Export game data as CSV');
    expect(button).toHaveClass('text-sm');

    rerender(<ExportButton slug="test-game" size="lg" />);
    expect(button).toHaveClass('text-lg');
  });

  it('extracts filename from Content-Disposition header', async () => {
    const createElementSpy = jest.spyOn(document, 'createElement');

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      headers: new Map([
        ['Content-Disposition', 'attachment; filename="my-custom-file.csv"'],
      ]),
      blob: async () => new Blob(['test data'], { type: 'text/csv' }),
    });

    render(<ExportButton slug="test-game" />);

    const exportButton = screen.getByText('Export CSV');
    fireEvent.click(exportButton);

    await waitFor(() => {
      const linkElement = createElementSpy.mock.results.find(
        (result) => result.value?.tagName === 'A'
      );
      expect(linkElement?.value).toHaveProperty('download', 'my-custom-file.csv');
    });

    createElementSpy.mockRestore();
  });

  it('uses default filename if Content-Disposition is missing', async () => {
    const createElementSpy = jest.spyOn(document, 'createElement');

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      headers: new Map(),
      blob: async () => new Blob(['test data'], { type: 'text/csv' }),
    });

    render(<ExportButton slug="my-game" />);

    const exportButton = screen.getByText('Export CSV');
    fireEvent.click(exportButton);

    await waitFor(() => {
      const linkElement = createElementSpy.mock.results.find(
        (result) => result.value?.tagName === 'A'
      );
      expect(linkElement?.value).toHaveProperty('download', 'my-game.csv');
    });

    createElementSpy.mockRestore();
  });
});
