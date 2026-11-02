"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Plus,
  PiggyBank,
  AlertTriangle,
  CheckCircle,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Edit2,
  Trash2,
  TrendingDown,
  Info,
} from "lucide-react";
import { useBudgets } from "@/hooks/use-budgets";
import { useAuth } from "@/context/auth-provider";
import { BudgetModal } from "@/components/budgets/budget-modal";
import { DeleteModal } from "@/components/transactions/delete-modal";
import { formatCurrency, cn } from "@/lib/utils";
import { Budget } from "@/types";

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export default function BudgetsPage() {
  const { profile } = useAuth();
  const currency = profile?.currency || "USD";

  const {
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
    createBudget,
    updateBudget,
    deleteBudget,
  } = useBudgets();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [budgetToEdit, setBudgetToEdit] = useState<Budget | null>(null);
  const [budgetToDelete, setBudgetToDelete] = useState<Budget | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Month navigation helpers
  const handlePrevMonth = () => {
    if (selectedMonth === 1) {
      setSelectedMonth(12);
      setSelectedYear(selectedYear - 1);
    } else {
      setSelectedMonth(selectedMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (selectedMonth === 12) {
      setSelectedMonth(1);
      setSelectedYear(selectedYear + 1);
    } else {
      setSelectedMonth(selectedMonth + 1);
    }
  };

  const handleOpenAdd = () => {
    setBudgetToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (b: Budget) => {
    setBudgetToEdit(b);
    setIsModalOpen(true);
  };

  const handleSaveBudget = async (data: any) => {
    if (budgetToEdit) {
      await updateBudget(budgetToEdit.id, data);
    } else {
      await createBudget(data);
    }
  };

  const handleConfirmDelete = async () => {
    if (!budgetToDelete) return;
    setIsDeleting(true);
    try {
      await deleteBudget(budgetToDelete.id);
      setBudgetToDelete(null);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header with Month Selector & Create CTA */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-foreground">Budget Management</h2>
          <p className="text-sm text-foreground-muted">
            Set category limits, monitor spending thresholds, and curb overspending
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Month / Year Navigator */}
          <div className="flex items-center bg-input-bg border border-border rounded-xl p-1 shadow-sm">
            <button
              onClick={handlePrevMonth}
              className="p-1 rounded-lg hover:bg-background text-foreground-muted hover:text-foreground transition-colors cursor-pointer"
              title="Previous month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs sm:text-sm font-semibold px-2 min-w-[120px] text-center text-foreground">
              {MONTH_NAMES[selectedMonth - 1]} {selectedYear}
            </span>
            <button
              onClick={handleNextMonth}
              className="p-1 rounded-lg hover:bg-background text-foreground-muted hover:text-foreground transition-colors cursor-pointer"
              title="Next month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <Button onClick={handleOpenAdd} size="sm">
            <Plus className="w-4 h-4 mr-1.5" />
            New Budget
          </Button>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-5">
            <p className="text-xs text-foreground-muted">Total Budgeted</p>
            <p className="text-2xl font-bold text-foreground mt-1">
              {formatCurrency(totalBudgeted, currency)}
            </p>
            <p className="text-xs text-foreground-muted mt-0.5">
              {budgets.length} category caps set
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <p className="text-xs text-foreground-muted">Actual Spending</p>
            <p className="text-2xl font-bold text-foreground mt-1">
              {formatCurrency(totalSpent, currency)}
            </p>
            <p className="text-xs text-foreground-muted mt-0.5">
              {overallPercentage}% utilized
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <p className="text-xs text-foreground-muted">Remaining Balance</p>
            <p
              className={cn(
                "text-2xl font-bold mt-1",
                totalRemaining >= 0 ? "text-emerald-500" : "text-red-500"
              )}
            >
              {formatCurrency(totalRemaining, currency)}
            </p>
            <p className="text-xs text-foreground-muted mt-0.5">
              {totalRemaining >= 0 ? "Available to spend" : "Budget exceeded"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <p className="text-xs text-foreground-muted">Alert Status</p>
            <div className="flex items-center gap-2 mt-1">
              {exceededCount > 0 ? (
                <span className="text-lg font-bold text-red-500 flex items-center gap-1">
                  <AlertTriangle className="w-5 h-5" /> {exceededCount} Exceeded
                </span>
              ) : warningCount > 0 ? (
                <span className="text-lg font-bold text-amber-500 flex items-center gap-1">
                  <AlertTriangle className="w-5 h-5" /> {warningCount} Nearing Cap
                </span>
              ) : (
                <span className="text-lg font-bold text-emerald-500 flex items-center gap-1">
                  <CheckCircle className="w-5 h-5" /> Healthy
                </span>
              )}
            </div>
            <p className="text-xs text-foreground-muted mt-0.5">
              {exceededCount + warningCount === 0
                ? "All categories on track"
                : "Needs attention"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Global Utilization Progress Bar */}
      {totalBudgeted > 0 && (
        <Card className="p-5">
          <div className="flex items-center justify-between text-xs sm:text-sm font-semibold mb-2">
            <span className="text-foreground">
              Overall Monthly Progress: {overallPercentage}%
            </span>
            <span className={overallPercentage >= 100 ? "text-red-500" : "text-foreground-muted"}>
              {formatCurrency(totalSpent, currency)} of {formatCurrency(totalBudgeted, currency)}
            </span>
          </div>
          <div className="w-full bg-input-bg h-3 rounded-full overflow-hidden">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-500",
                overallPercentage >= 100
                  ? "bg-red-500"
                  : overallPercentage >= 80
                  ? "bg-amber-500"
                  : "bg-emerald-500"
              )}
              style={{ width: `${Math.min(overallPercentage, 100)}%` }}
            />
          </div>
        </Card>
      )}

      {/* Category Budgets Grid */}
      <div>
        <h3 className="text-base font-bold text-foreground mb-4">
          Category Budgets for {MONTH_NAMES[selectedMonth - 1]} {selectedYear}
        </h3>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-background-card rounded-2xl border border-border p-5 space-y-4">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-2 w-full" />
                <Skeleton className="h-4 w-24" />
              </div>
            ))}
          </div>
        ) : budgets.length === 0 ? (
          <div className="text-center py-16 px-4 border border-dashed border-border rounded-2xl bg-background-card">
            <div className="w-12 h-12 rounded-2xl bg-navy-50 dark:bg-navy-950/60 flex items-center justify-center mx-auto mb-3 text-navy-600 dark:text-navy-400">
              <PiggyBank className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-foreground">
              No budgets created for {MONTH_NAMES[selectedMonth - 1]} {selectedYear}
            </h4>
            <p className="text-xs text-foreground-muted max-w-sm mx-auto mt-1">
              Take control of your expenses by setting spending targets for food, transit, entertainment, and utilities.
            </p>
            <Button onClick={handleOpenAdd} className="mt-5">
              <Plus className="w-4 h-4 mr-1.5" />
              Create Your First Budget
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {budgets.map((b) => {
              const isOver = b.status === "exceeded";
              const isWarning = b.status === "warning";

              return (
                <Card
                  key={b.id}
                  hover
                  className={cn(
                    "border transition-all",
                    isOver
                      ? "border-red-300 dark:border-red-900 bg-red-50/10"
                      : isWarning
                      ? "border-amber-300 dark:border-amber-900 bg-amber-50/10"
                      : "border-border"
                  )}
                >
                  <CardContent className="p-5 space-y-4">
                    {/* Top Category Title & Actions */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div
                          className="w-3.5 h-3.5 rounded-full shrink-0"
                          style={{
                            backgroundColor: b.category?.color || "#3c5fa0",
                          }}
                        />
                        <h4 className="font-semibold text-foreground text-sm truncate">
                          {b.category?.name || "Uncategorized"}
                        </h4>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(b)}
                          className="p-1 rounded-lg text-foreground-muted hover:text-foreground hover:bg-input-bg transition-colors cursor-pointer"
                          title="Edit budget"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setBudgetToDelete(b)}
                          className="p-1 rounded-lg text-foreground-muted hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950 transition-colors cursor-pointer"
                          title="Delete budget"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Progress Bar & Amounts */}
                    <div>
                      <div className="flex justify-between text-xs font-semibold mb-1.5">
                        <span className="text-foreground">
                          {formatCurrency(b.spent || 0, currency)}
                        </span>
                        <span className="text-foreground-muted">
                          Limit: {formatCurrency(b.amount, currency)}
                        </span>
                      </div>
                      <div className="w-full bg-input-bg h-2 rounded-full overflow-hidden">
                        <div
                          className={cn(
                            "h-full rounded-full transition-all duration-500",
                            isOver
                              ? "bg-red-500"
                              : isWarning
                              ? "bg-amber-500"
                              : "bg-emerald-500"
                          )}
                          style={{ width: `${Math.min(b.percentage || 0, 100)}%` }}
                        />
                      </div>
                    </div>

                    {/* Threshold Alerts & Remaining text */}
                    <div className="flex items-center justify-between text-xs pt-1 border-t border-border">
                      <span className="font-medium text-foreground">
                        {b.percentage}% spent
                      </span>

                      {isOver ? (
                        <span className="font-semibold text-red-500 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" />
                          Exceeded by {formatCurrency(Math.abs(b.remaining || 0), currency)}
                        </span>
                      ) : isWarning ? (
                        <span className="font-semibold text-amber-500 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" />
                          Approaching cap ({formatCurrency(b.remaining || 0, currency)} left)
                        </span>
                      ) : (
                        <span className="text-emerald-500 font-medium">
                          {formatCurrency(b.remaining || 0, currency)} remaining
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Add / Edit Budget Modal */}
      <BudgetModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSaveBudget}
        budgetToEdit={budgetToEdit}
        defaultMonth={selectedMonth}
        defaultYear={selectedYear}
      />

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={!!budgetToDelete}
        onClose={() => setBudgetToDelete(null)}
        onConfirm={handleConfirmDelete}
        title={budgetToDelete?.category?.name ? `${budgetToDelete.category.name} Budget` : "this budget"}
        isDeleting={isDeleting}
      />
    </div>
  );
}
