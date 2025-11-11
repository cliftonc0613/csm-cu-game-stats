'use client';

import Link from 'next/link';
import { useState } from 'react';
import { CLEMSON_COLORS } from '@/lib/constants/colors';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo and Branding */}
        <Link href="/" className="flex items-center space-x-3" onClick={closeMobileMenu}>
          <div
            className="flex h-10 w-10 items-center justify-center rounded-full font-bold text-white"
            style={{ backgroundColor: CLEMSON_COLORS.orange }}
          >
            CS
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold leading-tight" style={{ color: CLEMSON_COLORS.orange }}>
              Clemson Sports
            </span>
            <span className="text-xs text-gray-600">Statistics</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center space-x-6 md:flex">
          <Link
            href="/"
            className="text-sm font-medium transition-colors hover:text-clemson-orange"
          >
            Home
          </Link>
          <Link
            href="/games"
            className="text-sm font-medium transition-colors hover:text-clemson-orange"
          >
            Games
          </Link>
          <Link
            href="/about"
            className="text-sm font-medium transition-colors hover:text-clemson-orange"
          >
            About
          </Link>
          <a
            href="https://clemsonsportsmedia.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md px-4 py-2 text-sm font-medium text-white transition-colors hover:opacity-90"
            style={{ backgroundColor: CLEMSON_COLORS.purple }}
          >
            Clemson Sports Media
          </a>
        </nav>

        {/* Mobile Menu Button */}
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-md p-2 text-gray-700 transition-colors hover:bg-gray-100 md:hidden"
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
          aria-expanded={mobileMenuOpen}
        >
          {/* Hamburger Icon */}
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            aria-hidden="true"
          >
            {mobileMenuOpen ? (
              // X icon when menu is open
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              // Hamburger icon when menu is closed
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="border-t bg-white md:hidden">
          <nav className="container mx-auto flex flex-col space-y-1 px-4 py-4">
            <Link
              href="/"
              className="rounded-md px-4 py-3 text-sm font-medium transition-colors hover:bg-gray-100"
              onClick={closeMobileMenu}
            >
              Home
            </Link>
            <Link
              href="/games"
              className="rounded-md px-4 py-3 text-sm font-medium transition-colors hover:bg-gray-100"
              onClick={closeMobileMenu}
            >
              Games
            </Link>
            <Link
              href="/about"
              className="rounded-md px-4 py-3 text-sm font-medium transition-colors hover:bg-gray-100"
              onClick={closeMobileMenu}
            >
              About
            </Link>
            <a
              href="https://clemsonsportsmedia.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md px-4 py-3 text-center text-sm font-medium text-white transition-colors hover:opacity-90"
              style={{ backgroundColor: CLEMSON_COLORS.purple }}
              onClick={closeMobileMenu}
            >
              Clemson Sports Media
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
