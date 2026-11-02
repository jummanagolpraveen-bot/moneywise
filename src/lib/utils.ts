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
 * Clamp a number between min and max.
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

