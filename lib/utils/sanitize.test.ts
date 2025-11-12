/**
 * Unit tests for HTML sanitization utilities
 */

import { describe, it, expect } from '@jest/globals';
import { sanitizeHtml, sanitizeHtmlStrict, stripHtml } from './sanitize';

describe('sanitizeHtml', () => {
  it('should allow safe markdown elements', () => {
    const html = '<p>This is <strong>bold</strong> and <em>italic</em> text.</p>';
    const result = sanitizeHtml(html);

    expect(result).toContain('<p>');
    expect(result).toContain('<strong>');
    expect(result).toContain('<em>');
  });

  it('should allow headings', () => {
    const html = '<h1>Heading 1</h1><h2>Heading 2</h2><h3>Heading 3</h3>';
    const result = sanitizeHtml(html);

    expect(result).toContain('<h1>');
    expect(result).toContain('<h2>');
    expect(result).toContain('<h3>');
  });

  it('should allow lists', () => {
    const html = '<ul><li>Item 1</li><li>Item 2</li></ul>';
    const result = sanitizeHtml(html);

    expect(result).toContain('<ul>');
    expect(result).toContain('<li>');
  });

  it('should allow tables for game statistics', () => {
    const html = '<table><thead><tr><th>Player</th><th>Score</th></tr></thead><tbody><tr><td>John</td><td>42</td></tr></tbody></table>';
    const result = sanitizeHtml(html);

    expect(result).toContain('<table>');
    expect(result).toContain('<thead>');
    expect(result).toContain('<tbody>');
    expect(result).toContain('<th>');
    expect(result).toContain('<td>');
  });

  it('should allow links with safe attributes', () => {
    const html = '<a href="https://example.com" target="_blank" rel="noopener">Link</a>';
    const result = sanitizeHtml(html);

    expect(result).toContain('<a');
    expect(result).toContain('href="https://example.com"');
  });

  it('should remove script tags', () => {
    const html = '<p>Safe</p><script>alert("XSS")</script>';
    const result = sanitizeHtml(html);

    expect(result).toContain('<p>Safe</p>');
    expect(result).not.toContain('<script>');
    expect(result).not.toContain('alert');
  });

  it('should remove onclick and other event handlers', () => {
    const html = '<p onclick="alert(\'XSS\')">Click me</p>';
    const result = sanitizeHtml(html);

    expect(result).toContain('Click me');
    expect(result).not.toContain('onclick');
    expect(result).not.toContain('alert');
  });

  it('should allow images with safe attributes', () => {
    const html = '<img src="https://example.com/image.png" alt="Test" width="100" height="100" />';
    const result = sanitizeHtml(html);

    expect(result).toContain('<img');
    expect(result).toContain('src="https://example.com/image.png"');
    expect(result).toContain('alt="Test"');
  });

  it('should handle empty strings', () => {
    const result = sanitizeHtml('');
    expect(result).toBe('');
  });

  it('should handle plain text without HTML', () => {
    const text = 'This is plain text';
    const result = sanitizeHtml(text);
    expect(result).toBe('This is plain text');
  });
});

describe('sanitizeHtmlStrict', () => {
  it('should only allow basic formatting tags', () => {
    const html = '<p>This is <strong>bold</strong> and <em>italic</em> text.</p>';
    const result = sanitizeHtmlStrict(html);

    expect(result).toContain('<p>');
    expect(result).toContain('<strong>');
    expect(result).toContain('<em>');
  });

  it('should remove tables in strict mode', () => {
    const html = '<table><tr><td>Data</td></tr></table>';
    const result = sanitizeHtmlStrict(html);

    expect(result).not.toContain('<table>');
    expect(result).not.toContain('<tr>');
    expect(result).not.toContain('<td>');
  });

  it('should remove headings in strict mode', () => {
    const html = '<h1>Heading</h1><p>Text</p>';
    const result = sanitizeHtmlStrict(html);

    expect(result).not.toContain('<h1>');
    expect(result).toContain('<p>');
  });

  it('should remove script tags', () => {
    const html = '<p>Safe</p><script>alert("XSS")</script>';
    const result = sanitizeHtmlStrict(html);

    expect(result).toContain('<p>Safe</p>');
    expect(result).not.toContain('<script>');
  });

  it('should allow safe links', () => {
    const html = '<a href="https://example.com">Link</a>';
    const result = sanitizeHtmlStrict(html);

    expect(result).toContain('<a');
    expect(result).toContain('href="https://example.com"');
  });

  it('should handle empty strings', () => {
    const result = sanitizeHtmlStrict('');
    expect(result).toBe('');
  });
});

describe('stripHtml', () => {
  it('should remove all HTML tags', () => {
    const html = '<p>This is <strong>bold</strong> text.</p>';
    const result = stripHtml(html);

    expect(result).toBe('This is bold text.');
    expect(result).not.toContain('<');
    expect(result).not.toContain('>');
  });

  it('should remove complex HTML structures', () => {
    const html = '<div><h1>Title</h1><p>Paragraph with <a href="#">link</a></p></div>';
    const result = stripHtml(html);

    expect(result).toBe('TitleParagraph with link');
    expect(result).not.toContain('<');
  });

  it('should remove script tags and content', () => {
    const html = '<p>Safe</p><script>alert("XSS")</script>';
    const result = stripHtml(html);

    expect(result).not.toContain('<script>');
    expect(result).not.toContain('alert');
  });

  it('should handle empty strings', () => {
    const result = stripHtml('');
    expect(result).toBe('');
  });

  it('should handle plain text without HTML', () => {
    const text = 'Plain text';
    const result = stripHtml(text);
    expect(result).toBe('Plain text');
  });

  it('should handle nested tags', () => {
    const html = '<div><ul><li><strong>Item</strong></li></ul></div>';
    const result = stripHtml(html);
    expect(result).toBe('Item');
  });
});
