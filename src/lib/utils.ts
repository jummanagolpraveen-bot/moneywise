// Utility functions for MoneyWise

import { clsx, type ClassValue } from "clsx";

/**
 * Merge Tailwind CSS class names safely (resolves conflicts).
 * Uses clsx for conditional classes.
 */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

/**
 * Format a number (in cents) as currency.
 * Example: formatCurrency(255000) → "$2,550.00"
 */
export function formatCurrency(
  amountInCents: number,
  currency: string = "USD"
): string {
  const amount = amountInCents / 100;

  const currencyConfig: Record<string, { locale: string; code: string }> = {
    USD: { locale: "en-US", code: "USD" },
    INR: { locale: "en-IN", code: "INR" },
  };

  const config = currencyConfig[currency] || currencyConfig.USD;

  return new Intl.NumberFormat(config.locale, {
    style: "currency",
    currency: config.code,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Format a date string as DD/MM/YYYY
 */
export function formatDate(date: string | Date): string {
  const d = new Date(date);
  const day = d.getDate().toString().padStart(2, "0");
  const month = (d.getMonth() + 1).toString().padStart(2, "0");
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

/**
 * Format a date as a relative string (e.g., "Today", "Yesterday", "3 days ago")
 */
export function formatRelativeDate(date: string | Date): string {
  const d = new Date(date);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return formatDate(date);
}

/**
 * Get the percentage of a value relative to a total.
 */
export function getPercentage(value: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
}

/**
 * Parse YYYY-MM-DD string into local midnight Date to avoid timezone shift.
 */
export function parseDateOnly(dateStr: string): Date {
  const parts = dateStr.split("-").map(Number);
  if (parts.length === 3) {
    return new Date(parts[0], parts[1] - 1, parts[2], 0, 0, 0, 0);
  }
  return new Date(dateStr);
}

/**
 * Get start and end date bounds for a given filter.
 */
export function getDateRangeBounds(
  filterType: string,
  customStart?: string,
  customEnd?: string
): { start: Date; end: Date } | null {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();
  const currentDate = now.getDate();

  if (filterType === "this-week") {
    // Current week: from Monday to Sunday
    const day = now.getDay();
    const diffToMonday = (day === 0 ? -6 : 1) - day;
    const start = new Date(currentYear, currentMonth, currentDate + diffToMonday, 0, 0, 0, 0);
    const end = new Date(currentYear, currentMonth, start.getDate() + 6, 23, 59, 59, 999);
    return { start, end };
  }

  if (filterType === "this-month") {
    const start = new Date(currentYear, currentMonth, 1, 0, 0, 0, 0);
    const end = new Date(currentYear, currentMonth + 1, 0, 23, 59, 59, 999);
    return { start, end };
  }

  if (filterType === "last-month") {
    const start = new Date(currentYear, currentMonth - 1, 1, 0, 0, 0, 0);
    const end = new Date(currentYear, currentMonth, 0, 23, 59, 59, 999);
    return { start, end };
  }

  if (filterType === "this-year") {
    const start = new Date(currentYear, 0, 1, 0, 0, 0, 0);
    const end = new Date(currentYear, 11, 31, 23, 59, 59, 999);
    return { start, end };
  }

  if (filterType === "custom" && customStart && customEnd) {
    const start = parseDateOnly(customStart);
    const end = parseDateOnly(customEnd);
    end.setHours(23, 59, 59, 999);
    return { start, end };
  }

  // All time
  return null;
}

/**
 * Get equivalent previous period bounds to calculate trend percentage.
 */
export function getPreviousPeriodBounds(
  filterType: string,
  currentBounds: { start: Date; end: Date } | null
): { start: Date; end: Date } | null {
  if (!currentBounds) return null;

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  if (filterType === "this-week") {
    const start = new Date(currentBounds.start);
    start.setDate(start.getDate() - 7);
    const end = new Date(currentBounds.end);
    end.setDate(end.getDate() - 7);
    return { start, end };
  }

  if (filterType === "this-month") {
    const start = new Date(currentYear, currentMonth - 1, 1, 0, 0, 0, 0);
    const end = new Date(currentYear, currentMonth, 0, 23, 59, 59, 999);
    return { start, end };
  }

  if (filterType === "last-month") {
    const start = new Date(currentYear, currentMonth - 2, 1, 0, 0, 0, 0);
    const end = new Date(currentYear, currentMonth - 1, 0, 23, 59, 59, 999);
    return { start, end };
  }

  if (filterType === "this-year") {
    const start = new Date(currentYear - 1, 0, 1, 0, 0, 0, 0);
    const end = new Date(currentYear - 1, 11, 31, 23, 59, 59, 999);
    return { start, end };
  }

  // Duration in ms for custom ranges
  const duration = currentBounds.end.getTime() - currentBounds.start.getTime();
  const end = new Date(currentBounds.start.getTime() - 1);
  const start = new Date(end.getTime() - duration);
  return { start, end };
}


