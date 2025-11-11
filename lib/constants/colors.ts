/**
 * Clemson brand colors and utility functions
 * Official Clemson University brand colors for athletics and branding
 */

// Primary brand colors
export const CLEMSON_COLORS = {
  orange: '#F56600',
  purple: '#522D80',
  dark: '#333333',
  white: '#FFFFFF',
} as const;

// Color usage contexts
export const STAT_CARD_COLORS = {
  primary: CLEMSON_COLORS.orange,
  secondary: CLEMSON_COLORS.purple,
} as const;

// Chart colors for data visualization
export const CHART_COLORS = {
  clemson: CLEMSON_COLORS.orange,
  opponent: CLEMSON_COLORS.purple,
  neutral: CLEMSON_COLORS.dark,
} as const;

// Score comparison colors
export const SCORE_COLORS = {
  win: CLEMSON_COLORS.orange,
  loss: CLEMSON_COLORS.purple,
} as const;

/**
 * Type for Clemson color keys
 */
export type ClemsonColorKey = keyof typeof CLEMSON_COLORS;

/**
 * Get alternating stat card background color
 * @param index - The index of the card in the grid
 * @returns The appropriate color (orange or purple)
 */
export function getStatCardColor(index: number): string {
  return index % 2 === 0 ? STAT_CARD_COLORS.primary : STAT_CARD_COLORS.secondary;
}

/**
 * Get color based on game result
 * @param isWin - Whether the game was a win
 * @returns The appropriate color (orange for win, purple for loss)
 */
export function getResultColor(isWin: boolean): string {
  return isWin ? SCORE_COLORS.win : SCORE_COLORS.loss;
}

/**
 * Convert hex color to RGB values
 * @param hex - Hex color string (e.g., '#F56600')
 * @returns Object with r, g, b values
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

/**
 * Add transparency to a hex color
 * @param hex - Hex color string
 * @param alpha - Alpha value (0-1)
 * @returns RGBA color string
 */
export function addAlpha(hex: string, alpha: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
}
