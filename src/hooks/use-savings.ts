"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/context/auth-provider";
import { SavingsGoal, SavingsContribution } from "@/types";

export interface CreateGoalInput {
  name: string;
  target_amount: number; // in cents
  initial_amount?: number; // in cents
  target_date: string; // YYYY-MM-DD
  description?: string;
  category?: string;
  color?: string;
}

export interface AddContributionInput {
  goal_id: string;
  amount: number; // in cents
  contribution_date?: string;
  note?: string;
}

export function useSavings() {
  const { user } = useAuth();
  const supabase = createClient();

  const [goals, setGoals] = useState<SavingsGoal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGoals = useCallback(async () => {
    if (!user) {
      setGoals([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Fetch goals with all contributions ordered
      const { data, error: fetchError } = await supabase
        .from("savings_goals")
        .select(`
          *,
          contributions:savings_contributions(*)
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (fetchError) {
        console.warn("Error fetching savings goals:", fetchError.message);
        setError(fetchError.message);
      } else {
        setGoals((data as SavingsGoal[]) || []);
      }
    } catch (err: any) {
      setError(err?.message || "Failed to load savings goals.");
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Aggregate stats
  const totalSaved = useMemo(() => {
    return goals.reduce((sum, g) => sum + g.current_amount, 0);
  }, [goals]);

  const totalTarget = useMemo(() => {
    return goals.reduce((sum, g) => sum + g.target_amount, 0);
  }, [goals]);

  const overallPercentage =
    totalTarget > 0 ? Math.min(100, Math.round((totalSaved / totalTarget) * 100)) : 0;

  const completedCount = useMemo(() => {
    return goals.filter(
      (g) => g.status === "completed" || g.current_amount >= g.target_amount
    ).length;
  }, [goals]);

  const activeCount = useMemo(() => {
    return goals.filter(
      (g) => g.status === "active" && g.current_amount < g.target_amount
    ).length;
  }, [goals]);

  // Actions
  const createGoal = async (input: CreateGoalInput) => {
    if (!user) throw new Error("Must be logged in to create a savings goal.");

    try {
      const initialAmount = input.initial_amount || 0;

      const { data: newGoal, error: goalError } = await supabase
        .from("savings_goals")
        .insert({
          user_id: user.id,
          name: input.name.trim(),
          target_amount: input.target_amount,
          current_amount: initialAmount,
          target_date: input.target_date,
          status: initialAmount >= input.target_amount ? "completed" : "active",
        })
        .select()
        .single();

      if (goalError) throw goalError;

      // If initial deposit was provided, log a contribution entry
      if (newGoal && initialAmount > 0) {
        await supabase.from("savings_contributions").insert({
          goal_id: newGoal.id,
          user_id: user.id,
          amount: initialAmount,
          contribution_date: new Date().toISOString().split("T")[0],
          note: "Initial opening deposit",
        });
      }

      await fetchGoals();
      return newGoal as SavingsGoal;
    } catch (err: any) {
      console.error("Error creating savings goal:", err);
      throw err;
    }
  };

  const updateGoal = async (id: string, updates: Partial<CreateGoalInput>) => {
    if (!user) throw new Error("Must be logged in to update a savings goal.");

    try {
      const payload: any = {
        updated_at: new Date().toISOString(),
      };
      if (updates.name !== undefined) payload.name = updates.name.trim();
      if (updates.target_amount !== undefined) payload.target_amount = updates.target_amount;
      if (updates.target_date !== undefined) payload.target_date = updates.target_date;

      const { data, error: updateError } = await supabase
        .from("savings_goals")
        .update(payload)
        .eq("id", id)
        .eq("user_id", user.id)
        .select()
        .single();

      if (updateError) throw updateError;

      await fetchGoals();
      return data as SavingsGoal;
    } catch (err: any) {
      console.error("Error updating savings goal:", err);
      throw err;
    }
  };

  const deleteGoal = async (id: string) => {
    if (!user) throw new Error("Must be logged in to delete a savings goal.");

    try {
      const { error: deleteError } = await supabase
        .from("savings_goals")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id);

      if (deleteError) throw deleteError;

      setGoals((prev) => prev.filter((g) => g.id !== id));
      return true;
    } catch (err: any) {
      console.error("Error deleting savings goal:", err);
      throw err;
    }
  };

  const addContribution = async (input: AddContributionInput) => {
    if (!user) throw new Error("Must be logged in to add a contribution.");

    try {
      const dateStr =
        input.contribution_date || new Date().toISOString().split("T")[0];

      const { data: newContrib, error: contribError } = await supabase
        .from("savings_contributions")
        .insert({
          goal_id: input.goal_id,
          user_id: user.id,
          amount: input.amount,
          contribution_date: dateStr,
          note: input.note?.trim() || null,
        })
        .select()
        .single();

      if (contribError) throw contribError;

      // Update goal's current amount in database
      const targetGoal = goals.find((g) => g.id === input.goal_id);
      if (targetGoal) {
        const updatedTotal = targetGoal.current_amount + input.amount;
        const newStatus =
          updatedTotal >= targetGoal.target_amount ? "completed" : targetGoal.status;

        await supabase
          .from("savings_goals")
          .update({
            current_amount: updatedTotal,
            status: newStatus,
            updated_at: new Date().toISOString(),
          })
          .eq("id", input.goal_id)
          .eq("user_id", user.id);
      }

      await fetchGoals();
      return newContrib as SavingsContribution;
    } catch (err: any) {
      console.error("Error adding savings contribution:", err);
      throw err;
    }
  };

  const deleteContribution = async (contributionId: string, goalId: string, amount: number) => {
    if (!user) throw new Error("Must be logged in to delete a contribution.");

    try {
      const { error: deleteError } = await supabase
        .from("savings_contributions")
        .delete()
        .eq("id", contributionId)
        .eq("user_id", user.id);

      if (deleteError) throw deleteError;

      // Reduce goal current_amount
      const targetGoal = goals.find((g) => g.id === goalId);
      if (targetGoal) {
        const updatedTotal = Math.max(0, targetGoal.current_amount - amount);
        const newStatus =
          updatedTotal >= targetGoal.target_amount ? "completed" : "active";

        await supabase
          .from("savings_goals")
          .update({
            current_amount: updatedTotal,
            status: newStatus,
            updated_at: new Date().toISOString(),
          })
          .eq("id", goalId)
          .eq("user_id", user.id);
      }

      await fetchGoals();
      return true;
    } catch (err: any) {
      console.error("Error deleting contribution:", err);
      throw err;
    }
  };

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  return {
    goals,
    totalSaved,
    totalTarget,
    overallPercentage,
    completedCount,
    activeCount,
    isLoading,
    error,
    refreshGoals: fetchGoals,
    createGoal,
    updateGoal,
    deleteGoal,
    addContribution,
    deleteContribution,
  };
}
