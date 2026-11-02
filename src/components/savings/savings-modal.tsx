"use client";

import { useState, useEffect } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SavingsGoal } from "@/types";

interface SavingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    target_amount: number; // in cents
    initial_amount?: number; // in cents
    target_date: string;
  }) => Promise<void>;
  goalToEdit?: SavingsGoal | null;
}

export function SavingsModal({
  isOpen,
  onClose,
  onSubmit,
  goalToEdit,
}: SavingsModalProps) {
  const [name, setName] = useState("");
  const [targetInput, setTargetInput] = useState("");
  const [initialInput, setInitialInput] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (goalToEdit) {
      setName(goalToEdit.name);
      setTargetInput((goalToEdit.target_amount / 100).toFixed(2));
      setInitialInput("");
      setTargetDate(goalToEdit.target_date);
    } else {
      setName("");
      setTargetInput("");
      setInitialInput("");
      // Default to 6 months from now
      const d = new Date();
      d.setMonth(d.getMonth() + 6);
      setTargetDate(d.toISOString().split("T")[0]);
    }
    setError(null);
  }, [goalToEdit, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Please provide a name for your savings milestone.");
      return;
    }

    const targetNum = parseFloat(targetInput);
    if (isNaN(targetNum) || targetNum <= 0) {
      setError("Please enter a valid target goal amount greater than zero.");
      return;
    }

    const initialNum = parseFloat(initialInput || "0");
    if (isNaN(initialNum) || initialNum < 0) {
      setError("Initial amount must be a positive number.");
      return;
    }

    if (!targetDate) {
      setError("Please set a target deadline date.");
      return;
    }

    const targetAmountInCents = Math.round(targetNum * 100);
    const initialAmountInCents = Math.round(initialNum * 100);

    setIsSubmitting(true);
    try {
      await onSubmit({
        name: name.trim(),
        target_amount: targetAmountInCents,
        initial_amount: initialAmountInCents,
        target_date: targetDate,
      });
      onClose();
    } catch (err: any) {
      setError(err?.message || "Failed to save savings goal.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={goalToEdit ? "Edit Savings Goal" : "Create New Savings Milestone"}
      description={
        goalToEdit
          ? "Update target amount or completion date"
          : "Define a financial milestone and start saving towards it"
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4 pt-2">
        {error && (
          <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 text-xs">
            {error}
          </div>
        )}

        {/* Goal Name */}
        <Input
          label="Milestone Goal Name"
          placeholder="e.g. Emergency Fund, New Laptop, Japan Trip"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        {/* Target Amount */}
        <Input
          label="Target Amount"
          type="number"
          step="0.01"
          placeholder="5000.00"
          value={targetInput}
          onChange={(e) => setTargetInput(e.target.value)}
          required
        />

        {/* Initial Amount (Only when creating) */}
        {!goalToEdit && (
          <Input
            label="Initial Opening Deposit (Optional)"
            type="number"
            step="0.01"
            placeholder="0.00"
            value={initialInput}
            onChange={(e) => setInitialInput(e.target.value)}
          />
        )}

        {/* Target Date */}
        <Input
          label="Target Date Deadline"
          type="date"
          value={targetDate}
          onChange={(e) => setTargetDate(e.target.value)}
          required
        />

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <Button
            type="submit"
            className="flex-1"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Saving..."
              : goalToEdit
              ? "Update Goal"
              : "Create Goal"}
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
