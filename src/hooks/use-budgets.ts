"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/context/auth-provider";
import { Budget, BudgetStatus } from "@/types";

export interface CreateBudgetInput {
  category_id: string;
  amount: number; // in cents
  month: number;
  year: number;
  name?: string;
}

export function useBudgets(initialMonth?: number, initialYear?: number) {
  const { user } = useAuth();
  const supabase = createClient();

  const [selectedMonth, setSelectedMonth] = useState<number>(initialMonth ?? 11);
  const [selectedYear, setSelectedYear] = useState<number>(initialYear ?? 2026);

  useEffect(() => {
    if (!initialMonth || !initialYear) {
      const now = new Date();
      if (!initialMonth) setSelectedMonth(now.getMonth() + 1);
      if (!initialYear) setSelectedYear(now.getFullYear());
    }
  }, [initialMonth, initialYear]);

  const [rawBudgets, setRawBudgets] = useState<Budget[]>([]);
  const [monthExpenses, setMonthExpenses] = useState<
    Array<{ amount: number; category_id?: string | null; category_name?: string }>
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBudgetData = useCallback(async () => {
    if (!user) {
      setRawBudgets([]);
      setMonthExpenses([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // 1. Fetch budgets for selected month and year
      const { data: budgetsData, error: budgetsError } = await supabase
        .from("budgets")
        .select(`
          *,
          category:categories(*)
        `)
        .eq("user_id", user.id)
        .eq("month", selectedMonth)
        .eq("year", selectedYear);

      if (budgetsError) {
        console.warn("Error fetching budgets:", budgetsError.message);
        setError(budgetsError.message);
      } else {
        setRawBudgets((budgetsData as Budget[]) || []);
      }

      // 2. Fetch actual expenses for selected month and year to compute accurate spending
      const startStr = `${selectedYear}-${String(selectedMonth).padStart(2, "0")}-01`;
      const lastDay = new Date(selectedYear, selectedMonth, 0).getDate();
      const endStr = `${selectedYear}-${String(selectedMonth).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`;

      const { data: expensesData, error: expensesError } = await supabase
        .from("transactions")
        .select(`
          amount,
          category_id,
          category:categories(name)
        `)
        .eq("user_id", user.id)
        .eq("type", "expense")
        .gte("transaction_date", startStr)
        .lte("transaction_date", endStr);

      if (!expensesError && expensesData) {
        const flattened = expensesData.map((tx: any) => ({
          amount: Number(tx.amount || 0),
          category_id: tx.category_id,
          category_name: tx.category?.name,
        }));
        setMonthExpenses(flattened);
      }
    } catch (err: any) {
      setError(err?.message || "Failed to load budget data.");
    } finally {
      setIsLoading(false);
    }
  }, [user, selectedMonth, selectedYear]);

  // Compute live budget status per category
  const budgets: Budget[] = useMemo(() => {
    return rawBudgets.map((b) => {
      // Find all expenses matching this budget's category
      const spent = monthExpenses
        .filter(
          (tx) =>
            (tx.category_id && tx.category_id === b.category_id) ||
            (tx.category_name && b.category?.name && tx.category_name === b.category.name)
        )
        .reduce((sum, tx) => sum + tx.amount, 0);

      const remaining = b.amount - spent;
      const percentage = b.amount > 0 ? Math.round((spent / b.amount) * 100) : 0;

      let status: BudgetStatus = "on-track";
      if (percentage >= 100) {
        status = "exceeded";
      } else if (percentage >= 80) {
        status = "warning";
      }

      return {
        ...b,
        spent,
        remaining,
        percentage,
        status,
      };
    });
  }, [rawBudgets, monthExpenses]);

  // Global calculations
  const totalBudgeted = useMemo(() => {
    return budgets.reduce((sum, b) => sum + b.amount, 0);
  }, [budgets]);

  const totalSpent = useMemo(() => {
    return budgets.reduce((sum, b) => sum + (b.spent || 0), 0);
  }, [budgets]);

  const totalRemaining = totalBudgeted - totalSpent;
  const overallPercentage =
    totalBudgeted > 0 ? Math.round((totalSpent / totalBudgeted) * 100) : 0;

  const exceededCount = useMemo(() => {
    return budgets.filter((b) => b.status === "exceeded").length;
  }, [budgets]);

  const warningCount = useMemo(() => {
    return budgets.filter((b) => b.status === "warning").length;
  }, [budgets]);

  // Actions
  const createBudget = async (input: CreateBudgetInput) => {
    if (!user) throw new Error("Must be logged in to create a budget.");

    try {
      const { data, error: insertError } = await supabase
        .from("budgets")
        .insert({
          user_id: user.id,
          category_id: input.category_id,
          amount: input.amount,
          month: input.month,
          year: input.year,
        })
        .select(`
          *,
          category:categories(*)
        `)
        .single();

      if (insertError) throw insertError;

      if (data) {
        await fetchBudgetData();
        return data as Budget;
      }
    } catch (err: any) {
      console.error("Error creating budget:", err);
      throw err;
    }
  };

  const updateBudget = async (id: string, updates: Partial<CreateBudgetInput>) => {
    if (!user) throw new Error("Must be logged in to update a budget.");

    try {
      const payload: any = {
        updated_at: new Date().toISOString(),
      };
      if (updates.amount !== undefined) payload.amount = updates.amount;
      if (updates.category_id !== undefined) payload.category_id = updates.category_id;
      if (updates.month !== undefined) payload.month = updates.month;
      if (updates.year !== undefined) payload.year = updates.year;

      const { data, error: updateError } = await supabase
        .from("budgets")
        .update(payload)
        .eq("id", id)
        .eq("user_id", user.id)
        .select(`
          *,
          category:categories(*)
        `)
        .single();

      if (updateError) throw updateError;

      await fetchBudgetData();
      return data as Budget;
    } catch (err: any) {
      console.error("Error updating budget:", err);
      throw err;
    }
  };

  const deleteBudget = async (id: string) => {
    if (!user) throw new Error("Must be logged in to delete a budget.");

    try {
      const { error: deleteError } = await supabase
        .from("budgets")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id);

      if (deleteError) throw deleteError;

      setRawBudgets((prev) => prev.filter((b) => b.id !== id));
      return true;
    } catch (err: any) {
      console.error("Error deleting budget:", err);
      throw err;
    }
  };

  useEffect(() => {
    fetchBudgetData();
  }, [fetchBudgetData]);

  return {
    budgets,
    totalBudgeted,
    totalSpent,
    totalRemaining,
    overallPercentage,
    exceededCount,
    warningCount,
    selectedMonth,
    setSelectedMonth,
    selectedYear,
    setSelectedYear,
    isLoading,
    error,
    refreshBudgets: fetchBudgetData,
    createBudget,
    updateBudget,
    deleteBudget,
  };
}
