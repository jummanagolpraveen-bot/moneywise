"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/context/auth-provider";
import { Transaction, TransactionType } from "@/types";

export interface CreateTransactionInput {
  title: string;
  amount: number; // in cents
  type: TransactionType;
  category_id?: string | null;
  transaction_date: string; // YYYY-MM-DD
  payment_method: string;
  description?: string;
}

export function useTransactions() {
  const { user } = useAuth();
  const supabase = createClient();

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactions = useCallback(async () => {
    if (!user) {
      setTransactions([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from("transactions")
        .select(`
          *,
          category:categories(*)
        `)
        .eq("user_id", user.id)
        .order("transaction_date", { ascending: false })
        .order("created_at", { ascending: false });

      if (fetchError) {
        console.warn("Error fetching transactions:", fetchError.message);
        setError(fetchError.message);
      } else {
        setTransactions((data as Transaction[]) || []);
      }
    } catch (err: any) {
      setError(err?.message || "Failed to load transactions.");
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const addTransaction = async (input: CreateTransactionInput) => {
    if (!user) throw new Error("Must be logged in to add transaction.");

    try {
      // If category_id starts with 'def-', set to null to avoid FK constraint error
      const validCategoryId =
        input.category_id && !input.category_id.startsWith("def-")
          ? input.category_id
          : null;

      const { data, error: insertError } = await supabase
        .from("transactions")
        .insert({
          user_id: user.id,
          title: input.title.trim(),
          amount: input.amount,
          type: input.type,
          category_id: validCategoryId,
          transaction_date: input.transaction_date,
          payment_method: input.payment_method,
          description: input.description?.trim() || null,
        })
        .select(`
          *,
          category:categories(*)
        `)
        .single();

      if (insertError) throw insertError;

      if (data) {
        setTransactions((prev) => [data as Transaction, ...prev]);
        return data as Transaction;
      }
    } catch (err: any) {
      console.error("Error creating transaction:", err);
      throw err;
    }
  };

  const updateTransaction = async (
    id: string,
    updates: Partial<CreateTransactionInput>
  ) => {
    if (!user) throw new Error("Must be logged in to update transaction.");

    try {
      const payload: any = {
        updated_at: new Date().toISOString(),
      };
      if (updates.title !== undefined) payload.title = updates.title.trim();
      if (updates.amount !== undefined) payload.amount = updates.amount;
      if (updates.type !== undefined) payload.type = updates.type;
      if (updates.transaction_date !== undefined)
        payload.transaction_date = updates.transaction_date;
      if (updates.payment_method !== undefined)
        payload.payment_method = updates.payment_method;
      if (updates.description !== undefined)
        payload.description = updates.description?.trim() || null;
      if (updates.category_id !== undefined) {
        payload.category_id =
          updates.category_id && !updates.category_id.startsWith("def-")
            ? updates.category_id
            : null;
      }

      const { data, error: updateError } = await supabase
        .from("transactions")
        .update(payload)
        .eq("id", id)
        .eq("user_id", user.id)
        .select(`
          *,
          category:categories(*)
        `)
        .single();

      if (updateError) throw updateError;

      if (data) {
        setTransactions((prev) =>
          prev.map((t) => (t.id === id ? (data as Transaction) : t))
        );
        return data as Transaction;
      }
    } catch (err: any) {
      console.error("Error updating transaction:", err);
      throw err;
    }
  };

  const deleteTransaction = async (id: string) => {
    if (!user) throw new Error("Must be logged in to delete transaction.");

    try {
      const { error: deleteError } = await supabase
        .from("transactions")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id);

      if (deleteError) throw deleteError;

      setTransactions((prev) => prev.filter((t) => t.id !== id));
      return true;
    } catch (err: any) {
      console.error("Error deleting transaction:", err);
      throw err;
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  // Financial calculations
  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalBalance = totalIncome - totalExpenses;
  const totalSavings = Math.max(0, totalBalance);

  return {
    transactions,
    isLoading,
    error,
    refreshTransactions: fetchTransactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    totalIncome,
    totalExpenses,
    totalBalance,
    totalSavings,
  };
}

