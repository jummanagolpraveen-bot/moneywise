"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { cn, formatCurrency } from "@/lib/utils";
import { useBudgets } from "@/hooks/use-budgets";
import { useAuth } from "@/context/auth-provider";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { ArrowRight, PiggyBank } from "lucide-react";

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export function BudgetOverview() {
  const { profile } = useAuth();
  const currency = profile?.currency || "USD";
  const { budgets, selectedMonth, selectedYear, isLoading } = useBudgets();

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div>
          <CardTitle>Budget Overview</CardTitle>
          <span className="text-xs text-foreground-muted">
            {MONTH_NAMES[selectedMonth - 1]} {selectedYear}
          </span>
        </div>
        <Link
          href="/budgets"
          className="text-xs font-semibold text-navy-600 dark:text-navy-400 hover:underline inline-flex items-center gap-1"
        >
          View all <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-center">
        {isLoading ? (
          <div className="space-y-4 py-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-20" />
                </div>
                <Skeleton className="h-2 w-full" />
              </div>
            ))}
          </div>
        ) : budgets.length === 0 ? (
          <div className="text-center py-6">
            <div className="w-9 h-9 rounded-xl bg-input-bg flex items-center justify-center mx-auto mb-2 text-foreground-muted">
              <PiggyBank className="w-4 h-4" />
            </div>
            <p className="text-xs text-foreground-muted">No budgets set for this month</p>
            <Link
              href="/budgets"
              className="inline-block mt-2 text-xs font-semibold text-navy-600 dark:text-navy-400 hover:underline"
            >
              + Set monthly budget
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {budgets.slice(0, 4).map((budget) => {
              const isOverBudget = budget.status === "exceeded";
              const isWarning = budget.status === "warning";

              return (
                <div key={budget.id} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-foreground truncate max-w-[130px]">
                      {budget.category?.name || "General"}
                    </span>
                    <span className="text-foreground-muted">
                      {formatCurrency(budget.spent || 0, currency)} /{" "}
                      {formatCurrency(budget.amount, currency)}
                    </span>
                  </div>
                  <div className="h-2 bg-input-bg rounded-full overflow-hidden">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all duration-500",
                        isOverBudget
                          ? "bg-red-500"
                          : isWarning
                          ? "bg-amber-500"
                          : "bg-emerald-500"
                      )}
                      style={{ width: `${Math.min(budget.percentage || 0, 100)}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span
                      className={cn(
                        "font-semibold",
                        isOverBudget
                          ? "text-red-500"
                          : isWarning
                          ? "text-amber-500"
                          : "text-emerald-500"
                      )}
                    >
                      {budget.percentage}%
                    </span>
                    <span className="text-foreground-muted">
                      {isOverBudget
                        ? `Exceeded by ${formatCurrency(Math.abs(budget.remaining || 0), currency)}`
                        : `${formatCurrency(budget.remaining || 0, currency)} left`}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
