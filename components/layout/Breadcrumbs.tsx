import Link from 'next/link';
import { CLEMSON_COLORS } from '@/lib/constants/colors';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumbs({ items, className = '' }: BreadcrumbsProps) {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <nav aria-label="Breadcrumb" className={`${className}`}>
      <ol className="flex flex-wrap items-center space-x-2 text-sm">
        {/* Home link */}
        <li className="flex items-center">
          <Link
            href="/"
            className="transition-colors hover:text-clemson-orange"
            style={{ color: CLEMSON_COLORS.dark }}
          >
            Home
          </Link>
        </li>

        {/* Breadcrumb items */}
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={index} className="flex items-center space-x-2">
              {/* Separator */}
              <svg
                className="h-4 w-4 flex-shrink-0 text-gray-400"
                fill="currentColor"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>

              {/* Breadcrumb link or text */}
              {isLast ? (
                <span
                  className="font-medium"
                  style={{ color: CLEMSON_COLORS.orange }}
                  aria-current="page"
                >
                  {item.label}
                </span>
              ) : item.href ? (
                <Link
                  href={item.href}
                  className="transition-colors hover:text-clemson-orange"
                  style={{ color: CLEMSON_COLORS.dark }}
                >
                  {item.label}
                </Link>
              ) : (
                <span style={{ color: CLEMSON_COLORS.dark }}>{item.label}</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
