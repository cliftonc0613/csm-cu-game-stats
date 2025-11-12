'use client';

import { useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import gsap from 'gsap';

export interface PageTransitionProps {
  /**
   * Children to render with transition
   */
  children: React.ReactNode;
  /**
   * Transition duration in seconds
   * @default 0.3
   */
  duration?: number;
  /**
   * Easing function
   * @default 'power2.inOut'
   */
  ease?: string;
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * PageTransition Component
 *
 * Provides smooth fade transitions between route changes
 * Uses GSAP for animations and Next.js usePathname for route detection
 *
 * @example
 * <PageTransition>
 *   <YourPageContent />
 * </PageTransition>
 */
export function PageTransition({
  children,
  duration = 0.3,
  ease = 'power2.inOut',
  className = '',
}: PageTransitionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Animate on pathname change
  useEffect(() => {
    if (containerRef.current) {
      // Fade in animation when route changes
      gsap.fromTo(
        containerRef.current,
        {
          opacity: 0,
          y: 10,
        },
        {
          opacity: 1,
          y: 0,
          duration,
          ease,
        }
      );
    }
  }, [pathname, duration, ease]);

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
}

/**
 * Alternative: Crossfade transition
 * More pronounced transition effect with fade out then fade in
 */
export function PageTransitionCrossfade({
  children,
  duration = 0.4,
  ease = 'power2.inOut',
  className = '',
}: PageTransitionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const prevPathname = useRef(pathname);

  useEffect(() => {
    if (containerRef.current && prevPathname.current !== pathname) {
      const element = containerRef.current;

      // Create timeline for crossfade
      const timeline = gsap.timeline();

      timeline
        .to(element, {
          opacity: 0,
          duration: duration / 2,
          ease,
        })
        .set(element, {
          // Reset any scroll position
          scrollTop: 0,
        })
        .to(element, {
          opacity: 1,
          duration: duration / 2,
          ease,
        });

      prevPathname.current = pathname;
    }
  }, [pathname, duration, ease]);

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
}

/**
 * Alternative: Slide transition
 * Slides content in from the side on route change
 */
export function PageTransitionSlide({
  children,
  duration = 0.4,
  direction = 'right',
  ease = 'power2.out',
  className = '',
}: PageTransitionProps & { direction?: 'left' | 'right' }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (containerRef.current) {
      const xValue = direction === 'left' ? -30 : 30;

      gsap.fromTo(
        containerRef.current,
        {
          opacity: 0,
          x: xValue,
        },
        {
          opacity: 1,
          x: 0,
          duration,
          ease,
        }
      );
    }
  }, [pathname, duration, direction, ease]);

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
}
