// App-wide constants for MoneyWise

export const APP_NAME = "MoneyWise";
export const APP_TAGLINE = "Take Control of Your Money";
export const APP_DESCRIPTION =
  "A premium personal finance tracker that helps you understand where your money goes, track income and expenses, manage budgets, and achieve your savings goals.";

// Default expense categories with icons and colors
export const EXPENSE_CATEGORIES = [
  { name: "Food", icon: "UtensilsCrossed", color: "#f97316" },
  { name: "Transportation", icon: "Car", color: "#3b82f6" },
  { name: "Shopping", icon: "ShoppingBag", color: "#ec4899" },
  { name: "Education", icon: "GraduationCap", color: "#8b5cf6" },
  { name: "Entertainment", icon: "Gamepad2", color: "#06b6d4" },
  { name: "Rent", icon: "Home", color: "#14b8a6" },
  { name: "Bills", icon: "Receipt", color: "#f59e0b" },
  { name: "Healthcare", icon: "Heart", color: "#ef4444" },
  { name: "Travel", icon: "Plane", color: "#6366f1" },
  { name: "Other", icon: "MoreHorizontal", color: "#64748b" },
] as const;

// Default income categories
export const INCOME_CATEGORIES = [
  { name: "Salary", icon: "Briefcase", color: "#10b981" },
  { name: "Freelancing", icon: "Laptop", color: "#3b82f6" },
  { name: "Business", icon: "Building2", color: "#8b5cf6" },
  { name: "Pocket Money", icon: "Wallet", color: "#f97316" },
  { name: "Scholarships", icon: "Award", color: "#06b6d4" },
  { name: "Other", icon: "MoreHorizontal", color: "#64748b" },
] as const;

// Payment methods
export const PAYMENT_METHODS = [
  "Cash",
  "Credit Card",
  "Debit Card",
  "UPI",
  "Bank Transfer",
  "Net Banking",
  "Wallet",
  "Other",
] as const;

// Supported currencies
export const CURRENCIES = [
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "INR", symbol: "₹", name: "Indian Rupee" },
] as const;

// Date filter options
export const DATE_FILTERS = [
  { label: "This Week", value: "this-week" },
  { label: "This Month", value: "this-month" },
  { label: "Last Month", value: "last-month" },
  { label: "This Year", value: "this-year" },
  { label: "All Time", value: "all-time" },
  { label: "Custom Date Range", value: "custom" },
] as const;

// Dashboard navigation items
export const NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: "LayoutDashboard" },
  { label: "Transactions", href: "/transactions", icon: "ArrowLeftRight" },
  { label: "Income", href: "/income", icon: "TrendingUp" },
  { label: "Expenses", href: "/expenses", icon: "TrendingDown" },
  { label: "Budgets", href: "/budgets", icon: "PiggyBank" },
  { label: "Savings", href: "/savings", icon: "Target" },
  { label: "Analytics", href: "/analytics", icon: "BarChart3" },
  { label: "Settings", href: "/settings", icon: "Settings" },
] as const;

// Chart colors
export const CHART_COLORS = [
  "#3c5fa0",
  "#10b981",
  "#f97316",
  "#ec4899",
  "#8b5cf6",
  "#06b6d4",
  "#f59e0b",
  "#ef4444",
  "#14b8a6",
  "#6366f1",
];

