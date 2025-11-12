# Interactive Features Testing Plan

This document outlines the testing plan for all interactive features implemented in Tasks 7.1-7.6.

## Test Environment Setup

### Device/Viewport Sizes
- **Mobile**: 375px - 767px (iPhone SE, iPhone 12/13/14, Samsung Galaxy)
- **Tablet**: 768px - 1023px (iPad, iPad Pro)
- **Desktop**: 1024px+ (Standard desktop, large monitors)

### Browsers to Test
- Chrome/Edge (Chromium)
- Safari (iOS and macOS)
- Firefox

## Interactive Features Test Cases

### 1. Table Sorting (Task 7.1)

**Component**: `components/game/GameTable.tsx`

**Test Cases**:
- [ ] **TS-01**: Click column header to sort ascending
  - Expected: Data sorted in ascending order, up arrow visible
  - Devices: All

- [ ] **TS-02**: Click same column header again to sort descending
  - Expected: Data sorted in descending order, down arrow visible
  - Devices: All

- [ ] **TS-03**: Sort numeric columns (scores, yards, etc.)
  - Expected: Numeric sorting (10 comes after 9, not after 1)
  - Devices: All

- [ ] **TS-04**: Sort string columns (player names, positions)
  - Expected: Alphabetical sorting
  - Devices: All

- [ ] **TS-05**: Click non-sortable column header
  - Expected: No sorting occurs, no arrow indicator
  - Devices: All

- [ ] **TS-06**: Table horizontal scroll on mobile
  - Expected: Table scrolls horizontally with visible scrollbar
  - Devices: Mobile only

**Automated Tests**: 15 test cases in `GameTable.test.tsx` ✅

---

### 2. CSV Export (Tasks 7.2, 7.3, 7.4)

**Components**:
- `components/game/ExportButton.tsx`
- `app/api/export/route.ts`
- `lib/export/csv.ts`

**Test Cases**:

#### Export Button UI
- [ ] **EX-01**: Export button visible on game detail page
  - Expected: Button shows "Export CSV" with download icon
  - Devices: All

- [ ] **EX-02**: Dropdown button click shows format options
  - Expected: Dropdown menu appears with 3 options (Full, Metadata, Tables)
  - Devices: All

- [ ] **EX-03**: Click outside dropdown to close
  - Expected: Dropdown closes when clicking backdrop
  - Devices: All

- [ ] **EX-04**: Mobile responsive layout
  - Expected: Button stacks vertically on mobile, dropdown positioned correctly
  - Devices: Mobile

#### Export Functionality
- [ ] **EX-05**: Click "Export CSV" button
  - Expected: File downloads with game data, success toast appears
  - Devices: All

- [ ] **EX-06**: Select "Full Export (CSV)"
  - Expected: Downloads CSV with metadata + all tables
  - Devices: All

- [ ] **EX-07**: Select "Metadata Only (CSV)"
  - Expected: Downloads CSV with only game metadata (score, date, opponent)
  - Devices: All

- [ ] **EX-08**: Select "Tables Only (CSV)"
  - Expected: Downloads CSV with only statistics tables
  - Devices: All

- [ ] **EX-09**: Loading state during export
  - Expected: Button shows "Exporting..." and is disabled
  - Devices: All

- [ ] **EX-10**: Error handling
  - Expected: Error toast shows descriptive message
  - Devices: All

**Automated Tests**: 14 test cases in `ExportButton.test.tsx` ✅
**Automated Tests**: 39 test cases in `csv.test.ts` ✅

---

### 3. Game Comparison Selector (Task 7.5)

**Component**: `components/game/ComparisonSelector.tsx`

**Test Cases**:

#### Selection UI
- [ ] **CS-01**: Checkboxes visible on game list items
  - Expected: "Compare" checkbox on each game card
  - Devices: All

- [ ] **CS-02**: Checkbox click selects game
  - Expected: Checkbox checked, game added to selection
  - Devices: All

- [ ] **CS-03**: Checkbox click deselects game
  - Expected: Checkbox unchecked, game removed from selection
  - Devices: All

- [ ] **CS-04**: Maximum 4 games selectable
  - Expected: Additional checkboxes disabled after 4 selections
  - Devices: All

#### Sticky Bottom Bar
- [ ] **CS-05**: Sticky bar appears when game selected
  - Expected: Bottom bar slides in with animation
  - Devices: All

- [ ] **CS-06**: Selection count updates
  - Expected: "X games selected" text updates correctly
  - Devices: All

- [ ] **CS-07**: Helper text changes based on count
  - Expected: Shows "Select at least 2" / "Ready to compare" / "Maximum 4 reached"
  - Devices: All

- [ ] **CS-08**: Progress indicator fills
  - Expected: Progress bars fill based on selection count (4 total bars)
  - Devices: All

- [ ] **CS-09**: Clear button removes all selections
  - Expected: All checkboxes unchecked, sticky bar disappears
  - Devices: All

- [ ] **CS-10**: Compare button enabled with 2+ games
  - Expected: Button clickable only when 2-4 games selected
  - Devices: All

- [ ] **CS-11**: Mobile responsive layout
  - Expected: Content stacks on mobile, all controls accessible
  - Devices: Mobile

#### URL State Persistence
- [ ] **CS-12**: Selected games sync to URL params
  - Expected: URL updates to `/?compare=slug1,slug2`
  - Devices: All

- [ ] **CS-13**: Reload page preserves selections
  - Expected: Checkboxes remain checked after refresh
  - Devices: All

- [ ] **CS-14**: Share URL with selections
  - Expected: Opening URL auto-selects games from params
  - Devices: All

**Automated Tests**: 22 test cases in `ComparisonSelector.test.tsx` ✅

---

### 4. Comparison Page (Task 7.6)

**Component**: `app/compare/page.tsx`

**Test Cases**:

#### Page Loading
- [ ] **CP-01**: Navigate to `/compare?games=slug1,slug2`
  - Expected: Page loads with 2 game columns
  - Devices: All

- [ ] **CP-02**: 3 games comparison layout
  - Expected: 3-column grid on desktop, stacked on mobile
  - Devices: All

- [ ] **CP-03**: 4 games comparison layout
  - Expected: 4-column grid (2x2 on tablet, stacked on mobile)
  - Devices: All

#### Error Handling
- [ ] **CP-04**: No games parameter
  - Expected: Error page "No games selected for comparison"
  - Devices: All

- [ ] **CP-05**: Only 1 game provided
  - Expected: Error page "Please select at least 2 games"
  - Devices: All

- [ ] **CP-06**: Invalid game slug
  - Expected: Error page "Could not load enough valid games"
  - Devices: All

- [ ] **CP-07**: More than 4 games in URL
  - Expected: Only first 4 games loaded
  - Devices: All

#### Comparison Tables
- [ ] **CP-08**: Score comparison table visible
  - Expected: Table shows Clemson/Opponent scores, point diff, result
  - Devices: All

- [ ] **CP-09**: Highest Clemson score highlighted
  - Expected: Highest score in orange, larger font
  - Devices: All

- [ ] **CP-10**: Point differential color coding
  - Expected: Positive (win) in orange, negative (loss) in purple
  - Devices: All

- [ ] **CP-11**: Quick stats table visible
  - Expected: Shows season, date, location, game type, attendance
  - Devices: All

- [ ] **CP-12**: Highest attendance highlighted
  - Expected: Highest attendance in orange, bold
  - Devices: All

- [ ] **CP-13**: Tables scroll horizontally on mobile
  - Expected: Tables remain readable with horizontal scroll
  - Devices: Mobile

#### Navigation
- [ ] **CP-14**: Breadcrumb navigation works
  - Expected: "Games" link returns to homepage
  - Devices: All

- [ ] **CP-15**: "Back to Games" button works
  - Expected: Returns to homepage
  - Devices: All

- [ ] **CP-16**: "View Full Stats" links work
  - Expected: Navigate to individual game detail pages
  - Devices: All

#### Responsive Design
- [ ] **CP-17**: Desktop layout (1024px+)
  - Expected: 2-4 columns side-by-side, all content visible
  - Devices: Desktop

- [ ] **CP-18**: Tablet layout (768px-1023px)
  - Expected: 2 columns, tables remain readable
  - Devices: Tablet

- [ ] **CP-19**: Mobile layout (375px-767px)
  - Expected: Single column stack, tables scroll, buttons full-width
  - Devices: Mobile

---

## Responsive Component Verification

### Tailwind Breakpoints Used
```css
sm: 640px   /* Small devices */
md: 768px   /* Tablets */
lg: 1024px  /* Desktops */
xl: 1280px  /* Large desktops */
2xl: 1536px /* Extra large desktops */
```

### Key Responsive Classes to Verify

**HomePage** (`app/page.tsx`):
- Grid: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-[300px_1fr]`
- Stats bar: `grid-cols-2 sm:grid-cols-4`

**ComparisonSelector** (`components/game/ComparisonSelector.tsx`):
- Layout: `flex-col sm:flex-row sm:items-center sm:justify-between`
- Clear button text: `hidden sm:inline`

**ComparisonPage** (`app/compare/page.tsx`):
- Grid: `md:grid-cols-2` / `md:grid-cols-3` / `md:grid-cols-2 lg:grid-cols-4`
- Header: `flex-col sm:flex-row sm:items-center sm:justify-between`
- Title: `text-3xl md:text-4xl`

**GameListItem** (`components/game/GameListItem.tsx`):
- Spacing adjustments based on checkbox visibility
- Card padding and margins responsive

---

## Test Execution Checklist

### Automated Tests
- [x] Run `npm test` - All test suites
- [x] GameTable.test.tsx (15 tests)
- [x] ExportButton.test.tsx (14 tests)
- [x] ComparisonSelector.test.tsx (22 tests)
- [x] csv.test.ts (39 tests)

### Build Verification
- [x] Run `npm run build` - Verify SSG build succeeds
- [x] Check for build warnings or errors
- [x] Verify all pages compile correctly

### Manual Testing Required
- [ ] Test on actual mobile device (iOS)
- [ ] Test on actual mobile device (Android)
- [ ] Test on actual tablet device
- [ ] Test on desktop browsers (Chrome, Firefox, Safari)
- [ ] Test keyboard navigation (Tab, Enter, Space, Arrows)
- [ ] Test screen reader compatibility

---

## Known Issues / Notes

1. **Suspense Boundary Added**: Homepage wrapped in Suspense to fix SSG build with `useSearchParams()`
2. **URL State Management**: Comparison selections persist in URL for shareability
3. **Mobile Table Scrolling**: Tables use horizontal scroll on mobile devices
4. **Sticky Positioning**: ComparisonSelector uses `position: sticky` which has good browser support

---

## Test Results Summary

**Date**: 2025-11-12
**Version**: Task 7.7
**Tester**: Automated Testing Suite

### Automated Test Results
```
PASS  components/game/GameTable.test.tsx (15 tests)
PASS  components/game/ExportButton.test.tsx (14 tests)
PASS  components/game/ComparisonSelector.test.tsx (22 tests)
PASS  lib/export/csv.test.ts (39 tests)

Total: 90 tests passing ✅
```

### Build Verification
```
✓ Build completed successfully
✓ All pages generated (SSG + Dynamic)
✓ No TypeScript errors
✓ No build warnings

Routes:
- ○ / (Static with Suspense)
- ● /games/[slug] (SSG)
- ƒ /compare (Dynamic)
- ƒ /api/export (API)
- ƒ /api/games (API)
```

### Manual Testing Status
**Status**: Ready for manual testing on physical devices

**Recommendation**: All automated tests pass. Interactive features are ready for manual device testing by the development team or QA.

---

## Next Steps

After manual testing completion:
1. Document any issues found
2. Fix responsive issues if discovered
3. Proceed to Task 7.8 (Keyboard Navigation)
4. Proceed to Task 7.9 (WCAG 2.1 AA Compliance)
