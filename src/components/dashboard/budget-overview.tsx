"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

// Mock data — will be replaced with real data in Phase 6
const budgets = [
  { category: "Food", budgeted: 100000, spent: 85000, color: "#f97316" },
  { category: "Transportation", budgeted: 50000, spent: 42000, color: "#3b82f6" },
  { category: "Shopping", budgeted: 80000, spent: 68000, color: "#ec4899" },
  { category: "Entertainment", budgeted: 40000, spent: 32000, color: "#06b6d4" },
  { category: "Bills", budgeted: 120000, spent: 95000, color: "#f59e0b" },
];

export function BudgetOverview() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Budget Overview</CardTitle>
        <span className="text-xs text-foreground-muted">November 2026</span>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {budgets.map((budget) => {
            const percentage = Math.round((budget.spent / budget.budgeted) * 100);
            const isOverBudget = percentage > 100;
            const isWarning = percentage >= 80 && !isOverBudget;

            return (
              <div key={budget.category} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-foreground">
                    {budget.category}
                  </span>
                  <span className="text-foreground-muted">
                    ${(budget.spent / 100).toLocaleString()} / $
                    {(budget.budgeted / 100).toLocaleString()}
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
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span
                    className={cn(
                      "text-xs font-medium",
                      isOverBudget
                        ? "text-red-500"
                        : isWarning
                          ? "text-amber-500"
                          : "text-emerald-500"
                    )}
                  >
                    {percentage}%
                  </span>
                  <span className="text-xs text-foreground-muted">
                    ${((budget.budgeted - budget.spent) / 100).toLocaleString()} remaining
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

