# Keyboard Navigation Guide

This document outlines the keyboard shortcuts and navigation patterns implemented for accessibility in the Clemson Sports Statistics website.

## General Navigation

### Standard Browser Navigation
- **Tab**: Move focus to next interactive element
- **Shift + Tab**: Move focus to previous interactive element
- **Enter**: Activate focused button or link
- **Space**: Activate focused button or toggle focused checkbox

## Component-Specific Keyboard Shortcuts

### 1. GameTable - Sortable Tables

**Location**: `/games/[slug]` - Statistics tables

**Keyboard Shortcuts**:
- **Tab**: Navigate between sortable column headers
- **Enter** or **Space**: Sort by the focused column
  - First press: Sort ascending
  - Second press: Sort descending
  - Toggle between ascending/descending with each activation

**Visual Indicators**:
- Focus ring (orange) appears around focused column header
- Sort direction indicated by arrow icons:
  - ↑ Ascending
  - ↓ Descending
  - ↕ Unsorted

**ARIA Attributes**:
- `role="button"` on sortable headers
- `aria-sort="ascending"` or `aria-sort="descending"` on active sort column
- `tabindex="0"` on sortable headers

---

### 2. ExportButton - CSV Export Dropdown

**Location**: `/games/[slug]` - Export button in header

**Keyboard Shortcuts**:

#### Opening/Closing Dropdown
- **Tab**: Focus main Export button or dropdown trigger
- **Enter** or **Space**: Toggle dropdown menu
- **Escape**: Close dropdown menu

#### Navigating Dropdown Menu
When dropdown is open:
- **Arrow Down (↓)**: Move to next export option (wraps to first)
- **Arrow Up (↑)**: Move to previous export option (wraps to last)
- **Enter**: Select focused export option and start download
- **Tab**: Close dropdown and move to next focusable element
- **Shift + Tab**: Close dropdown and move to previous focusable element

**Export Options**:
1. **Full Export (CSV)** - Complete game data with all statistics
2. **Metadata Only (CSV)** - Game information without detailed stats
3. **Tables Only (CSV)** - Statistics tables without metadata

**Visual Indicators**:
- Focus ring (orange) on main export button
- Background highlight (gray) on focused dropdown item
- Inset focus ring on dropdown items

**Behavior**:
- Dropdown auto-focuses first item when opened
- Arrow keys cycle through options
- Escape closes dropdown without taking action

---

### 3. ComparisonSelector - Game Comparison

**Location**: `/` (Homepage) - Sticky bottom bar

**Keyboard Shortcuts**:

#### Selecting Games
- **Tab**: Navigate to comparison checkboxes on game cards
- **Space**: Toggle game selection (check/uncheck)
  - Maximum 4 games can be selected
  - Minimum 2 games required for comparison
  - Checkboxes disabled when maximum reached

#### Comparison Actions
- **Tab**: Navigate to Clear button or Compare button
- **Enter**: Activate focused button
  - **Clear**: Remove all selected games
  - **Compare**: Navigate to comparison page (requires 2-4 games)

**Visual Indicators**:
- Orange focus ring on checkboxes
- Orange focus ring on Clear button
- Orange focus ring on Compare button
- Progress indicator shows selection count (1-4 bars)
- Helper text updates based on selection state:
  - "Select at least 2 games to compare"
  - "Ready to compare"
  - "Maximum 4 games reached"

**URL State**:
- Selected games stored in URL parameter: `?compare=slug1,slug2`
- Selections persist across page reloads
- Shareable comparison links

---

### 4. Comparison Page - Side-by-Side View

**Location**: `/compare?games=slug1,slug2,slug3`

**Keyboard Navigation**:
- **Tab**: Navigate through:
  - Breadcrumb links
  - "Back to Games" button
  - "View Full Stats" links for each game
- **Enter**: Activate focused link/button
- **Shift + Tab**: Navigate backwards

**Focus Indicators**:
- Orange focus rings on all interactive elements
- Consistent focus styling across all links and buttons

---

## Focus Management Best Practices

### Focus Indicators
All interactive elements display clear visual focus indicators:
- **Orange ring** (`ring-clemson-orange`) for primary interactive elements
- **2px width** for good visibility
- **2px offset** to prevent overlap with element borders
- High contrast ratios for WCAG 2.1 AA compliance

### Focus Order
- Logical top-to-bottom, left-to-right tab order
- No keyboard traps (users can always Tab away)
- Skip links available for long content (future enhancement)

### Focus Restoration
- Dropdown menus auto-focus first item when opened
- Focus returns to trigger button when dropdown closes via Escape
- Modal dialogs trap focus within modal (future enhancement)

---

## Accessibility Features

### ARIA Roles and Attributes

**GameTable**:
- `role="button"` on sortable headers
- `aria-sort` indicates current sort state
- `tabindex="0"` makes headers keyboard accessible

**ExportButton Dropdown**:
- `role="menu"` on dropdown container
- `role="menuitem"` on each export option
- `aria-expanded` on dropdown trigger button
- `aria-label` for screen reader context

**ComparisonSelector**:
- `aria-label` on checkboxes describes purpose
- `aria-label` on action buttons
- Disabled state properly conveyed to screen readers

### Screen Reader Announcements

**Dynamic Content**:
- Success messages announced when export completes
- Error messages announced when export fails
- Selection count updates announced when toggling games
- Sort direction changes announced

**State Changes**:
- Buttons properly indicate disabled state
- Checkboxes announce checked/unchecked state
- Dropdown announces expanded/collapsed state

---

## Testing Keyboard Navigation

### Manual Testing Checklist

#### Basic Keyboard Access
- [ ] All interactive elements reachable via Tab key
- [ ] Tab order follows visual layout
- [ ] Focus indicators visible on all elements
- [ ] Shift+Tab reverses tab order correctly

#### Component-Specific Tests
- [ ] Table headers sort on Enter/Space
- [ ] Dropdown opens/closes with keyboard
- [ ] Arrow keys navigate dropdown options
- [ ] Escape closes dropdown
- [ ] Checkboxes toggle with Space
- [ ] Compare button activates with Enter

#### Screen Reader Testing
- [ ] Test with NVDA (Windows)
- [ ] Test with JAWS (Windows)
- [ ] Test with VoiceOver (macOS/iOS)
- [ ] Test with TalkBack (Android)

---

## Browser Compatibility

Keyboard navigation tested and working in:
- ✅ Chrome/Edge (Chromium)
- ✅ Firefox
- ✅ Safari (macOS)
- ✅ Safari (iOS)

---

## Future Enhancements

Planned keyboard navigation improvements:
1. **Skip Links**: Jump to main content, bypass navigation
2. **Search Bar**: Implement typeahead/autocomplete keyboard navigation
3. **Filter Panel**: Arrow key navigation for filter chips
4. **Modal Dialogs**: Focus trap and Escape to close
5. **Keyboard Shortcuts Panel**: Display help overlay with `?` key

---

## Related Documentation

- [TESTING.md](./TESTING.md) - Interactive features testing plan
- [WCAG 2.1 AA Compliance](#) - Accessibility compliance documentation (Task 7.9)

---

## Implementation Details

### Code Locations

**GameTable Keyboard Support**:
- File: `components/game/GameTable.tsx`
- Lines: 201-215
- Features: Enter/Space for sorting, aria-sort, role=button

**ExportButton Keyboard Support**:
- File: `components/game/ExportButton.tsx`
- Lines: 125-171
- Features: Escape to close, Arrow key navigation, auto-focus

**ComparisonSelector Focus Indicators**:
- File: `components/game/ComparisonSelector.tsx`
- Lines: 243-247
- Features: Enhanced Clear button focus ring

### CSS Classes Used

**Focus Indicators**:
```css
focus:outline-none focus:ring-2 focus:ring-clemson-orange focus:ring-offset-2
```

**Dropdown Item Focus**:
```css
focus:outline-none focus:bg-gray-100 focus:ring-2 focus:ring-inset focus:ring-clemson-orange
```

**Button Focus**:
```css
focus:outline-none focus:ring-2 focus:ring-clemson-orange focus:ring-offset-2
```

---

Last Updated: 2025-11-12 (Task 7.8)
