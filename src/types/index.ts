// TypeScript type definitions for MoneyWise

export type TransactionType = "income" | "expense";

export type BudgetStatus = "on-track" | "warning" | "exceeded";

export type SavingsGoalStatus = "active" | "completed" | "cancelled";

export interface Transaction {
  id: string;
  user_id: string;
  category_id: string;
  title: string;
  amount: number; // stored in cents
  type: TransactionType;
  transaction_date: string;
  payment_method: string;
  description?: string;
  created_at: string;
  updated_at: string;
  // Joined fields
  category?: Category;
}

export interface Category {
  id: string;
  user_id: string;
  name: string;
  type: TransactionType;
  icon: string;
  color: string;
  is_default: boolean;
  created_at: string;
}

export interface Budget {
  id: string;
  user_id: string;
  category_id: string;
  amount: number; // stored in cents
  month: number;
  year: number;
  name?: string;
  created_at: string;
  updated_at: string;
  // Computed
  spent?: number;
  remaining?: number;
  percentage?: number;
  status?: BudgetStatus;
  category?: Category;
}

export interface SavingsGoal {
  id: string;
  user_id: string;
  name: string;
  target_amount: number; // stored in cents
  current_amount: number; // stored in cents
  target_date: string;
  status: SavingsGoalStatus;
  category?: string;
  description?: string;
  color?: string;
  created_at: string;
  updated_at: string;
  contributions?: SavingsContribution[];
}

export interface SavingsContribution {
  id: string;
  goal_id: string;
  user_id: string;
  amount: number; // stored in cents
  contribution_date: string;
  note?: string;
  created_at: string;
}

export interface Profile {
  id: string;
  full_name: string;
  avatar_url?: string;
  currency: string;
  created_at: string;
  updated_at: string;
}

// Dashboard stats
export interface DashboardStats {
  totalBalance: number;
  totalIncome: number;
  totalExpenses: number;
  totalSavings: number;
}

// Chart data types
export interface MonthlyData {
  month: string;
  income: number;
  expenses: number;
}

export interface CategoryBreakdown {
  name: string;
  value: number;
  color: string;
  percentage: number;
}

// Form types
export interface TransactionFormData {
  title: string;
  amount: string;
  type: TransactionType;
  category_id: string;
  transaction_date: string;
  payment_method: string;
  description?: string;
}

export interface BudgetFormData {
  category_id: string;
  amount: string;
  month: number;
  year: number;
}

export interface SavingsGoalFormData {
  name: string;
  target_amount: string;
  target_date: string;
}

export interface ContributionFormData {
  amount: string;
  contribution_date: string;
  note?: string;
}

