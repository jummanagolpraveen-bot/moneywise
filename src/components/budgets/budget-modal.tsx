"use client";

import { useState, useEffect } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Budget } from "@/types";
import { useCategories } from "@/hooks/use-categories";

interface BudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    category_id: string;
    amount: number; // in cents
    month: number;
    year: number;
  }) => Promise<void>;
  budgetToEdit?: Budget | null;
  defaultMonth?: number;
  defaultYear?: number;
}

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export function BudgetModal({
  isOpen,
  onClose,
  onSubmit,
  budgetToEdit,
  defaultMonth,
  defaultYear,
}: BudgetModalProps) {
  const { categories } = useCategories();
  const expenseCategories = categories.filter((c) => c.type === "expense");

  const [categoryId, setCategoryId] = useState("");
  const [amountInput, setAmountInput] = useState("");
  const [month, setMonth] = useState<number>(defaultMonth || 11);
  const [year, setYear] = useState<number>(defaultYear || 2026);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (budgetToEdit) {
      setCategoryId(budgetToEdit.category_id);
      setAmountInput((budgetToEdit.amount / 100).toFixed(2));
      setMonth(budgetToEdit.month);
      setYear(budgetToEdit.year);
    } else {
      setCategoryId(expenseCategories[0]?.id || "");
      setAmountInput("");
      setMonth(defaultMonth || new Date().getMonth() + 1);
      setYear(defaultYear || new Date().getFullYear());
    }
    setError(null);
  }, [budgetToEdit, isOpen, expenseCategories, defaultMonth, defaultYear]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!categoryId) {
      setError("Please choose an expense category for this budget.");
      return;
    }

    const num = parseFloat(amountInput);
    if (isNaN(num) || num <= 0) {
      setError("Please enter a valid monthly limit greater than zero.");
      return;
    }

    const amountInCents = Math.round(num * 100);

    setIsSubmitting(true);
    try {
      await onSubmit({
        category_id: categoryId,
        amount: amountInCents,
        month,
        year,
      });
      onClose();
    } catch (err: any) {
      if (err?.code === "23505" || err?.message?.includes("unique")) {
        setError("A budget already exists for this category in the selected month.");
      } else {
        setError(err?.message || "Failed to save budget.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={budgetToEdit ? "Edit Category Budget" : "Set Monthly Budget"}
      description={
        budgetToEdit
          ? "Update spending cap for this category"
          : "Define maximum planned spending limit for a specific category"
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4 pt-2">
        {error && (
          <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 text-xs">
            {error}
          </div>
        )}

        {/* Category */}
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-foreground">
            Expense Category
          </label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            disabled={!!budgetToEdit}
            className="w-full rounded-xl border border-border bg-input-bg px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-70"
          >
            {expenseCategories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          {budgetToEdit && (
            <p className="text-[11px] text-foreground-muted">
              Category cannot be changed on an existing budget.
            </p>
          )}
        </div>

        {/* Amount */}
        <Input
          label="Monthly Spending Limit"
          type="number"
          step="0.01"
          placeholder="0.00"
          value={amountInput}
          onChange={(e) => setAmountInput(e.target.value)}
          required
        />

        {/* Month & Year */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-foreground">
              Month
            </label>
            <select
              value={month}
              onChange={(e) => setMonth(Number(e.target.value))}
              disabled={!!budgetToEdit}
              className="w-full rounded-xl border border-border bg-input-bg px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-70"
            >
              {MONTH_NAMES.map((name, idx) => (
                <option key={name} value={idx + 1}>
                  {name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-foreground">
              Year
            </label>
            <select
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              disabled={!!budgetToEdit}
              className="w-full rounded-xl border border-border bg-input-bg px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-70"
            >
              {[2025, 2026, 2027, 2028].map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <Button
            type="submit"
            className="flex-1"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Saving..."
              : budgetToEdit
              ? "Update Budget"
              : "Create Budget"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
}
