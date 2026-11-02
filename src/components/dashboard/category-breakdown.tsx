"use client";

import { useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CHART_COLORS } from "@/lib/constants";
import { Transaction } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { PieChart as PieChartIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface CategoryBreakdownProps {
  transactions?: Transaction[];
  currency?: string;
  isLoading?: boolean;
}

export function CategoryBreakdown({
  transactions = [],
  currency = "USD",
  isLoading = false,
}: CategoryBreakdownProps) {
  // Aggregate ONLY expense transactions by category
  const { data, totalExpenseInCents } = useMemo(() => {
    const expenseTx = transactions.filter((t) => t.type === "expense");
    const categoryMap: Record<
      string,
      { name: string; amountInCents: number; color?: string }
    > = {};

    let total = 0;

    expenseTx.forEach((tx) => {
      const catName = tx.category?.name || "General Expense";
      const catColor = tx.category?.color;
      total += tx.amount;

      if (!categoryMap[catName]) {
        categoryMap[catName] = {
          name: catName,
          amountInCents: 0,
          color: catColor,
        };
      }
      categoryMap[catName].amountInCents += tx.amount;
    });

    const items = Object.values(categoryMap)
      .sort((a, b) => b.amountInCents - a.amountInCents)
      .map((item, idx) => ({
        name: item.name,
        value: item.amountInCents / 100, // For chart display
        amountInCents: item.amountInCents,
        color: item.color || CHART_COLORS[idx % CHART_COLORS.length],
        percentage: total > 0 ? Math.round((item.amountInCents / total) * 100) : 0,
      }));

    return {
      data: items,
      totalExpenseInCents: total,
    };
  }, [transactions]);

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="pb-2">
        <CardTitle>Expense Breakdown</CardTitle>
        <p className="text-xs text-foreground-muted mt-0.5">
          Spending distribution by category
        </p>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-center pt-4">
        {isLoading ? (
          <div className="h-48 flex items-center justify-center">
            <Skeleton className="w-40 h-40 rounded-full" />
          </div>
        ) : data.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center text-center p-6 border border-dashed border-border rounded-xl">
            <div className="w-12 h-12 rounded-xl bg-navy-50 dark:bg-navy-950/60 flex items-center justify-center text-navy-600 dark:text-navy-400 mb-3">
              <PieChartIcon className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-semibold text-foreground">
              No expenses in this period
            </h4>
            <p className="text-xs text-foreground-muted max-w-xs mt-1">
              Any expenses you log will automatically show up as a visual category breakdown here.
            </p>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row items-center gap-6">
            {/* Donut Chart */}
            <div className="w-44 h-44 shrink-0 relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                    strokeWidth={2}
                    stroke="var(--background-card)"
                  >
                    {data.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: "var(--background-card)",
                      border: "1px solid var(--border)",
                      borderRadius: "12px",
                      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                    }}
                    labelStyle={{ color: "var(--foreground)", fontWeight: 600 }}
                    itemStyle={{ color: "var(--foreground-muted)" }}
                    formatter={(val: any) => [
                      formatCurrency(Math.round(Number(val || 0) * 100), currency),
                      "Amount",
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
              {/* Center Total Summary */}
              <div className="absolute text-center pointer-events-none">
                <span className="text-[10px] uppercase font-semibold tracking-wider text-foreground-muted block">
                  Total
                </span>
                <span className="text-xs font-bold text-foreground">
                  {formatCurrency(totalExpenseInCents, currency)}
                </span>
              </div>
            </div>

            {/* Category Legend List */}
            <div className="flex-1 space-y-2 w-full max-h-48 overflow-y-auto pr-1">
              {data.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between text-xs p-1.5 rounded-lg hover:bg-input-bg/50 transition-colors"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <div
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="font-medium text-foreground truncate max-w-[120px]">
                      {item.name}
                    </span>
                  </div>
                  <div className="text-right shrink-0 flex items-center gap-2">
                    <span className="text-foreground-muted font-mono">
                      {formatCurrency(item.amountInCents, currency)}
                    </span>
                    <span className="font-semibold text-foreground w-8 text-right">
                      {item.percentage}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
