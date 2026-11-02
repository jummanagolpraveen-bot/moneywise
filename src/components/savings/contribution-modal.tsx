"use client";

import { useState, useEffect } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SavingsGoal } from "@/types";

interface ContributionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    goal_id: string;
    amount: number; // in cents
    contribution_date: string;
    note?: string;
  }) => Promise<void>;
  goal: SavingsGoal | null;
}

export function ContributionModal({
  isOpen,
  onClose,
  onSubmit,
  goal,
}: ContributionModalProps) {
  const [amountInput, setAmountInput] = useState("");
  const [date, setDate] = useState("");
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setAmountInput("");
    setDate(new Date().toISOString().split("T")[0]);
    setNote("");
    setError(null);
  }, [isOpen, goal]);

  if (!goal) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const num = parseFloat(amountInput);
    if (isNaN(num) || num <= 0) {
      setError("Please enter a valid deposit amount greater than zero.");
      return;
    }

    const amountInCents = Math.round(num * 100);

    setIsSubmitting(true);
    try {
      await onSubmit({
        goal_id: goal.id,
        amount: amountInCents,
        contribution_date: date || new Date().toISOString().split("T")[0],
        note: note.trim() || undefined,
      });
      onClose();
    } catch (err: any) {
      setError(err?.message || "Failed to record contribution.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Deposit into "${goal.name}"`}
      description="Add funds to increase your savings progress on this goal"
    >
      <form onSubmit={handleSubmit} className="space-y-4 pt-2">
        {error && (
          <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 text-xs">
            {error}
          </div>
        )}

        <Input
          label="Deposit Amount"
          type="number"
          step="0.01"
          placeholder="0.00"
          value={amountInput}
          onChange={(e) => setAmountInput(e.target.value)}
          required
        />

        <Input
          label="Deposit Date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />

        <Input
          label="Note (Optional)"
          placeholder="e.g. Monthly allocation, bonus split..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />

        <div className="flex gap-3 pt-4">
          <Button
            type="submit"
            variant="secondary"
            className="flex-1"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Recording..." : "Record Deposit"}
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
