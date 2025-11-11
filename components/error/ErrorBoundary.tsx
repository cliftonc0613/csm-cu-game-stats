'use client';

import React, { Component, ReactNode } from 'react';
import { CLEMSON_COLORS } from '@/lib/constants/colors';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error Boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex min-h-[60vh] items-center justify-center p-4">
          <div className="max-w-md text-center">
            <div
              className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full"
              style={{ backgroundColor: CLEMSON_COLORS.purple }}
            >
              <svg
                className="h-10 w-10 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h2 className="mb-2 text-2xl font-bold" style={{ color: CLEMSON_COLORS.dark }}>
              Something went wrong
            </h2>
            <p className="mb-6 text-gray-600">
              We encountered an unexpected error while loading this content. Please try refreshing the page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="rounded-md px-6 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: CLEMSON_COLORS.orange }}
            >
              Refresh Page
            </button>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-6 text-left">
                <summary className="cursor-pointer text-sm font-medium text-gray-700">
                  Error Details (Development Only)
                </summary>
                <pre className="mt-2 overflow-auto rounded bg-gray-100 p-4 text-xs text-red-600">
                  {this.state.error.toString()}
                  {this.state.error.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
