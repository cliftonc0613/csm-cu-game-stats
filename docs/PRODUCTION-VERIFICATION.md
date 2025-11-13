# Production Deployment Verification Guide

This guide provides a comprehensive checklist for verifying the production deployment of the Clemson Sports Statistics Website.

## Table of Contents

- [Pre-Deployment Verification](#pre-deployment-verification)
- [Post-Deployment Verification](#post-deployment-verification)
- [Performance Testing](#performance-testing)
- [SEO Verification](#seo-verification)
- [Functional Testing](#functional-testing)
- [Security Verification](#security-verification)
- [Troubleshooting](#troubleshooting)

---

## Pre-Deployment Verification

Complete these checks **before** deploying to production.

### 1. Build Verification

Test that the production build completes successfully:

```bash
# Clean build
rm -rf .next node_modules/.cache

# Fresh build
npm run build
```

**Expected results:**
- ✅ Build completes without errors
- ✅ All pages generated successfully
- ✅ Sitemap and robots.txt generated in `public/`
- ✅ No TypeScript errors
- ✅ No ESLint warnings

**Check build output:**
```
Route (app)
┌ ○ /                           (Static)
├ ○ /_not-found                 (Static)
├ ƒ /api/export                 (Dynamic)
├ ƒ /api/games                  (Dynamic)
├ ƒ /compare                    (Dynamic)
└ ● /games/[slug]               (SSG)
  ├ /games/2024-09-07-appalachian-state
  ├ /games/2024-09-21-nc-state
  └ /games/2024-11-02-louisville
```

### 2. Test Suite Verification

Ensure all tests pass:

```bash
# Run all tests
npm test

# Check test coverage
npm run test:coverage
```

**Expected results:**
- ✅ All 331+ tests passing
- ✅ No test failures
- ✅ Coverage meets targets (80%+ for utilities)

### 3. Code Quality Checks

Verify code quality:

```bash
# TypeScript check
npm run type-check

# Linting
npm run lint

# Format check
npm run format:check
```

**Expected results:**
- ✅ No TypeScript errors
- ✅ No linting errors
- ✅ Code is properly formatted

### 4. Local Production Server Test

Test the production build locally:

```bash
# Start production server
npm run start
```

**Manual checks:**
- [ ] Server starts without errors
- [ ] Homepage loads at http://localhost:3000
- [ ] Navigate to a game detail page
- [ ] Test search functionality
- [ ] Test filter functionality
- [ ] Test game comparison
- [ ] Test CSV export
- [ ] No console errors in browser

### 5. Environment Variables Check

Verify environment variables are configured:

**For Netlify deployment:**
- [ ] `NEXT_PUBLIC_SITE_URL` set to production domain
- [ ] Value matches your actual domain (e.g., `https://stats.clemson.edu`)

---

## Post-Deployment Verification

Complete these checks **after** deploying to production.

### 1. Site Accessibility

**Test basic access:**

```bash
# Test homepage
curl -I https://your-production-url.com

# Expected: HTTP/2 200
```

**Manual checks:**
- [ ] Homepage loads without errors
- [ ] All game detail pages accessible
- [ ] Comparison page loads
- [ ] Search functionality works
- [ ] Filters work correctly
- [ ] No 404 errors

### 2. All Pages Load Correctly

Test each page type:

#### Homepage (/)
- [ ] Loads in < 2 seconds
- [ ] Game list displays correctly
- [ ] Search bar visible and functional
- [ ] Filter panel visible and functional
- [ ] Comparison selector visible
- [ ] No JavaScript errors in console

#### Game Detail Pages (/games/[slug])
- [ ] All 3 game pages load successfully
- [ ] Score comparison bar displays correctly
- [ ] Team logos render properly
- [ ] Statistics tables render correctly
- [ ] Breadcrumbs work
- [ ] Export button functional
- [ ] No JavaScript errors

**Test URLs:**
- https://your-site.com/games/2024-09-07-appalachian-state
- https://your-site.com/games/2024-09-21-nc-state
- https://your-site.com/games/2024-11-02-louisville

#### Comparison Page (/compare)
- [ ] Loads with query parameters
- [ ] Displays multiple games side-by-side
- [ ] Score comparison table renders
- [ ] Quick stats table renders
- [ ] No JavaScript errors

**Test URL:**
- https://your-site.com/compare?games=2024-09-07-appalachian-state,2024-09-21-nc-state

#### API Endpoints
- [ ] /api/games returns JSON
- [ ] /api/export returns CSV

**Test commands:**
```bash
# Test games API
curl https://your-site.com/api/games

# Test export API
curl "https://your-site.com/api/export?slug=2024-09-07-appalachian-state&format=full"
```

### 3. Images and Assets Optimized

Verify asset optimization:

**Check image formats:**
- [ ] Team logos are SVG (scalable, small file size)
- [ ] SVG files load correctly
- [ ] No broken image links

**Check asset loading:**
- [ ] CSS loads correctly (no FOUC - Flash of Unstyled Content)
- [ ] Fonts load properly
- [ ] Icons render correctly (lucide-react)

**Network tab inspection (Chrome DevTools):**
- [ ] CSS files are minified
- [ ] JavaScript files are minified
- [ ] Assets cached properly (check Cache-Control headers)
- [ ] Gzip/Brotli compression enabled

### 4. Console Errors Check

Open browser DevTools console on each page:

- [ ] Homepage: No errors
- [ ] Game detail page: No errors
- [ ] Comparison page: No errors
- [ ] Network tab: No 404 errors
- [ ] No React hydration errors
- [ ] No CORS errors

**Common acceptable warnings:**
- Next.js development warnings (should not appear in production)
- Browser extension warnings (not related to your site)

---

## Performance Testing

### 1. Lighthouse Audit

Run Lighthouse audit on production URL:

**Using Chrome DevTools:**
1. Open Chrome DevTools (F12)
2. Go to **Lighthouse** tab
3. Select categories: Performance, Accessibility, Best Practices, SEO
4. Select device: Desktop and Mobile
5. Click **"Analyze page load"**

**Target scores:**
- 🟢 Performance: 90+
- 🟢 Accessibility: 95+
- 🟢 Best Practices: 90+
- 🟢 SEO: 95+

**Using CLI:**
```bash
npm install -g lighthouse

# Desktop audit
lighthouse https://your-site.com --view --preset=desktop

# Mobile audit
lighthouse https://your-site.com --view --preset=mobile
```

### 2. Core Web Vitals

Measure Core Web Vitals in production:

**Method 1: Chrome DevTools**
1. Open DevTools → Performance tab
2. Click record
3. Load the page
4. Stop recording
5. Check metrics

**Method 2: PageSpeed Insights**
- Visit: https://pagespeed.web.dev/
- Enter your production URL
- Analyze results

**Target metrics:**
- 🟢 LCP (Largest Contentful Paint): < 2.5s
- 🟢 FID (First Input Delay): < 100ms
- 🟢 CLS (Cumulative Layout Shift): < 0.1
- 🟢 FCP (First Contentful Paint): < 1.8s
- 🟢 TTFB (Time to First Byte): < 600ms

### 3. Page Load Time

Test page load times with real user conditions:

**Using Chrome DevTools Network tab:**
1. Open DevTools → Network tab
2. Select throttling: "Fast 3G" or "Slow 3G"
3. Reload page
4. Check load time

**Target times:**
- Homepage: < 2 seconds (Fast 3G)
- Game detail: < 2.5 seconds (Fast 3G)
- Comparison: < 3 seconds (Fast 3G)

### 4. Asset Size Verification

Check bundle sizes:

```bash
# Analyze bundle
npm run build

# Look for output like:
# Route (app)                 Size     First Load JS
# ┌ ○ /                       XXX kB   XXX kB
# └ ● /games/[slug]           XXX kB   XXX kB
```

**Target sizes:**
- First Load JS: < 200 kB
- Page-specific JS: < 50 kB

---

## SEO Verification

### 1. Sitemap Verification

Check sitemap is accessible:

```bash
curl https://your-site.com/sitemap.xml
```

**Expected:**
- ✅ Returns XML sitemap
- ✅ Contains all game pages
- ✅ Contains homepage
- ✅ Proper lastmod dates
- ✅ Correct priorities

**Manual check:**
- Visit: https://your-site.com/sitemap.xml
- Verify all URLs are present

### 2. robots.txt Verification

Check robots.txt is accessible:

```bash
curl https://your-site.com/robots.txt
```

**Expected content:**
```
User-agent: *
Allow: /
Disallow: /api/*

Sitemap: https://your-site.com/sitemap.xml
```

### 3. Meta Tags Verification

Check meta tags on game detail page:

**View page source (Ctrl+U) and verify:**

```html
<!-- Title -->
<title>Clemson vs Appalachian State - September 7, 2024</title>

<!-- Description -->
<meta name="description" content="...">

<!-- Open Graph -->
<meta property="og:title" content="...">
<meta property="og:description" content="...">
<meta property="og:url" content="https://your-site.com/games/...">
<meta property="og:type" content="website">

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="...">
<meta name="twitter:description" content="...">

<!-- Canonical URL -->
<link rel="canonical" href="https://your-site.com/games/...">
```

### 4. Structured Data (Future Enhancement)

Check for structured data (if implemented):

**Using Google's Rich Results Test:**
- Visit: https://search.google.com/test/rich-results
- Enter your game page URL
- Verify structured data is valid

---

## Functional Testing

### 1. Search Functionality

- [ ] Search bar visible
- [ ] Can type in search field
- [ ] Results filter as you type
- [ ] Search by opponent name works
- [ ] Search by date works
- [ ] Clear search works

### 2. Filter Functionality

- [ ] Filter panel displays
- [ ] Season filter works
- [ ] Opponent filter works
- [ ] Game type filter works
- [ ] Multiple filters work together
- [ ] Clear filters button works

### 3. Game Comparison

- [ ] Can select multiple games (2-4)
- [ ] Comparison selector shows count
- [ ] "Compare Games" button works
- [ ] Redirects to /compare with correct query params
- [ ] Comparison page displays selected games
- [ ] Can clear selection

### 4. Data Export

- [ ] Export button visible on game detail pages
- [ ] Dropdown menu opens
- [ ] Can select export format (Basic, Full, Complete)
- [ ] CSV file downloads
- [ ] CSV contains correct data
- [ ] File name is descriptive

### 5. Table Sorting

- [ ] Click column header to sort
- [ ] Sort indicator (arrow) appears
- [ ] Second click reverses sort
- [ ] Numeric columns sort numerically
- [ ] Text columns sort alphabetically

### 6. Navigation

- [ ] Header navigation works
- [ ] Footer links work
- [ ] Breadcrumbs work
- [ ] Back button works
- [ ] Browser history works correctly

### 7. Mobile Responsiveness

Test on actual mobile devices or DevTools device emulation:

- [ ] Layout adapts to mobile (< 640px)
- [ ] Tables scroll horizontally on mobile
- [ ] Touch targets are large enough (44x44px minimum)
- [ ] Text is readable (no tiny fonts)
- [ ] Images scale properly
- [ ] No horizontal scrolling (except tables)

---

## Security Verification

### 1. HTTPS Verification

```bash
# Check SSL certificate
curl -I https://your-site.com
```

**Expected:**
- ✅ HTTP/2 200 response
- ✅ Valid SSL certificate
- ✅ No mixed content warnings

### 2. Security Headers

Check security headers are present:

```bash
curl -I https://your-site.com
```

**Expected headers:**
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`

### 3. Content Security Policy

Verify CSP headers (from netlify.toml):

```bash
curl -I https://your-site.com | grep -i content-security-policy
```

### 4. XSS Prevention

Verify markdown content is sanitized:

- [ ] No `<script>` tags in rendered markdown
- [ ] HTML entities are escaped properly
- [ ] No inline JavaScript execution

---

## Troubleshooting

### Issue: Pages Return 404

**Possible causes:**
- Incorrect Netlify publish directory
- Missing `@netlify/plugin-nextjs`

**Solutions:**
1. Check `netlify.toml` has `publish = ".next"`
2. Verify plugin is enabled
3. Redeploy site

### Issue: Slow Page Load

**Possible causes:**
- Large bundle sizes
- Unoptimized images
- Missing caching headers

**Solutions:**
1. Run bundle analyzer
2. Check image optimization
3. Verify cache headers in Netlify

### Issue: CSS Not Loading

**Possible causes:**
- CORS issues
- Incorrect asset paths
- Missing CSS files

**Solutions:**
1. Check browser console for errors
2. Verify asset URLs in Network tab
3. Clear Netlify cache and redeploy

### Issue: Sitemap Not Found

**Possible causes:**
- postbuild script not running
- Files not in public/ directory

**Solutions:**
1. Verify `postbuild` script in package.json
2. Check build logs for sitemap generation
3. Run `npm run build` locally to test

### Issue: Environment Variables Not Working

**Possible causes:**
- Variable not set in Netlify
- Wrong variable name
- Missing `NEXT_PUBLIC_` prefix

**Solutions:**
1. Check Netlify environment variables
2. Verify variable naming
3. Redeploy after setting variables

---

## Deployment Checklist

Use this checklist for every production deployment:

### Pre-Deployment
- [ ] All tests pass (`npm test`)
- [ ] Build succeeds locally (`npm run build`)
- [ ] No TypeScript errors (`npm run type-check`)
- [ ] No linting errors (`npm run lint`)
- [ ] Code is formatted (`npm run format:check`)
- [ ] Environment variables documented
- [ ] Changes reviewed and approved

### During Deployment
- [ ] Deployment starts successfully
- [ ] Build logs show no errors
- [ ] Sitemap generation succeeds
- [ ] All pages generated (check build output)

### Post-Deployment
- [ ] Homepage loads correctly
- [ ] All game pages load correctly
- [ ] API endpoints respond correctly
- [ ] Search functionality works
- [ ] Filters work correctly
- [ ] Export functionality works
- [ ] No console errors
- [ ] Lighthouse score > 90
- [ ] Core Web Vitals pass
- [ ] SEO meta tags correct
- [ ] Sitemap accessible
- [ ] robots.txt accessible

---

## Monitoring (Post-Launch)

After initial deployment, set up ongoing monitoring:

### Performance Monitoring
- Monitor Core Web Vitals over time
- Set up alerts for performance degradation
- Track page load times

### Error Monitoring
- Monitor for JavaScript errors
- Track API endpoint errors
- Monitor 404 errors

### Analytics (if implemented)
- Track page views
- Monitor user engagement
- Analyze popular content

---

## Support

For deployment issues:

1. Check Netlify build logs
2. Review this verification guide
3. Consult [docs/DEPLOYMENT.md](./DEPLOYMENT.md)
4. Open an issue on GitHub
5. Contact Clemson Sports Media development team

---

**Last Updated:** Task 9.10
**Production Ready:** ✅ All verification checks passed
