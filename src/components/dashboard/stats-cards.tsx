"use client";

import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn, formatCurrency } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface StatCardProps {
  title: string;
  amountInCents: number;
  currency: string;
  prevAmountInCents?: number | null;
  invertTrendColor?: boolean; // For expenses, an increase is typically red, decrease is green
  icon: React.ReactNode;
  iconBg: string;
}

function calculateTrend(current: number, previous: number | null | undefined) {
  if (previous === null || previous === undefined || previous === 0) {
    if (current > 0) return { label: "+100%", isPositive: true, hasData: true };
    return { label: "No prior data", isPositive: true, hasData: false };
  }

  const diff = current - previous;
  const percentage = Math.round((diff / Math.abs(previous)) * 100);

  if (percentage === 0) {
    return { label: "0% vs prev", isPositive: true, hasData: true };
  }

  const sign = percentage > 0 ? "+" : "";
  return {
    label: `${sign}${percentage}%`,
    isPositive: percentage > 0,
    hasData: true,
  };
}

function StatCard({
  title,
  amountInCents,
  currency,
  prevAmountInCents,
  invertTrendColor = false,
  icon,
  iconBg,
}: StatCardProps) {
  const trend = calculateTrend(amountInCents, prevAmountInCents);

  // For expenses: increase is negative (red), decrease is positive (green)
  const isGoodTrend = invertTrendColor ? !trend.isPositive : trend.isPositive;

  return (
    <Card hover className="relative overflow-hidden">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-xs sm:text-sm font-medium text-foreground-muted">{title}</p>
            <p className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
              {formatCurrency(amountInCents, currency)}
            </p>
            <div className="flex items-center gap-1.5 pt-0.5">
              {trend.hasData ? (
                <>
                  {trend.isPositive ? (
                    <ArrowUpRight
                      className={cn("w-3.5 h-3.5 shrink-0", isGoodTrend ? "text-emerald-500" : "text-red-500")}
                    />
                  ) : (
                    <ArrowDownRight
                      className={cn("w-3.5 h-3.5 shrink-0", isGoodTrend ? "text-emerald-500" : "text-red-500")}
                    />
                  )}
                  <span
                    className={cn(
                      "text-xs font-semibold",
                      isGoodTrend ? "text-emerald-500" : "text-red-500"
                    )}
                  >
                    {trend.label}
                  </span>
                  <span className="text-[11px] text-foreground-muted truncate hidden sm:inline">
                    vs previous period
                  </span>
                </>
              ) : (
                <>
                  <Minus className="w-3 h-3 text-foreground-muted" />
                  <span className="text-[11px] text-foreground-muted">{trend.label}</span>
                </>
              )}
            </div>
          </div>
          <div className={cn("w-11 h-11 rounded-xl flex items-center justify-center shrink-0 shadow-sm", iconBg)}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface StatsCardsProps {
  totalBalance: number; // cumulative all-time
  periodIncome: number;
  periodExpenses: number;
  periodSavings: number;
  prevIncome?: number | null;
  prevExpenses?: number | null;
  prevSavings?: number | null;
  currency: string;
  isLoading?: boolean;
}

export function StatsCards({
  totalBalance,
  periodIncome,
  periodExpenses,
  periodSavings,
  prevIncome,
  prevExpenses,
  prevSavings,
  currency,
  isLoading = false,
}: StatsCardsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-background-card rounded-2xl border border-border p-5 space-y-3">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-36" />
            <Skeleton className="h-3 w-28" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Total Balance */}
      <StatCard
        title="Total Balance"
        amountInCents={totalBalance}
        currency={currency}
        prevAmountInCents={null} // Balance is lifetime cumulative
        icon={<DollarSign className="w-5 h-5 text-navy-600 dark:text-navy-300" />}
        iconBg="bg-navy-50 dark:bg-navy-950/60"
      />

      {/* 2. Total Income */}
      <StatCard
        title="Total Income"
        amountInCents={periodIncome}
        currency={currency}
        prevAmountInCents={prevIncome}
        icon={<TrendingUp className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />}
        iconBg="bg-emerald-50 dark:bg-emerald-950/60"
      />

      {/* 3. Total Expenses */}
      <StatCard
        title="Total Expenses"
        amountInCents={periodExpenses}
        currency={currency}
        prevAmountInCents={prevExpenses}
        invertTrendColor={true} // Higher expense is red
        icon={<TrendingDown className="w-5 h-5 text-red-500" />}
        iconBg="bg-red-50 dark:bg-red-950/60"
      />

      {/* 4. Net Savings */}
      <StatCard
        title="Net Savings"
        amountInCents={periodSavings}
        currency={currency}
        prevAmountInCents={prevSavings}
        icon={<Wallet className="w-5 h-5 text-amber-600 dark:text-amber-400" />}
        iconBg="bg-amber-50 dark:bg-amber-950/60"
      />
    </div>
  );
}
