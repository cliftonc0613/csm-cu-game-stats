# Device Testing Guide - iOS & Android

This document provides a comprehensive checklist for testing the Clemson Sports Statistics website on real iOS and Android devices.

## Supported Devices & OS Versions

### iOS Devices (Recommended Testing)
- **iPhone**: Latest 3 models (e.g., iPhone 15, 14, 13)
- **iPad**: Latest 2 models (e.g., iPad Pro, iPad Air)
- **iOS Versions**: Latest 2 versions (e.g., iOS 17, iOS 16)

### Android Devices (Recommended Testing)
- **Flagship**: Samsung Galaxy S23/S24, Google Pixel 7/8
- **Mid-Range**: Samsung Galaxy A series
- **Tablets**: Samsung Galaxy Tab, Lenovo tablets
- **Android Versions**: Android 12, 13, 14

---

## Responsive Breakpoints

The website uses the following breakpoints defined in `tailwind.config.ts`:

| Breakpoint | Width | Device Type |
|------------|-------|-------------|
| `xs` | 320px | iPhone SE, small phones |
| `sm` | 640px | Large phones (iPhone 14 Pro) |
| `md` | 768px | Tablets portrait |
| `lg` | 1024px | Tablets landscape, small desktop |
| `xl` | 1280px | Desktop |
| `2xl` | 1536px | Large desktop |
| `3xl` | 2560px | Ultra-wide monitors |

### Common Device Screen Sizes

**iPhone (Portrait)**
- iPhone SE: 375x667
- iPhone 13/14: 390x844
- iPhone 13/14 Pro Max: 428x926
- iPhone 15 Pro: 393x852

**iPhone (Landscape)**
- iPhone SE: 667x375
- iPhone 13/14: 844x390
- iPhone 13/14 Pro Max: 926x428

**iPad (Portrait)**
- iPad: 768x1024
- iPad Pro 11": 834x1194
- iPad Pro 12.9": 1024x1366

**iPad (Landscape)**
- iPad: 1024x768
- iPad Pro 11": 1194x834
- iPad Pro 12.9": 1366x1024

**Android Phones (Portrait)**
- Pixel 7: 412x915
- Samsung S23: 360x800
- Samsung S24: 412x915

**Android Tablets (Portrait)**
- Galaxy Tab: 800x1280
- Nexus 9: 768x1024

---

## Pre-Testing Checklist

### Server Setup
```bash
# Start production build
npm run build
npm run start
```

Access from mobile device using local network IP:
```
http://192.168.1.XXX:3000
```

Or test on deployed Netlify URL.

### Device Preparation
- [ ] Enable WiFi on device
- [ ] Clear browser cache
- [ ] Update to latest OS version (if possible)
- [ ] Install multiple browsers for testing:
  - iOS: Safari, Chrome, Firefox
  - Android: Chrome, Firefox, Samsung Internet, Edge

---

## Testing Checklist

### 1. Homepage (`/`) - Portrait Orientation

#### iPhone (375px-428px width)
- [ ] Header is visible and readable
  - [ ] Logo/branding displays correctly
  - [ ] Navigation menu is accessible (hamburger menu if used)
  - [ ] No text truncation
- [ ] Game list cards stack vertically (1 column)
  - [ ] Card images load and fit properly
  - [ ] Text is readable without zooming
  - [ ] Spacing between cards is consistent
- [ ] Search bar is fully visible and functional
  - [ ] Input field is tappable and keyboard appears
  - [ ] Search icon displays correctly
  - [ ] Auto-complete works (if implemented)
- [ ] Filter panel works
  - [ ] Dropdowns open and close smoothly
  - [ ] Options are tappable
  - [ ] Selected filters display correctly
- [ ] Comparison selector bottom bar displays
  - [ ] Checkboxes are tappable
  - [ ] Progress indicator visible
  - [ ] "Compare" button is accessible
- [ ] Footer is readable and links work
- [ ] No horizontal scrolling
- [ ] All touch targets are at least 44x44px

#### iPad (768px-1024px width)
- [ ] Header displays with full navigation (no hamburger)
- [ ] Game list cards display in 2-3 columns
- [ ] Search and filters side-by-side or stacked appropriately
- [ ] Comparison selector bar fits screen width
- [ ] Adequate white space and padding
- [ ] Text is larger/more readable than phone
- [ ] No horizontal scrolling

### 2. Homepage (`/`) - Landscape Orientation

#### iPhone Landscape (667px-926px width)
- [ ] Header condenses appropriately
- [ ] Game list displays in 2 columns
- [ ] Search and filters fit in available height
- [ ] Comparison selector doesn't obstruct content
- [ ] Scrolling works smoothly
- [ ] Browser chrome doesn't hide critical UI

#### iPad Landscape (1024px-1366px width)
- [ ] Layout matches desktop experience
- [ ] Game list displays in 3-4 columns
- [ ] All navigation visible
- [ ] Optimal use of screen real estate

### 3. Game Detail Pages (`/games/[slug]`) - Portrait

#### Mobile (320px-640px)
- [ ] Breadcrumbs display correctly
  - [ ] Not truncated
  - [ ] Tappable for navigation
- [ ] GameDetailHeader renders properly
  - [ ] Team logos visible and sized correctly
  - [ ] Game title readable without zoom
  - [ ] Date, location text not truncated
- [ ] ScoreComparisonBar works on mobile
  - [ ] Team logos in circular containers
  - [ ] Score bar fills width
  - [ ] Orange/purple sections visible
  - [ ] Text overlays are readable
  - [ ] Doesn't overflow screen
- [ ] StatCardGrid displays correctly
  - [ ] Cards stack vertically (1 column on smallest screens)
  - [ ] 2 columns on larger phones
  - [ ] Orange/purple colors render accurately
  - [ ] Large numbers are readable
  - [ ] Ordinal superscripts display correctly
- [ ] GameMetadata readable
  - [ ] Attendance, weather, location visible
  - [ ] Icons (if used) render correctly
  - [ ] Grid/list layout adapts to screen size
- [ ] HistoricalChart (if present)
  - [ ] Chart renders and fits screen
  - [ ] Axes and labels are readable
  - [ ] Touch interactions work (zoom, pan if implemented)
  - [ ] Tooltips appear on tap
  - [ ] Legend is visible
- [ ] GameTable displays correctly
  - [ ] Horizontal scroll works smoothly
  - [ ] Headers are sticky (if implemented)
  - [ ] Sort indicators visible and tappable
  - [ ] Cell content doesn't overflow
  - [ ] Zebra striping visible (if used)
- [ ] ExportButton works
  - [ ] Dropdown opens on tap
  - [ ] Options are tappable
  - [ ] CSV downloads correctly
- [ ] Markdown content renders
  - [ ] Headings sized appropriately
  - [ ] Lists display correctly
  - [ ] Tables scroll horizontally if needed
  - [ ] Links are tappable
- [ ] No content hidden or cut off
- [ ] No horizontal scrolling (except tables)

#### Tablet (768px+)
- [ ] Layout uses available width better
- [ ] StatCardGrid shows 2-3 columns
- [ ] Charts are larger and more readable
- [ ] Tables display more columns before scrolling
- [ ] Metadata uses grid layout effectively

### 4. Comparison Page (`/compare`) - All Devices

#### Portrait Mode
- [ ] Game cards display in appropriate grid
  - [ ] 1 column on small phones
  - [ ] 2 columns on larger phones/small tablets
  - [ ] 2-3 columns on tablets
- [ ] Score comparison table readable
  - [ ] Headers visible
  - [ ] Horizontal scroll if needed
  - [ ] All data visible
- [ ] Quick stats table accessible
  - [ ] Proper column sizing
  - [ ] Touch-friendly row selection (if applicable)
- [ ] Statistical differences highlighted correctly
- [ ] No layout breaks or overflow

#### Landscape Mode
- [ ] Games display side-by-side effectively
- [ ] Tables utilize horizontal space
- [ ] All comparison data visible without scrolling
- [ ] Layout doesn't feel cramped

### 5. Touch & Gesture Interactions

#### Tap Targets
- [ ] All buttons are at least 44x44px (Apple guideline)
- [ ] Adequate spacing between tappable elements
- [ ] No accidental taps on nearby elements
- [ ] Checkboxes are easy to tap
- [ ] Links in text are tappable

#### Scrolling
- [ ] Vertical scrolling is smooth (60fps)
- [ ] Horizontal scrolling works for tables
- [ ] Momentum scrolling feels natural (iOS)
- [ ] No stuttering or janky scrolling
- [ ] Scroll position maintained on navigation

#### Form Inputs
- [ ] Keyboard appears when tapping input fields
- [ ] Correct keyboard type shows (text, number, etc.)
- [ ] Input field zooms appropriately (iOS)
- [ ] Form doesn't zoom entire page
- [ ] Easy to dismiss keyboard
- [ ] Input values persist correctly

#### Dropdown Menus
- [ ] Dropdowns open on tap
- [ ] Options are scrollable if long list
- [ ] Selected option highlighted
- [ ] Easy to close dropdown
- [ ] Multiple dropdowns don't interfere

### 6. Animations & Performance

#### GSAP Animations
- [ ] Scroll reveal animations trigger on scroll
  - [ ] StatCardGrid stagger effect works
  - [ ] ScoreComparisonBar fades in
  - [ ] HistoricalChart fades in
  - [ ] Animations don't block scrolling
- [ ] Page transitions smooth
  - [ ] No flash of unstyled content
  - [ ] Transition feels natural (not too slow/fast)
- [ ] Chart drawing animation plays
  - [ ] Smooth line drawing
  - [ ] No stuttering on lower-end devices
- [ ] Hover effects (on devices that support)
  - [ ] StatCard scale effect (on capable devices)
  - [ ] Button hover states work

#### Performance Metrics
- [ ] Page loads in <3 seconds on 4G
- [ ] Page loads in <2 seconds on WiFi
- [ ] Smooth 60fps scrolling
- [ ] No janky animations
- [ ] Images load progressively
- [ ] No layout shift (CLS < 0.1)

### 7. iOS-Specific Testing

#### Safari (Primary Browser)
- [ ] All features work correctly
- [ ] Date pickers display correctly
- [ ] Touch events fire properly
- [ ] Smooth scrolling enabled
- [ ] No -webkit- prefix issues
- [ ] Safe area insets respected (iPhone X+)
  - [ ] Notch doesn't hide content
  - [ ] Home indicator doesn't obscure UI

#### Home Screen / PWA Features
- [ ] Add to Home Screen works (if implemented)
- [ ] App icon displays correctly
- [ ] Splash screen shows (if configured)
- [ ] Standalone mode works (if enabled)

#### iOS-Specific Issues to Check
- [ ] Fixed positioning works correctly
- [ ] Input fields don't zoom page excessively
- [ ] Rubber-band scrolling doesn't break layout
- [ ] Text selection works properly
- [ ] Copy/paste functionality works

### 8. Android-Specific Testing

#### Chrome (Primary Browser)
- [ ] All features work correctly
- [ ] Material Design interactions feel native
- [ ] Pull-to-refresh doesn't conflict (if implemented)
- [ ] Address bar hiding/showing doesn't break layout

#### Samsung Internet
- [ ] All features work (Samsung has significant market share)
- [ ] Custom scrollbar doesn't interfere
- [ ] Night mode doesn't break colors

#### Android-Specific Issues to Check
- [ ] Back button works correctly
- [ ] Navigation bar doesn't obscure content
- [ ] Keyboard doesn't hide input fields
- [ ] Multiple browser engines tested (Chrome, Firefox)
- [ ] Download behavior works correctly

### 9. Accessibility on Mobile

#### Screen Reader Support
- [ ] iOS VoiceOver navigation works
  - [ ] All elements announced correctly
  - [ ] Swipe navigation logical
  - [ ] Buttons announce state
- [ ] Android TalkBack navigation works
  - [ ] Similar to VoiceOver testing
  - [ ] Touch exploration works

#### Touch Accessibility
- [ ] Touch targets meet size requirements
- [ ] Focus indicators visible when using keyboard
- [ ] Tab navigation works with external keyboard
- [ ] Color contrast passes on all screen types
- [ ] Text is readable at default zoom
- [ ] Pinch-to-zoom works (if enabled)

### 10. Network Conditions

#### Fast WiFi
- [ ] Page loads quickly
- [ ] Images load immediately
- [ ] Animations start promptly

#### Slow 3G/4G
- [ ] Page remains usable while loading
- [ ] Critical content loads first
- [ ] Images use progressive loading
- [ ] Loading states display correctly
- [ ] Offline message shows if applicable

#### Offline
- [ ] Graceful error messages
- [ ] Cached content accessible (if PWA)
- [ ] Service worker handles offline (if implemented)

---

## Device-Specific Features

### iOS Features to Test

#### Gestures
- [ ] Swipe back to previous page works
- [ ] Pinch-to-zoom works (if enabled)
- [ ] Long-press context menu works

#### System Integration
- [ ] Share sheet works (if implemented)
- [ ] Copying text works correctly
- [ ] Opening links in new tab works

### Android Features to Test

#### Gestures
- [ ] Back button navigation
- [ ] Pull-to-refresh (if implemented)
- [ ] Multi-window mode works

#### System Integration
- [ ] Share functionality works
- [ ] Download notifications work
- [ ] Opening links in Chrome Custom Tabs

---

## Orientation Changes

### Portrait to Landscape
- [ ] Layout adapts smoothly
- [ ] No content lost during transition
- [ ] Scroll position maintained (or reset logically)
- [ ] Animations don't re-trigger
- [ ] No flash of unstyled content

### Landscape to Portrait
- [ ] Same checks as above
- [ ] Navigation doesn't break
- [ ] Forms maintain state

---

## Testing Tools

### Remote Debugging
- **iOS**: Safari Web Inspector (Mac required)
  - Connect iPhone via USB
  - Enable "Web Inspector" in Safari settings
  - Use Develop menu in desktop Safari

- **Android**: Chrome DevTools
  - Enable "USB Debugging" in Developer Options
  - Connect via USB
  - Use chrome://inspect in desktop Chrome

### Emulators/Simulators
- **iOS Simulator**: Xcode (Mac only)
  - Good for layout testing
  - Not perfect for performance/touch testing
  - Use real devices for final validation

- **Android Emulator**: Android Studio
  - Good for various screen sizes
  - Test different Android versions
  - Use real devices for final validation

### Cloud Testing Services
- **BrowserStack**: Test on real iOS/Android devices remotely
- **Sauce Labs**: Similar to BrowserStack
- **AWS Device Farm**: Test on real devices in cloud
- **Firebase Test Lab**: Android-focused testing

### Responsive Testing in Browser
```bash
# Chrome DevTools Device Mode
# - Toggle device toolbar (Cmd/Ctrl + Shift + M)
# - Select device from dropdown
# - Test different orientations
# - Throttle network
```

---

## Common Issues & Solutions

### Text Too Small on Mobile
- **Issue**: Text requires zooming to read
- **Solution**: Ensure base font-size is 16px minimum, use responsive typography

### Buttons Too Small
- **Issue**: Difficult to tap accurately
- **Solution**: Minimum 44x44px touch targets, add padding

### Horizontal Scrolling
- **Issue**: Content wider than viewport
- **Solution**: Use `max-width: 100%`, `overflow-x: hidden` carefully

### Fixed Elements Hiding Content
- **Issue**: Fixed headers/footers obscure content
- **Solution**: Add appropriate padding/margin to body/main

### Animations Too Slow on Old Devices
- **Issue**: GSAP animations stutter
- **Solution**: Reduce complexity, use will-change, test on actual devices

### Keyboard Obscures Input
- **Issue**: Mobile keyboard hides form field
- **Solution**: Scroll input into view on focus, adjust viewport

### Images Not Loading
- **Issue**: Large images timeout on slow connections
- **Solution**: Use Next.js Image optimization, responsive images

---

## Reporting Device Issues

When reporting device-specific issues, include:

1. **Device Information**:
   - Device model: e.g., "iPhone 14 Pro"
   - OS version: e.g., "iOS 17.2"
   - Browser: e.g., "Safari 17"
   - Screen size: e.g., "390x844"

2. **Network Conditions**:
   - WiFi / 4G / 5G
   - Speed test results if slow

3. **Orientation**: Portrait / Landscape

4. **Issue Details**:
   - Page/route where issue occurs
   - Screenshot or screen recording
   - Steps to reproduce
   - Expected vs actual behavior

5. **Console Errors** (if using remote debugging):
   - Any JavaScript errors
   - Network failures
   - Warnings

---

## Sign-Off Checklist

Before marking device testing complete:

- [ ] Tested on at least 2 different iPhone models
- [ ] Tested on at least 2 different Android phones
- [ ] Tested on at least 1 iPad
- [ ] Tested on at least 1 Android tablet
- [ ] All orientations tested (portrait & landscape)
- [ ] Multiple browsers tested on each platform
- [ ] Different network speeds tested
- [ ] Touch interactions work smoothly
- [ ] Animations perform well
- [ ] No layout breaks at any tested screen size
- [ ] All issues documented and prioritized
- [ ] Critical issues fixed and re-tested

---

## Next Steps

After completing device testing:
1. Document all device-specific issues found
2. Prioritize fixes (critical, high, medium, low)
3. Fix critical and high-priority issues
4. Re-test on affected devices
5. Update this document with any device-specific workarounds
6. Proceed to deployment (Task 9.0)

---

## Quick Reference: Screen Size Guidelines

| Device | Viewport Width | Layout Columns | Font Size Base |
|--------|---------------|----------------|----------------|
| iPhone SE | 375px | 1 | 16px |
| iPhone 14 | 390px | 1 | 16px |
| iPhone 14 Plus | 428px | 1-2 | 16px |
| iPad Portrait | 768px | 2-3 | 16-18px |
| iPad Landscape | 1024px | 3-4 | 18px |
| Android Phone | 360-420px | 1 | 16px |
| Android Tablet | 800px+ | 2-3 | 16-18px |
