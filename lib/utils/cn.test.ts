/**
 * Unit tests for cn utility functions
 */

import { describe, it, expect } from '@jest/globals';
import { cn, clemsonColor, statCardColors, responsive, focusRing } from './cn';

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
    expect(result).toBe('p-8');
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

describe('clemsonColor', () => {
  it('should return orange background class', () => {
    const result = clemsonColor('orange', 'bg');
    expect(result).toBe('bg-clemson-orange');
  });

  it('should return purple background class', () => {
    const result = clemsonColor('purple', 'bg');
    expect(result).toBe('bg-clemson-purple');
  });

  it('should return dark background class', () => {
    const result = clemsonColor('dark', 'bg');
    expect(result).toBe('bg-clemson-dark');
  });

  it('should return white background class', () => {
    const result = clemsonColor('white', 'bg');
    expect(result).toBe('bg-white');
  });

  it('should return orange text class', () => {
    const result = clemsonColor('orange', 'text');
    expect(result).toBe('text-clemson-orange');
  });

  it('should return purple text class', () => {
    const result = clemsonColor('purple', 'text');
    expect(result).toBe('text-clemson-purple');
  });

  it('should return dark text class', () => {
    const result = clemsonColor('dark', 'text');
    expect(result).toBe('text-clemson-dark');
  });

  it('should return orange border class', () => {
    const result = clemsonColor('orange', 'border');
    expect(result).toBe('border-clemson-orange');
  });

  it('should return purple border class', () => {
    const result = clemsonColor('purple', 'border');
    expect(result).toBe('border-clemson-purple');
  });

  it('should default to bg type', () => {
    const result = clemsonColor('orange');
    expect(result).toBe('bg-clemson-orange');
  });
});

describe('statCardColors', () => {
  it('should return orange for even indices', () => {
    const result = statCardColors(0);
    expect(result.bg).toBe('bg-clemson-orange');
    expect(result.text).toBe('text-white');
  });

  it('should return purple for odd indices', () => {
    const result = statCardColors(1);
    expect(result.bg).toBe('bg-clemson-purple');
    expect(result.text).toBe('text-white');
  });

  it('should alternate colors correctly', () => {
    expect(statCardColors(0).bg).toBe('bg-clemson-orange');
    expect(statCardColors(1).bg).toBe('bg-clemson-purple');
    expect(statCardColors(2).bg).toBe('bg-clemson-orange');
    expect(statCardColors(3).bg).toBe('bg-clemson-purple');
  });
});

describe('responsive', () => {
  it('should handle base classes only', () => {
    const result = responsive('text-lg');
    expect(result).toContain('text-lg');
  });

  it('should add responsive breakpoint classes', () => {
    const result = responsive('text-base', 'text-lg', 'text-xl');
    expect(result).toContain('text-base');
    expect(result).toContain('sm:text-lg');
    expect(result).toContain('md:text-xl');
  });

  it('should handle all breakpoints', () => {
    const result = responsive('p-2', 'p-4', 'p-6', 'p-8', 'p-10');
    expect(result).toContain('p-2');
    expect(result).toContain('sm:p-4');
    expect(result).toContain('md:p-6');
    expect(result).toContain('lg:p-8');
    expect(result).toContain('xl:p-10');
  });

  it('should handle missing breakpoints', () => {
    const result = responsive('p-2', undefined, 'p-6');
    expect(result).toContain('p-2');
    expect(result).not.toContain('sm:');
    expect(result).toContain('md:p-6');
  });
});

describe('focusRing', () => {
  it('should return focus ring classes', () => {
    const result = focusRing();
    expect(result).toContain('focus:outline-none');
    expect(result).toContain('focus:ring-2');
    expect(result).toContain('focus:ring-clemson-orange');
    expect(result).toContain('focus:ring-offset-2');
  });

  it('should merge additional classes', () => {
    const result = focusRing('rounded-md');
    expect(result).toContain('focus:outline-none');
    expect(result).toContain('rounded-md');
  });

  it('should handle multiple additional classes', () => {
    const result = focusRing('rounded-md px-4 py-2');
    expect(result).toContain('focus:ring-clemson-orange');
    expect(result).toContain('rounded-md');
    expect(result).toContain('px-4');
    expect(result).toContain('py-2');
  });
});

