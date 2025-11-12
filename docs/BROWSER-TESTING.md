# Browser Testing Guide

This document provides a comprehensive checklist for testing the Clemson Sports Statistics website across different browsers.

## Supported Browsers

The website is designed to work on:
- **Chrome** (latest 2 versions)
- **Firefox** (latest 2 versions)
- **Safari** (latest 2 versions)
- **Edge** (latest 2 versions)

## Testing Environment Setup

### Local Testing
```bash
npm run build
npm run start
```
Visit `http://localhost:3000` in each browser.

### Production Testing
Test on the deployed Netlify URL after deployment.

---

## Browser Compatibility Features Used

### CSS Features
- **CSS Grid & Flexbox**: Modern layout (all browsers support)
- **CSS Custom Properties**: Used for theming (all modern browsers)
- **Tailwind CSS 4**: Utility-first CSS with excellent browser support
- **CSS Transitions & Transforms**: For hover effects and animations

### JavaScript Features
- **ES2020+**: Modern JavaScript (transpiled by Next.js)
- **GSAP Animations**: Cross-browser animation library
- **Next.js 16**: React 19 with automatic browser compatibility
- **Async/Await**: Native support in all modern browsers

### Known Browser-Specific Considerations
- **Safari**: May require `-webkit-` prefixes (handled by autoprefixer)
- **Firefox**: Scrollbar styling differs (acceptable)
- **Edge**: Full Chromium support (same as Chrome)

---

## Testing Checklist

### 1. Homepage (`/`)

#### Visual Rendering
- [ ] Header displays correctly with navigation
- [ ] Footer displays correctly
- [ ] Clemson brand colors render accurately (orange #F56600, purple #522D80)
- [ ] Game list cards display in grid layout
- [ ] No layout shifts or broken elements

#### Interactive Elements
- [ ] Search bar functionality works
- [ ] Filter dropdowns work correctly
- [ ] Game cards are clickable and navigate correctly
- [ ] Hover effects on buttons and cards work smoothly
- [ ] Comparison selector checkboxes work
- [ ] "Compare Selected Games" button enables/disables correctly

#### Responsive Behavior (tested at multiple screen sizes in each browser)
- [ ] Mobile (320px-640px): Single column layout
- [ ] Tablet (640px-1024px): Two column layout
- [ ] Desktop (1024px+): Multi-column layout
- [ ] No horizontal scrolling on any screen size

### 2. Game Detail Pages (`/games/[slug]`)

#### Visual Rendering
- [ ] Breadcrumbs display correctly
- [ ] GameDetailHeader renders with team logos
- [ ] ScoreComparisonBar displays correctly
  - [ ] Team logos appear in circular containers
  - [ ] Score bar shows correct proportions
  - [ ] Orange/purple sections display correctly
- [ ] StatCardGrid displays with alternating colors
  - [ ] Orange cards render correctly
  - [ ] Purple cards render correctly
  - [ ] White text is readable on colored backgrounds
- [ ] HistoricalChart renders (if present)
  - [ ] Chart axes and labels display
  - [ ] Line/area colors match branding
  - [ ] Tooltips appear on hover
- [ ] GameTable displays correctly
  - [ ] Headers are bold and styled
  - [ ] Rows are readable
  - [ ] Borders render correctly

#### Interactive Elements
- [ ] Export button dropdown works
- [ ] CSV export downloads correctly
- [ ] Table sorting works (click column headers)
  - [ ] Ascending sort
  - [ ] Descending sort
  - [ ] Sort indicators (arrows) display
- [ ] Links in markdown content work

#### Animations (GSAP)
- [ ] Scroll reveal animations trigger on scroll
  - [ ] StatCardGrid fades in with stagger
  - [ ] ScoreComparisonBar fades in
  - [ ] HistoricalChart fades in
- [ ] Page transition animations work when navigating
- [ ] Chart drawing animation plays on load (if chart present)
- [ ] Hover scale effects work on StatCards

#### Performance
- [ ] Page loads in under 2 seconds
- [ ] Animations are smooth (60fps)
- [ ] No janky scrolling
- [ ] Images load progressively

### 3. Comparison Page (`/compare`)

#### Visual Rendering
- [ ] Side-by-side game layout displays correctly (2-4 games)
- [ ] Score comparison table renders
- [ ] Quick stats table renders
- [ ] Statistical differences are highlighted
- [ ] All game metadata displays

#### Interactive Elements
- [ ] URL parameters work (games loaded from URL)
- [ ] Tables display all game data correctly
- [ ] Scroll works correctly if needed

### 4. Cross-Page Features

#### Navigation
- [ ] Header navigation links work in all browsers
- [ ] Breadcrumbs work correctly
- [ ] Back button works correctly
- [ ] Forward button works correctly
- [ ] Browser history is maintained

#### Forms & Inputs
- [ ] Search input accepts text
- [ ] Search input clears correctly
- [ ] Filter dropdowns open/close
- [ ] Checkboxes check/uncheck
- [ ] All form controls are keyboard accessible

#### Accessibility
- [ ] Tab navigation works through all interactive elements
- [ ] Focus indicators display correctly (orange rings)
- [ ] Skip links work (if implemented)
- [ ] ARIA labels are respected by screen readers
- [ ] Semantic HTML structure maintained

---

## Browser-Specific Testing

### Chrome
**Focus Areas:**
- [ ] DevTools Console: No errors
- [ ] DevTools Network: All assets load correctly
- [ ] DevTools Performance: No layout thrashing
- [ ] Lighthouse Score: >90 for Performance

**Known Issues:**
- None expected

### Firefox
**Focus Areas:**
- [ ] Console: No errors or warnings
- [ ] Network tab: All resources load
- [ ] Custom scrollbar styling may differ (acceptable)
- [ ] GSAP animations work smoothly

**Known Issues:**
- Scrollbar styling differs from Chrome (by design, acceptable)

### Safari (macOS/iOS)
**Focus Areas:**
- [ ] Web Inspector Console: No errors
- [ ] Smooth scrolling works
- [ ] CSS Grid/Flexbox layouts correct
- [ ] Date formatting displays correctly
- [ ] Touch interactions work (on iOS)

**Known Issues:**
- May require specific `-webkit-` prefixes (handled by autoprefixer)
- Date input fields may render differently (acceptable)

### Edge (Chromium)
**Focus Areas:**
- [ ] DevTools Console: No errors
- [ ] Same behavior as Chrome expected
- [ ] All modern features work

**Known Issues:**
- None expected (uses Chromium engine like Chrome)

---

## Performance Benchmarks

Test these metrics in each browser:

### Lighthouse Scores (Chrome DevTools)
- **Performance**: >90
- **Accessibility**: >95
- **Best Practices**: >95
- **SEO**: >95

### Core Web Vitals
- **LCP** (Largest Contentful Paint): <2.5s
- **FID** (First Input Delay): <100ms
- **CLS** (Cumulative Layout Shift): <0.1

### Page Load Times
- **Homepage**: <2s
- **Game Detail**: <2s
- **Comparison Page**: <2.5s

---

## Automated Testing Commands

```bash
# Run all unit tests
npm test

# Run tests with coverage
npm run test:coverage

# Build for production
npm run build

# Type check
npm run type-check

# Lint code
npm run lint
```

---

## Reporting Issues

When reporting browser-specific issues, include:

1. **Browser & Version**: e.g., "Firefox 120.0"
2. **Operating System**: e.g., "macOS 14.1"
3. **Screen Resolution**: e.g., "1920x1080"
4. **Steps to Reproduce**: Detailed steps
5. **Expected Behavior**: What should happen
6. **Actual Behavior**: What actually happens
7. **Screenshots**: If visual issue
8. **Console Errors**: Copy any console errors

---

## Browser Testing Tools

### Local Testing
- **BrowserStack**: Test on real browsers and devices
- **LambdaTest**: Cross-browser testing platform
- **Sauce Labs**: Automated and manual testing

### Browser DevTools
- **Chrome DevTools**: Comprehensive testing and debugging
- **Firefox Developer Tools**: Similar to Chrome
- **Safari Web Inspector**: For Safari-specific issues
- **Edge DevTools**: Chromium-based tools

### Automated Tools
- **Playwright**: Automated browser testing (future enhancement)
- **Selenium**: Cross-browser automation
- **Cypress**: E2E testing framework

---

## Sign-Off Checklist

Before marking browser testing complete:

- [ ] All pages tested in Chrome (latest)
- [ ] All pages tested in Firefox (latest)
- [ ] All pages tested in Safari (latest)
- [ ] All pages tested in Edge (latest)
- [ ] All interactive features work in all browsers
- [ ] No console errors in any browser
- [ ] Performance benchmarks met in all browsers
- [ ] Responsive design works across all breakpoints in all browsers
- [ ] Animations work smoothly in all browsers
- [ ] All issues documented and triaged

---

## Next Steps

After completing browser testing:
1. Document any browser-specific issues found
2. Prioritize and fix critical issues
3. Re-test after fixes
4. Proceed to Task 8.13: Device testing (iOS, Android)
