/**
 * HTML sanitization utilities for markdown content
 * Uses sanitize-html to prevent XSS attacks while preserving safe HTML elements
 */

import sanitizeHtmlLib from 'sanitize-html';

/**
 * Sanitization options for markdown-generated HTML
 * Allows common markdown elements and game statistics tables
 */
const sanitizeOptions: sanitizeHtmlLib.IOptions = {
  // Allow these HTML tags
  allowedTags: [
    // Text formatting
    'p',
    'br',
    'strong',
    'em',
    'u',
    'del',
    'strike',
    'code',
    'pre',
    // Headings
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    // Lists
    'ul',
    'ol',
    'li',
    // Tables (critical for game statistics)
    'table',
    'thead',
    'tbody',
    'tfoot',
    'tr',
    'th',
    'td',
    // Links and quotes
    'a',
    'blockquote',
    // Divs and spans for styling
    'div',
    'span',
    // Images (for team logos if embedded in markdown)
    'img',
  ],

  // Allow these attributes on specific tags
  allowedAttributes: {
    a: ['href', 'name', 'target', 'rel'],
    img: ['src', 'alt', 'title', 'width', 'height'],
    // Allow class attributes for styling
    '*': ['class', 'id'],
    // Table attributes for alignment
    td: ['colspan', 'rowspan', 'align'],
    th: ['colspan', 'rowspan', 'align', 'scope'],
  },

  // URL schemes allowed in href and src
  allowedSchemes: ['http', 'https', 'mailto', 'tel'],

  // Allow data URIs for inline images (if needed)
  allowedSchemesByTag: {
    img: ['http', 'https', 'data'],
  },

  // Don't allow iframe or script tags under any circumstances
  disallowedTagsMode: 'discard',

  // Allow class names that match our Tailwind patterns
  allowedClasses: {
    '*': [/^prose.*/, /^text-.*/, /^bg-.*/, /^border.*/, /^p-.*/, /^m-.*/, /^flex.*/, /^grid.*/],
  },
};

/**
 * Sanitize HTML content to prevent XSS attacks
 * Configured specifically for markdown-generated game statistics
 *
 * @param html - Raw HTML string to sanitize
 * @returns Sanitized HTML safe for rendering
 */
export function sanitizeHtml(html: string): string {
  return sanitizeHtmlLib(html, sanitizeOptions);
}

/**
 * Strict sanitization for user-generated content
 * Use this for content that comes from untrusted sources
 *
 * @param html - Raw HTML string to sanitize
 * @returns Strictly sanitized HTML
 */
export function sanitizeHtmlStrict(html: string): string {
  return sanitizeHtmlLib(html, {
    allowedTags: ['p', 'br', 'strong', 'em', 'u', 'a'],
    allowedAttributes: {
      a: ['href', 'rel'],
    },
    allowedSchemes: ['http', 'https'],
  });
}

/**
 * Remove all HTML tags from a string
 * Useful for generating plain text excerpts
 *
 * @param html - HTML string
 * @returns Plain text with all HTML removed
 */
export function stripHtml(html: string): string {
  return sanitizeHtmlLib(html, {
    allowedTags: [],
    allowedAttributes: {},
  });
}
