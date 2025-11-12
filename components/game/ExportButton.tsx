'use client';

/**
 * ExportButton Component
 *
 * Provides CSV export functionality for game statistics with:
 * - Multiple export format options (full, metadata, tables)
 * - Loading state during export
 * - Error handling with user feedback
 * - Dropdown menu for format selection
 */

import { useState, useEffect, useRef } from 'react';
import { Download, ChevronDown, FileText, Table, File } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ExportButtonProps {
  /**
   * Game slug to export
   */
  slug: string;
  /**
   * Optional className for styling
   */
  className?: string;
  /**
   * Button variant
   * @default 'default'
   */
  variant?: 'default' | 'outline' | 'ghost';
  /**
   * Button size
   * @default 'default'
   */
  size?: 'sm' | 'default' | 'lg';
}

type ExportFormat = 'csv' | 'metadata-csv' | 'tables-csv';

interface ExportOption {
  format: ExportFormat;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

const exportOptions: ExportOption[] = [
  {
    format: 'csv',
    label: 'Full Export (CSV)',
    description: 'Metadata + all statistics tables',
    icon: File,
  },
  {
    format: 'metadata-csv',
    label: 'Metadata Only (CSV)',
    description: 'Game info and scores only',
    icon: FileText,
  },
  {
    format: 'tables-csv',
    label: 'Tables Only (CSV)',
    description: 'Statistics tables only',
    icon: Table,
  },
];

/**
 * Downloads CSV file from the export API
 */
async function downloadCSV(slug: string, format: ExportFormat): Promise<void> {
  const params = new URLSearchParams({
    slug,
    format,
  });

  const response = await fetch(`/api/export?${params.toString()}`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to export data');
  }

  // Get filename from Content-Disposition header
  const contentDisposition = response.headers.get('Content-Disposition');
  let filename = `${slug}.csv`;
  if (contentDisposition) {
    const match = contentDisposition.match(/filename="(.+)"/);
    if (match) {
      filename = match[1];
    }
  }

  // Get CSV content
  const blob = await response.blob();

  // Create download link and trigger download
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();

  // Cleanup
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

/**
 * ExportButton Component
 */
export function ExportButton({
  slug,
  className,
  variant = 'default',
  size = 'default',
}: ExportButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  /**
   * Handle keyboard navigation for dropdown
   */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!showDropdown) return;

      // Close dropdown on Escape
      if (e.key === 'Escape') {
        e.preventDefault();
        setShowDropdown(false);
      }

      // Arrow key navigation
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        const dropdownButtons = dropdownRef.current?.querySelectorAll('button[data-dropdown-item]');
        if (!dropdownButtons || dropdownButtons.length === 0) return;

        const currentIndex = Array.from(dropdownButtons).findIndex(
          (btn) => btn === document.activeElement
        );

        let nextIndex: number;
        if (e.key === 'ArrowDown') {
          nextIndex = currentIndex < dropdownButtons.length - 1 ? currentIndex + 1 : 0;
        } else {
          nextIndex = currentIndex > 0 ? currentIndex - 1 : dropdownButtons.length - 1;
        }

        (dropdownButtons[nextIndex] as HTMLElement).focus();
      }
    };

    if (showDropdown) {
      document.addEventListener('keydown', handleKeyDown);
      // Focus first dropdown item when opened
      setTimeout(() => {
        const firstItem = dropdownRef.current?.querySelector('button[data-dropdown-item]') as HTMLElement;
        firstItem?.focus();
      }, 0);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [showDropdown]);

  /**
   * Handles export with specified format
   */
  const handleExport = async (format: ExportFormat, label: string) => {
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);
    setShowDropdown(false);

    try {
      await downloadCSV(slug, format);
      setSuccessMessage(`${label} downloaded successfully!`);

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Export failed';
      setError(errorMessage);

      // Clear error after 5 seconds
      setTimeout(() => {
        setError(null);
      }, 5000);
    } finally {
      setIsLoading(false);
    }
  };

  // Button size classes
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    default: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  // Button variant classes
  const variantClasses = {
    default:
      'bg-clemson-orange text-white hover:bg-clemson-orange/90 focus:ring-clemson-orange/50',
    outline:
      'border-2 border-clemson-orange text-clemson-orange hover:bg-clemson-orange/10 focus:ring-clemson-orange/50',
    ghost: 'text-clemson-orange hover:bg-clemson-orange/10 focus:ring-clemson-orange/50',
  };

  return (
    <div className={cn('relative', className)}>
      {/* Main Export Button */}
      <div className="flex gap-1">
        {/* Single-action button (default export) */}
        <button
          onClick={() => handleExport('csv', 'Full Export')}
          disabled={isLoading}
          className={cn(
            'inline-flex items-center gap-2 font-semibold rounded-lg transition-all',
            'focus:outline-none focus:ring-2 focus:ring-offset-2',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            sizeClasses[size],
            variantClasses[variant]
          )}
          aria-label="Export game data as CSV"
        >
          {isLoading ? (
            <>
              <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
              <span>Exporting...</span>
            </>
          ) : (
            <>
              <Download className="h-4 w-4" />
              <span>Export CSV</span>
            </>
          )}
        </button>

        {/* Dropdown trigger */}
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          disabled={isLoading}
          className={cn(
            'inline-flex items-center justify-center rounded-lg transition-all',
            'focus:outline-none focus:ring-2 focus:ring-offset-2',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            sizeClasses[size],
            variantClasses[variant],
            'px-2'
          )}
          aria-label="Show export options"
          aria-expanded={showDropdown}
        >
          <ChevronDown
            className={cn('h-4 w-4 transition-transform', showDropdown && 'rotate-180')}
          />
        </button>
      </div>

      {/* Dropdown Menu */}
      {showDropdown && (
        <div
          ref={dropdownRef}
          className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
          role="menu"
          aria-label="Export format options"
        >
          <div className="py-2">
            <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase">
              Export Options
            </div>
            {exportOptions.map((option) => {
              const Icon = option.icon;
              return (
                <button
                  key={option.format}
                  onClick={() => handleExport(option.format, option.label)}
                  disabled={isLoading}
                  data-dropdown-item
                  role="menuitem"
                  className={cn(
                    'w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors',
                    'disabled:opacity-50 disabled:cursor-not-allowed',
                    'flex items-start gap-3',
                    'focus:outline-none focus:bg-gray-100 focus:ring-2 focus:ring-inset focus:ring-clemson-orange'
                  )}
                >
                  <Icon className="h-5 w-5 text-clemson-orange mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-gray-900">{option.label}</div>
                    <div className="text-sm text-gray-500">{option.description}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Click outside to close dropdown */}
      {showDropdown && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowDropdown(false)}
          aria-hidden="true"
        />
      )}

      {/* Success Message */}
      {successMessage && (
        <div className="absolute top-full left-0 right-0 mt-2 p-3 bg-green-50 border border-green-200 rounded-lg text-green-800 text-sm flex items-center gap-2 z-50">
          <svg
            className="h-5 w-5 text-green-600"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M5 13l4 4L19 7" />
          </svg>
          <span>{successMessage}</span>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="absolute top-full left-0 right-0 mt-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm flex items-center gap-2 z-50">
          <svg
            className="h-5 w-5 text-red-600"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M6 18L18 6M6 6l12 12" />
          </svg>
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
