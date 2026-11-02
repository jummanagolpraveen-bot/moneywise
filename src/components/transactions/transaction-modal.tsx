"use client";

import { useState, useEffect } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Transaction, TransactionType } from "@/types";
import { PAYMENT_METHODS } from "@/lib/constants";
import { useCategories } from "@/hooks/use-categories";
import { Plus } from "lucide-react";

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    amount: number; // in cents
    type: TransactionType;
    category_id?: string | null;
    transaction_date: string;
    payment_method: string;
    description?: string;
  }) => Promise<void>;
  transactionToEdit?: Transaction | null;
}

export function TransactionModal({
  isOpen,
  onClose,
  onSubmit,
  transactionToEdit,
}: TransactionModalProps) {
  const { categories, addCategory } = useCategories();

  const [title, setTitle] = useState("");
  const [amountInput, setAmountInput] = useState("");
  const [type, setType] = useState<TransactionType>("expense");
  const [categoryId, setCategoryId] = useState<string>("");
  const [date, setDate] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Custom Category State
  const [showNewCatInput, setShowNewCatInput] = useState(false);
  const [newCatName, setNewCatName] = useState("");

  const filteredCategories = categories.filter((c) => c.type === type);

  useEffect(() => {
    if (transactionToEdit) {
      setTitle(transactionToEdit.title);
      setAmountInput((transactionToEdit.amount / 100).toFixed(2));
      setType(transactionToEdit.type);
      setCategoryId(transactionToEdit.category_id || "");
      setDate(transactionToEdit.transaction_date);
      setPaymentMethod(transactionToEdit.payment_method || "Cash");
      setDescription(transactionToEdit.description || "");
    } else {
      // Default new entry
      setTitle("");
      setAmountInput("");
      setType("expense");
      setDate(new Date().toISOString().split("T")[0]);
      setPaymentMethod("Cash");
      setDescription("");
      if (filteredCategories.length > 0) {
        setCategoryId(filteredCategories[0].id);
      }
    }
    setError(null);
    setShowNewCatInput(false);
  }, [transactionToEdit, isOpen]);

  // When type changes, adjust default category
  const handleTypeChange = (newType: TransactionType) => {
    setType(newType);
    const available = categories.filter((c) => c.type === newType);
    if (available.length > 0) {
      setCategoryId(available[0].id);
    } else {
      setCategoryId("");
    }
  };

  const handleCreateCategory = async () => {
    if (!newCatName.trim()) return;
    const created = await addCategory(newCatName.trim(), type);
    if (created) {
      setCategoryId(created.id);
      setNewCatName("");
      setShowNewCatInput(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError("Please provide a title for the transaction.");
      return;
    }

    const numericAmount = parseFloat(amountInput);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      setError("Please enter a valid amount greater than zero.");
      return;
    }

    // Convert decimal to cents safely without floating point distortion
    const amountInCents = Math.round(numericAmount * 100);

    setIsSubmitting(true);
    try {
      await onSubmit({
        title: title.trim(),
        amount: amountInCents,
        type,
        category_id: categoryId || null,
        transaction_date: date || new Date().toISOString().split("T")[0],
        payment_method: paymentMethod,
        description: description.trim() || undefined,
      });
      onClose();
    } catch (err: any) {
      setError(err?.message || "Failed to save transaction.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={transactionToEdit ? "Edit Transaction" : "New Transaction"}
      description={
        transactionToEdit
          ? "Update details of this financial record"
          : "Add an income or expense transaction to your records"
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4 pt-2">
        {error && (
          <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 text-xs">
            {error}
          </div>
        )}

        {/* Type Toggle */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-input-bg rounded-xl">
          <button
            type="button"
            onClick={() => handleTypeChange("expense")}
            className={`py-2 text-sm font-semibold rounded-lg transition-all cursor-pointer ${
              type === "expense"
                ? "bg-red-500 text-white shadow-sm"
                : "text-foreground-muted hover:text-foreground"
            }`}
          >
            Expense
          </button>
          <button
            type="button"
            onClick={() => handleTypeChange("income")}
            className={`py-2 text-sm font-semibold rounded-lg transition-all cursor-pointer ${
              type === "income"
                ? "bg-emerald-500 text-white shadow-sm"
                : "text-foreground-muted hover:text-foreground"
            }`}
          >
            Income
          </button>
        </div>

        {/* Title */}
        <Input
          label="Transaction Title"
          placeholder="e.g. Monthly Salary, Groceries, Dinner"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        {/* Amount */}
        <Input
          label="Amount"
          type="number"
          step="0.01"
          placeholder="0.00"
          value={amountInput}
          onChange={(e) => setAmountInput(e.target.value)}
          required
        />

        {/* Category & New Category Toggle */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-foreground">
              Category
            </label>
            <button
              type="button"
              onClick={() => setShowNewCatInput(!showNewCatInput)}
              className="text-xs text-navy-600 dark:text-navy-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3 h-3" />
              {showNewCatInput ? "Select Existing" : "Custom Category"}
            </button>
          </div>

          {showNewCatInput ? (
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="New category name"
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                className="flex-1 rounded-xl border border-border bg-input-bg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <Button
                type="button"
                size="sm"
                onClick={handleCreateCategory}
                disabled={!newCatName.trim()}
              >
                Create
              </Button>
            </div>
          ) : (
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full rounded-xl border border-border bg-input-bg px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">Uncategorized</option>
              {filteredCategories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Date & Payment Method */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-foreground">
              Payment Method
            </label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full rounded-xl border border-border bg-input-bg px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {PAYMENT_METHODS.map((pm) => (
                <option key={pm} value={pm}>
                  {pm}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Description */}
        <Input
          label="Notes / Description (Optional)"
          placeholder="Receipt notes, invoice ref, etc."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        {/* Form Actions */}
        <div className="flex gap-3 pt-4">
          <Button
            type="submit"
            className="flex-1"
            variant={type === "expense" ? "danger" : "secondary"}
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Saving..."
              : transactionToEdit
              ? "Update Transaction"
              : "Save Transaction"}
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

