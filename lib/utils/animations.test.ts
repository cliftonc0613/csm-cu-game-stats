/**
 * Unit tests for GSAP animation utilities
 */

import { describe, it, expect, jest, beforeEach } from '@jest/globals';
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
import gsap from 'gsap';

// Note: GSAP is mocked in jest.setup.js

describe('Animation Utilities', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('fadeInUp', () => {
    it('should call gsap.set and gsap.to', () => {
      const element = document.createElement('div');
      fadeInUp(element);

      expect(gsap.set).toHaveBeenCalled();
      expect(gsap.to).toHaveBeenCalled();
    });

    it('should accept custom options', () => {
      const element = document.createElement('div');
      fadeInUp(element, { duration: 1.5, delay: 0.5, y: 50 });

      expect(gsap.to).toHaveBeenCalled();
    });

    it('should work with multiple elements', () => {
      const elements = [document.createElement('div'), document.createElement('div')];
      fadeInUp(elements);

      expect(gsap.to).toHaveBeenCalled();
    });
  });

  describe('scaleOnHover', () => {
    it('should return gsap timeline', () => {
      const element = document.createElement('div');
      const result = scaleOnHover(element);

      expect(gsap.timeline).toHaveBeenCalled();
    });

    it('should accept custom scale values', () => {
      const element = document.createElement('div');
      scaleOnHover(element, { scale: 1.1, duration: 0.3 });

      expect(gsap.timeline).toHaveBeenCalled();
    });
  });

  describe('fadeTransition', () => {
    it('should call gsap.fromTo', () => {
      const element = document.createElement('div');
      fadeTransition(element);

      expect(gsap.fromTo).toHaveBeenCalled();
    });

    it('should accept custom duration and ease', () => {
      const element = document.createElement('div');
      fadeTransition(element, { duration: 0.5, ease: 'power3.inOut' });

      expect(gsap.fromTo).toHaveBeenCalled();
    });
  });

  describe('progressiveChartDraw', () => {
    it('should call gsap.from', () => {
      const element = document.createElement('div');
      progressiveChartDraw(element);

      expect(gsap.from).toHaveBeenCalled();
    });

    it('should accept custom options', () => {
      const element = document.createElement('div');
      progressiveChartDraw(element, { duration: 2, delay: 0.3 });

      expect(gsap.from).toHaveBeenCalled();
    });
  });

  describe('staggerFadeIn', () => {
    it('should call gsap.fromTo for multiple elements', () => {
      const elements = [
        document.createElement('div'),
        document.createElement('div'),
        document.createElement('div'),
      ];
      staggerFadeIn(elements);

      expect(gsap.fromTo).toHaveBeenCalled();
    });

    it('should accept custom stagger and duration', () => {
      const elements = [document.createElement('div')];
      staggerFadeIn(elements, { stagger: 0.2, duration: 0.8 });

      expect(gsap.fromTo).toHaveBeenCalled();
    });
  });

  describe('slideInFromSide', () => {
    it('should call gsap.from', () => {
      const element = document.createElement('div');
      slideInFromSide(element);

      expect(gsap.from).toHaveBeenCalled();
    });

    it('should accept left direction', () => {
      const element = document.createElement('div');
      slideInFromSide(element, { direction: 'left', distance: 100 });

      expect(gsap.from).toHaveBeenCalled();
    });

    it('should accept right direction', () => {
      const element = document.createElement('div');
      slideInFromSide(element, { direction: 'right', distance: 100 });

      expect(gsap.from).toHaveBeenCalled();
    });
  });

  describe('animateNumber', () => {
    it('should call gsap.to', () => {
      const element = document.createElement('div');
      animateNumber(element, 0, 100);

      expect(gsap.to).toHaveBeenCalled();
    });

    it('should accept custom options', () => {
      const element = document.createElement('div');
      animateNumber(element, 0, 500, { duration: 2, ease: 'power2.out' });

      expect(gsap.to).toHaveBeenCalled();
    });

    it('should handle decimals option', () => {
      const element = document.createElement('div');
      animateNumber(element, 0, 99.99, { decimals: 2 });

      expect(gsap.to).toHaveBeenCalled();
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
