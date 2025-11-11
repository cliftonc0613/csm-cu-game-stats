import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines class names with Tailwind merge
 * @param inputs - Class names to merge
 * @returns Merged class names string
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Conditionally applies Clemson brand color classes
 * @param color - 'orange' | 'purple' | 'dark' | 'white'
 * @param type - 'bg' | 'text' | 'border'
 * @returns Tailwind class name
 */
export function clemsonColor(
  color: "orange" | "purple" | "dark" | "white",
  type: "bg" | "text" | "border" = "bg"
): string {
  const colorMap = {
    orange: {
      bg: "bg-clemson-orange",
      text: "text-clemson-orange",
      border: "border-clemson-orange",
    },
    purple: {
      bg: "bg-clemson-purple",
      text: "text-clemson-purple",
      border: "border-clemson-purple",
    },
    dark: {
      bg: "bg-clemson-dark",
      text: "text-clemson-dark",
      border: "border-clemson-dark",
    },
    white: {
      bg: "bg-white",
      text: "text-white",
      border: "border-white",
    },
  };

  return colorMap[color][type];
}

/**
 * Returns alternating Clemson colors for stat cards
 * @param index - Card index
 * @returns Tailwind class names for background and text
 */
export function statCardColors(index: number): {
  bg: string;
  text: string;
} {
  const isOrange = index % 2 === 0;
  return {
    bg: isOrange ? "bg-clemson-orange" : "bg-clemson-purple",
    text: "text-white",
  };
}

/**
 * Conditional class helper for responsive breakpoints
 * @param base - Base classes
 * @param sm - Small breakpoint classes
 * @param md - Medium breakpoint classes
 * @param lg - Large breakpoint classes
 * @param xl - Extra large breakpoint classes
 * @returns Combined responsive class string
 */
export function responsive(
  base?: string,
  sm?: string,
  md?: string,
  lg?: string,
  xl?: string
): string {
  return cn(
    base,
    sm && `sm:${sm}`,
    md && `md:${md}`,
    lg && `lg:${lg}`,
    xl && `xl:${xl}`
  );
}

/**
 * Helper for focus ring styles with Clemson orange
 * @param additionalClasses - Additional classes to include
 * @returns Combined class string with focus styles
 */
export function focusRing(additionalClasses?: string): string {
  return cn(
    "focus:outline-none focus:ring-2 focus:ring-clemson-orange focus:ring-offset-2",
    additionalClasses
  );
}
