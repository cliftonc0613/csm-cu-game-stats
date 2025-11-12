/**
 * Unit tests for GSAP animation utilities
 */

import { describe, it, expect } from '@jest/globals';
import {
  fadeInUp,
  scaleOnHover,
  fadeTransition,
  progressiveChartDraw,
  staggerFadeIn,
  slideInFromSide,
  animateNumber,
  killAllAnimations,
  refreshScrollTriggers,
} from './animations';

// Note: GSAP is mocked in jest.setup.js

describe('Animation Utilities', () => {
  describe('fadeInUp', () => {
    it('should execute without errors', () => {
      const element = document.createElement('div');
      expect(() => fadeInUp(element)).not.toThrow();
    });

    it('should accept custom options', () => {
      const element = document.createElement('div');
      expect(() => fadeInUp(element, { duration: 1.5, delay: 0.5, y: 50 })).not.toThrow();
    });

    it('should work with multiple elements', () => {
      const elements = [document.createElement('div'), document.createElement('div')];
      expect(() => fadeInUp(elements)).not.toThrow();
    });
  });

  describe('scaleOnHover', () => {
    it('should be a function', () => {
      expect(typeof scaleOnHover).toBe('function');
    });

    it('should execute without errors', () => {
      const element = document.createElement('div');
      expect(() => scaleOnHover(element)).not.toThrow();
    });

    it('should accept custom scale values', () => {
      const element = document.createElement('div');
      expect(() => scaleOnHover(element, { scale: 1.1, duration: 0.3 })).not.toThrow();
    });
  });

  describe('fadeTransition', () => {
    it('should execute without errors', () => {
      const element = document.createElement('div');
      expect(() => fadeTransition(element)).not.toThrow();
    });

    it('should accept custom duration and ease', () => {
      const element = document.createElement('div');
      expect(() => fadeTransition(element, { duration: 0.5, ease: 'power3.inOut' })).not.toThrow();
    });
  });

  describe('progressiveChartDraw', () => {
    it('should execute without errors', () => {
      const element = document.createElement('div');
      expect(() => progressiveChartDraw(element)).not.toThrow();
    });

    it('should accept custom options', () => {
      const element = document.createElement('div');
      expect(() => progressiveChartDraw(element, { duration: 2, delay: 0.3 })).not.toThrow();
    });
  });

  describe('staggerFadeIn', () => {
    it('should execute without errors', () => {
      const elements = [
        document.createElement('div'),
        document.createElement('div'),
        document.createElement('div'),
      ];
      expect(() => staggerFadeIn(elements)).not.toThrow();
    });

    it('should accept custom stagger and duration', () => {
      const elements = [document.createElement('div')];
      expect(() => staggerFadeIn(elements, { stagger: 0.2, duration: 0.8 })).not.toThrow();
    });
  });

  describe('slideInFromSide', () => {
    it('should execute without errors', () => {
      const element = document.createElement('div');
      expect(() => slideInFromSide(element)).not.toThrow();
    });

    it('should accept left direction', () => {
      const element = document.createElement('div');
      expect(() => slideInFromSide(element, { direction: 'left', distance: 100 })).not.toThrow();
    });

    it('should accept right direction', () => {
      const element = document.createElement('div');
      expect(() => slideInFromSide(element, { direction: 'right', distance: 100 })).not.toThrow();
    });
  });

  describe('animateNumber', () => {
    it('should execute without errors', () => {
      const element = document.createElement('div');
      expect(() => animateNumber(element, 0, 100)).not.toThrow();
    });

    it('should accept custom options', () => {
      const element = document.createElement('div');
      expect(() => animateNumber(element, 0, 500, { duration: 2, ease: 'power2.out' })).not.toThrow();
    });

    it('should handle decimals option', () => {
      const element = document.createElement('div');
      expect(() => animateNumber(element, 0, 99.99, { decimals: 2 })).not.toThrow();
    });
  });

  describe('killAllAnimations', () => {
    it('should be a function', () => {
      expect(typeof killAllAnimations).toBe('function');
    });

    it('should not throw when called', () => {
      expect(() => killAllAnimations()).not.toThrow();
    });
  });

  describe('refreshScrollTriggers', () => {
    it('should be a function', () => {
      expect(typeof refreshScrollTriggers).toBe('function');
    });

    it('should not throw when called', () => {
      expect(() => refreshScrollTriggers()).not.toThrow();
    });
  });
});
