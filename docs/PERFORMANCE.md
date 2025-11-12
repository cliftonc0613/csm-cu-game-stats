# Performance Optimization & Testing Guide

This document outlines the performance optimizations implemented in the Clemson Sports Statistics website and provides instructions for running performance audits.

## Performance Targets

Based on Task 8.8 requirements:

- **Performance Score**: > 90 (Lighthouse)
- **Page Load Time**: < 2 seconds
- **Core Web Vitals**:
  - LCP (Largest Contentful Paint): < 2.5s
  - FID (First Input Delay): < 100ms
  - CLS (Cumulative Layout Shift): < 0.1

## Implemented Optimizations

### 1. Image Optimization

✅ **Next.js Image Component**
- AVIF and WebP format support for modern browsers
- Automatic responsive image sizing
- Lazy loading by default for off-screen images
- Priority loading option for above-the-fold images
- Device-specific image sizes: `[640, 750, 828, 1080, 1200, 1920, 2048, 3840]`
- Image sizes for breakpoints: `[16, 32, 48, 64, 96, 128, 256, 384]`

**Files**: `next.config.ts`, `components/ui/TeamLogo.tsx`

### 2. Code Splitting

✅ **Dynamic Imports**
- `HistoricalChartLazy.tsx` - Lazy loads Recharts library (reduces initial bundle by ~100KB)
- Route-based code splitting (Next.js default)
- Loading states for better UX during code splitting

✅ **Optimized Package Imports**
- `recharts` - Better tree-shaking for chart library
- `lucide-react` - Optimized icon imports
- `@/components` and `@/lib` - Custom code tree-shaking

**Files**: `next.config.ts`, `components/game/HistoricalChartLazy.tsx`

### 3. CSS Optimization

✅ **Tailwind CSS Purge**
- Configured via `content` paths in `tailwind.config.ts`
- Unused classes automatically removed in production builds
- PostCSS optimization pipeline

✅ **Critical CSS**
- Inline critical styles in HTML
- Deferred non-critical CSS

**Files**: `tailwind.config.ts`, `postcss.config.mjs`

### 4. JavaScript Optimization

✅ **Production Optimizations**
- Console logs removed (except error/warn)
- React Strict Mode enabled for better practices
- Compression enabled (gzip/brotli)
- Minification and tree-shaking

✅ **Server-Side Rendering (SSR) & Static Generation**
- 3 game detail pages pre-rendered at build time
- SSG for optimal performance (HTML generated at build)
- No client-side data fetching for game pages

**Files**: `next.config.ts`, `app/games/[slug]/page.tsx`

### 5. Animation Performance

✅ **GPU-Accelerated Animations**
- GSAP for smooth, hardware-accelerated animations
- CSS `transform` and `opacity` (GPU-friendly properties)
- Staggered animations to reduce jank
- `will-change` removed after animations complete

✅ **Scroll Optimizations**
- GSAP ScrollTrigger for efficient scroll-based animations
- Debounced scroll events
- Animations only trigger when elements enter viewport

**Files**: `lib/utils/animations.ts`, `components/game/*`

### 6. Runtime Optimizations

✅ **Caching & Headers**
- ETag generation for efficient caching
- Compression enabled
- `X-Powered-By` header disabled (security + bytes saved)

✅ **Font Loading**
- System font stack for instant rendering
- No external font loading delays

**Files**: `next.config.ts`, `app/globals.css`

## Running Lighthouse Audits

### Option 1: Chrome DevTools (Recommended for Development)

1. Build the production version:
   ```bash
   npm run build
   npm start
   ```

2. Open Chrome DevTools (F12)
3. Navigate to the "Lighthouse" tab
4. Select categories:
   - ✅ Performance
   - ✅ Accessibility
   - ✅ Best Practices
   - ✅ SEO
5. Choose "Desktop" or "Mobile" device
6. Click "Analyze page load"

### Option 2: Lighthouse CLI

1. Install Lighthouse globally:
   ```bash
   npm install -g lighthouse
   ```

2. Build and start the production server:
   ```bash
   npm run build
   npm start
   ```

3. Run Lighthouse (in a new terminal):
   ```bash
   # Desktop audit
   lighthouse http://localhost:3000 --output html --output-path ./lighthouse-desktop.html --preset=desktop

   # Mobile audit
   lighthouse http://localhost:3000 --output html --output-path ./lighthouse-mobile.html

   # Specific pages
   lighthouse http://localhost:3000/games/2024-09-07-appalachian-state --output html --output-path ./lighthouse-game-detail.html
   ```

### Option 3: PageSpeed Insights (Production URL)

After deploying to Netlify/Vercel:

1. Visit [PageSpeed Insights](https://pagespeed.web.dev/)
2. Enter your production URL
3. Click "Analyze"
4. Review both Mobile and Desktop scores

### Option 4: Automated CI/CD Testing

Add to `.github/workflows/lighthouse.yml`:

```yaml
name: Lighthouse CI
on: [push, pull_request]
jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run build
      - run: npm start &
      - uses: treosh/lighthouse-ci-action@v9
        with:
          urls: |
            http://localhost:3000
            http://localhost:3000/games/2024-09-07-appalachian-state
          uploadArtifacts: true
```

## Core Web Vitals Measurement

### What to Measure

1. **LCP (Largest Contentful Paint)** - Target: < 2.5s
   - Measures loading performance
   - Should be the game list cards or score comparison bar
   - Optimized by: Image optimization, code splitting, SSG

2. **FID (First Input Delay)** - Target: < 100ms
   - Measures interactivity
   - Time from user interaction to browser response
   - Optimized by: Reduced JavaScript bundle, code splitting

3. **CLS (Cumulative Layout Shift)** - Target: < 0.1
   - Measures visual stability
   - No layout shifts during page load
   - Optimized by: Fixed image dimensions, loading skeletons

4. **FCP (First Contentful Paint)** - Target: < 1.8s
   - First pixel rendered
   - Optimized by: Inline CSS, system fonts, minimal JavaScript

5. **TTI (Time to Interactive)** - Target: < 3.8s
   - Page is fully interactive
   - Optimized by: Code splitting, lazy loading

### Measuring in Production

Use the Web Vitals library for real user monitoring:

```bash
npm install web-vitals
```

```typescript
// app/web-vitals.ts
'use client';

import { onCLS, onFID, onFCP, onLCP, onTTFB } from 'web-vitals';

export function reportWebVitals() {
  onCLS(console.log);
  onFID(console.log);
  onFCP(console.log);
  onLCP(console.log);
  onTTFB(console.log);
}
```

## Performance Checklist

Before deploying to production, verify:

- [ ] Lighthouse Performance score > 90
- [ ] No console errors in production build
- [ ] All images optimized (using Next.js Image)
- [ ] Code splitting working (check Network tab)
- [ ] Lazy loading implemented for below-fold content
- [ ] CSS purged (check bundle size)
- [ ] Animations smooth (60fps)
- [ ] Core Web Vitals meeting targets:
  - [ ] LCP < 2.5s
  - [ ] FID < 100ms
  - [ ] CLS < 0.1
- [ ] Page load < 2 seconds (Fast 3G network simulation)
- [ ] No layout shifts during load
- [ ] Fonts loading instantly (system fonts)
- [ ] Critical CSS inlined
- [ ] Service Worker (optional for v2)

## Monitoring Performance Over Time

### Build Analysis

Run bundle analyzer to track bundle sizes:

```bash
npm install @next/bundle-analyzer
```

```typescript
// next.config.ts
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer(nextConfig);
```

Then run:
```bash
ANALYZE=true npm run build
```

### Expected Bundle Sizes

Based on current implementation:

- **Main JavaScript bundle**: ~150-200KB (gzipped)
- **Recharts (lazy loaded)**: ~80-100KB (gzipped)
- **GSAP**: ~25-30KB (gzipped)
- **Total CSS**: ~10-15KB (gzipped, after purge)

## Performance Regression Prevention

1. **Automated Testing**: Add Lighthouse CI to GitHub Actions
2. **Bundle Size Tracking**: Use bundlesize or size-limit packages
3. **Web Vitals Monitoring**: Implement Real User Monitoring (RUM)
4. **Regular Audits**: Run Lighthouse monthly or after major changes

## Troubleshooting Performance Issues

### Slow LCP
- Check image sizes and formats
- Verify code splitting is working
- Ensure critical CSS is inline
- Check server response time

### High FID
- Reduce JavaScript execution time
- Break up long tasks (use code splitting)
- Defer non-critical JavaScript
- Use web workers for heavy computation

### High CLS
- Set explicit width/height on images
- Reserve space for dynamic content
- Avoid inserting content above existing content
- Use CSS `aspect-ratio` for responsive images

### Large Bundle Size
- Analyze bundle with `ANALYZE=true npm run build`
- Check for duplicate dependencies
- Ensure tree-shaking is working
- Consider lazy loading more components

## Resources

- [Web.dev Performance](https://web.dev/performance/)
- [Core Web Vitals](https://web.dev/vitals/)
- [Next.js Performance](https://nextjs.org/docs/app/building-your-application/optimizing)
- [Lighthouse Documentation](https://developer.chrome.com/docs/lighthouse/overview/)
- [GSAP Performance](https://gsap.com/docs/v3/GSAP/gsap.quickSetter())

## Summary

This application has been optimized for performance with:
- ✅ Image optimization (AVIF/WebP, responsive)
- ✅ Code splitting (lazy loading charts)
- ✅ CSS optimization (Tailwind purge)
- ✅ JavaScript optimization (minification, tree-shaking)
- ✅ SSG for fast page loads
- ✅ GPU-accelerated animations
- ✅ Efficient caching headers

Expected Lighthouse scores:
- **Performance**: 90-95+
- **Accessibility**: 95-100
- **Best Practices**: 95-100
- **SEO**: 95-100

Run the audits using the instructions above to verify these targets are met.
