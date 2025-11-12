/**
 * GSAP Animation Utilities
 * Reusable animation functions for consistent motion design across the application
 */

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Animation configuration types
 */
export interface FadeInUpOptions {
  duration?: number;
  delay?: number;
  y?: number;
  stagger?: number;
  ease?: string;
  start?: string;
  end?: string;
  toggleActions?: string;
  markers?: boolean;
}

export interface ScaleOnHoverOptions {
  scale?: number;
  duration?: number;
  ease?: string;
}

export interface FadeTransitionOptions {
  duration?: number;
  ease?: string;
  onComplete?: () => void;
}

export interface ProgressiveChartDrawOptions {
  duration?: number;
  delay?: number;
  ease?: string;
  stagger?: number;
  onComplete?: () => void;
}

/**
 * Fade in and slide up animation on scroll
 * Commonly used for revealing content as user scrolls
 *
 * @param target - CSS selector or element(s) to animate
 * @param options - Animation configuration options
 * @returns GSAP timeline or tween
 *
 * @example
 * fadeInUp('.stat-card', { duration: 0.5, y: 50 })
 */
export const fadeInUp = (
  target: gsap.TweenTarget,
  options: FadeInUpOptions = {}
) => {
  const {
    duration = 0.5,
    delay = 0,
    y = 30,
    stagger = 0.1,
    ease = "power2.out",
    start = "top 80%",
    end = "bottom 20%",
    toggleActions = "play none none reverse",
    markers = false,
  } = options;

  // Set initial state
  gsap.set(target, {
    opacity: 0,
    y: y,
  });

  // Create scroll-triggered animation
  return gsap.to(target, {
    opacity: 1,
    y: 0,
    duration,
    delay,
    stagger,
    ease,
    scrollTrigger: {
      trigger: target as gsap.DOMTarget,
      start,
      end,
      toggleActions,
      markers,
    },
  });
};

/**
 * Scale animation on hover
 * Used for interactive elements like cards and buttons
 *
 * @param target - CSS selector or element to animate
 * @param options - Animation configuration options
 * @returns Object with enter and leave animation functions
 *
 * @example
 * const hover = scaleOnHover('.stat-card', { scale: 1.05 })
 * element.addEventListener('mouseenter', hover.enter)
 * element.addEventListener('mouseleave', hover.leave)
 */
export const scaleOnHover = (
  target: gsap.TweenTarget,
  options: ScaleOnHoverOptions = {}
) => {
  const { scale = 1.05, duration = 0.2, ease = "power2.out" } = options;

  return {
    enter: () => {
      gsap.to(target, {
        scale,
        duration,
        ease,
      });
    },
    leave: () => {
      gsap.to(target, {
        scale: 1,
        duration,
        ease,
      });
    },
  };
};

/**
 * Fade transition for page/component transitions
 * Smooth fade out and fade in effect
 *
 * @param target - CSS selector or element to animate
 * @param options - Animation configuration options
 * @returns GSAP timeline
 *
 * @example
 * fadeTransition('.page-content', { duration: 0.3, onComplete: () => console.log('done') })
 */
export const fadeTransition = (
  target: gsap.TweenTarget,
  options: FadeTransitionOptions = {}
) => {
  const { duration = 0.3, ease = "power2.inOut", onComplete } = options;

  const timeline = gsap.timeline({ onComplete });

  timeline
    .to(target, {
      opacity: 0,
      duration: duration / 2,
      ease,
    })
    .to(target, {
      opacity: 1,
      duration: duration / 2,
      ease,
    });

  return timeline;
};

/**
 * Progressive chart drawing animation
 * Animates chart elements (bars, lines, areas) drawing in progressively
 *
 * @param target - CSS selector or element(s) representing chart elements
 * @param options - Animation configuration options
 * @returns GSAP timeline
 *
 * @example
 * progressiveChartDraw('.chart-bar', { duration: 1, stagger: 0.1 })
 */
export const progressiveChartDraw = (
  target: gsap.TweenTarget,
  options: ProgressiveChartDrawOptions = {}
) => {
  const {
    duration = 1,
    delay = 0,
    ease = "power2.out",
    stagger = 0.05,
    onComplete,
  } = options;

  const timeline = gsap.timeline({ delay, onComplete });

  // Set initial state (elements start at 0 scale/height)
  gsap.set(target, {
    scaleY: 0,
    transformOrigin: "bottom",
  });

  // Animate to full scale
  timeline.to(target, {
    scaleY: 1,
    duration,
    stagger,
    ease,
  });

  return timeline;
};

/**
 * Stagger fade in animation
 * Animates multiple elements with a stagger effect
 *
 * @param target - CSS selector or elements to animate
 * @param staggerAmount - Delay between each element (in seconds)
 * @param duration - Animation duration
 * @returns GSAP timeline
 *
 * @example
 * staggerFadeIn('.list-item', 0.1, 0.5)
 */
export const staggerFadeIn = (
  target: gsap.TweenTarget,
  staggerAmount = 0.1,
  duration = 0.5
) => {
  gsap.set(target, { opacity: 0, y: 20 });

  return gsap.to(target, {
    opacity: 1,
    y: 0,
    duration,
    stagger: staggerAmount,
    ease: "power2.out",
  });
};

/**
 * Slide in from side animation
 * Slides element in from left or right
 *
 * @param target - CSS selector or element to animate
 * @param direction - Direction to slide from ('left' or 'right')
 * @param duration - Animation duration
 * @returns GSAP tween
 *
 * @example
 * slideInFromSide('.sidebar', 'left', 0.5)
 */
export const slideInFromSide = (
  target: gsap.TweenTarget,
  direction: "left" | "right" = "left",
  duration = 0.5
) => {
  const xValue = direction === "left" ? -100 : 100;

  gsap.set(target, { x: xValue, opacity: 0 });

  return gsap.to(target, {
    x: 0,
    opacity: 1,
    duration,
    ease: "power2.out",
  });
};

/**
 * Number counter animation
 * Animates a number counting up from 0 to target value
 *
 * @param target - Element containing the number
 * @param endValue - Target number value
 * @param duration - Animation duration
 * @param decimals - Number of decimal places
 * @returns GSAP tween
 *
 * @example
 * animateNumber(element, 100, 2, 0)
 */
export const animateNumber = (
  target: Element,
  endValue: number,
  duration = 2,
  decimals = 0
) => {
  const obj = { value: 0 };

  return gsap.to(obj, {
    value: endValue,
    duration,
    ease: "power1.out",
    onUpdate: () => {
      if (target instanceof HTMLElement) {
        target.textContent = obj.value.toFixed(decimals);
      }
    },
  });
};

/**
 * Kill all GSAP animations and ScrollTriggers
 * Useful for cleanup when component unmounts
 *
 * @example
 * useEffect(() => {
 *   fadeInUp('.element')
 *   return () => killAllAnimations()
 * }, [])
 */
export const killAllAnimations = () => {
  gsap.killTweensOf("*");
  ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
};

/**
 * Refresh all ScrollTriggers
 * Useful after dynamic content changes
 *
 * @example
 * refreshScrollTriggers()
 */
export const refreshScrollTriggers = () => {
  ScrollTrigger.refresh();
};
