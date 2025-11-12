/**
 * Unit tests for cn utility functions
 */

import { describe, it, expect } from '@jest/globals';
import { cn, clemsonTheme } from './cn';

describe('cn', () => {
  it('should merge class names', () => {
    const result = cn('foo', 'bar');
    expect(result).toContain('foo');
    expect(result).toContain('bar');
  });

  it('should handle conditional classes', () => {
    const result = cn('foo', false && 'bar', 'baz');
    expect(result).toContain('foo');
    expect(result).not.toContain('bar');
    expect(result).toContain('baz');
  });

  it('should merge tailwind conflicting classes correctly', () => {
    const result = cn('p-4', 'p-8');
    expect(result).toContain('p-8');
    expect(result).not.toContain('p-4');
  });

  it('should handle undefined and null values', () => {
    const result = cn('foo', undefined, null, 'bar');
    expect(result).toContain('foo');
    expect(result).toContain('bar');
  });

  it('should handle empty strings', () => {
    const result = cn('foo', '', 'bar');
    expect(result).toContain('foo');
    expect(result).toContain('bar');
  });

  it('should handle arrays of classes', () => {
    const result = cn(['foo', 'bar'], 'baz');
    expect(result).toContain('foo');
    expect(result).toContain('bar');
    expect(result).toContain('baz');
  });

  it('should handle object syntax for conditional classes', () => {
    const result = cn({ foo: true, bar: false, baz: true });
    expect(result).toContain('foo');
    expect(result).not.toContain('bar');
    expect(result).toContain('baz');
  });
});

describe('clemsonTheme', () => {
  it('should have orange background helper', () => {
    const result = clemsonTheme.bg.orange();
    expect(result).toBe('bg-clemson-orange');
  });

  it('should have purple background helper', () => {
    const result = clemsonTheme.bg.purple();
    expect(result).toBe('bg-clemson-purple');
  });

  it('should have dark background helper', () => {
    const result = clemsonTheme.bg.dark();
    expect(result).toBe('bg-clemson-dark');
  });

  it('should have orange text helper', () => {
    const result = clemsonTheme.text.orange();
    expect(result).toBe('text-clemson-orange');
  });

  it('should have purple text helper', () => {
    const result = clemsonTheme.text.purple();
    expect(result).toBe('text-clemson-purple');
  });

  it('should have dark text helper', () => {
    const result = clemsonTheme.text.dark();
    expect(result).toBe('text-clemson-dark');
  });

  it('should have orange border helper', () => {
    const result = clemsonTheme.border.orange();
    expect(result).toBe('border-clemson-orange');
  });

  it('should have purple border helper', () => {
    const result = clemsonTheme.border.purple();
    expect(result).toBe('border-clemson-purple');
  });

  it('should have dark border helper', () => {
    const result = clemsonTheme.border.dark();
    expect(result).toBe('border-clemson-dark');
  });

  it('should have gradient helper', () => {
    const result = clemsonTheme.gradient();
    expect(result).toContain('bg-gradient-to-r');
    expect(result).toContain('from-clemson-orange');
    expect(result).toContain('to-clemson-purple');
  });
});
