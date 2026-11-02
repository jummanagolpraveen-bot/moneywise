"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Target, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useSavings } from "@/hooks/use-savings";
import { useAuth } from "@/context/auth-provider";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

export function SavingsProgress() {
  const { profile } = useAuth();
  const currency = profile?.currency || "USD";
  const { goals, isLoading } = useSavings();

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div>
          <CardTitle>Savings Milestones</CardTitle>
          <span className="text-xs text-foreground-muted">Goals in progress</span>
        </div>
        <Link
          href="/savings"
          className="text-xs font-semibold text-navy-600 dark:text-navy-400 hover:underline inline-flex items-center gap-1"
        >
          View all <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-center">
        {isLoading ? (
          <div className="space-y-4 py-2">
            {[1, 2].map((i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-4 w-12" />
                </div>
                <Skeleton className="h-2 w-full" />
              </div>
            ))}
          </div>
        ) : goals.length === 0 ? (
          <div className="text-center py-6">
            <div className="w-9 h-9 rounded-xl bg-input-bg flex items-center justify-center mx-auto mb-2 text-foreground-muted">
              <Target className="w-4 h-4" />
            </div>
            <p className="text-xs text-foreground-muted">No savings goals created</p>
            <Link
              href="/savings"
              className="inline-block mt-2 text-xs font-semibold text-navy-600 dark:text-navy-400 hover:underline"
            >
              + Create a savings goal
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {goals.slice(0, 3).map((goal) => {
              const percentage = Math.min(
                100,
                goal.target_amount > 0
                  ? Math.round((goal.current_amount / goal.target_amount) * 100)
                  : 0
              );

              return (
                <div key={goal.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-500 flex items-center justify-center shrink-0">
                        <Target className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-foreground truncate max-w-[120px]">
                          {goal.name}
                        </p>
                        <p className="text-[10px] text-foreground-muted truncate">
                          Due {formatDate(goal.target_date)}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-foreground">
                      {percentage}%
                    </span>
                  </div>

                  <div className="h-2 bg-input-bg rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500 bg-emerald-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-foreground-muted">
                    <span>{formatCurrency(goal.current_amount, currency)}</span>
                    <span>Target: {formatCurrency(goal.target_amount, currency)}</span>
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
