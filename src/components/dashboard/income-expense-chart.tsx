"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Transaction } from "@/types";
import { formatCurrency, parseDateOnly } from "@/lib/utils";
import { BarChart3 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface IncomeExpenseChartProps {
  transactions?: Transaction[];
  currency?: string;
  isLoading?: boolean;
}

interface MonthlyDataItem {
  monthKey: string;
  monthLabel: string;
  income: number;
  expenses: number;
}

export function IncomeExpenseChart({
  transactions = [],
  currency = "USD",
  isLoading = false,
}: IncomeExpenseChartProps) {
  const [monthlyData, setMonthlyData] = useState<MonthlyDataItem[]>([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const now = new Date();
    const monthsMap: Record<string, MonthlyDataItem> = {};
    const monthKeys: string[] = [];

    // Generate last 6 months chronological keys
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      const label = d.toLocaleDateString("en-US", { month: "short" });
      monthKeys.push(key);
      monthsMap[key] = {
        monthKey: key,
        monthLabel: label,
        income: 0,
        expenses: 0,
      };
    }

    // Populate with actual transactions
    transactions.forEach((tx) => {
      const txDate = parseDateOnly(tx.transaction_date);
      const key = `${txDate.getFullYear()}-${String(txDate.getMonth() + 1).padStart(2, "0")}`;

      if (monthsMap[key]) {
        const amount = tx.amount / 100;
        if (tx.type === "income") {
          monthsMap[key].income += amount;
        } else if (tx.type === "expense") {
          monthsMap[key].expenses += amount;
        }
      }
    });

    setMonthlyData(monthKeys.map((k) => monthsMap[k]));
    setIsReady(true);
  }, [transactions]);

  const hasActivity = monthlyData.some(
    (m) => m.income > 0 || m.expenses > 0
  );

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>Income vs Expenses</CardTitle>
          <p className="text-xs text-foreground-muted mt-0.5">
            Monthly cash flow comparison
          </p>
        </div>
      </CardHeader>
      <CardContent className="flex-1 pt-4">
        {isLoading || !isReady ? (
          <div className="h-72 flex items-center justify-center">
            <Skeleton className="h-64 w-full" />
          </div>
        ) : !hasActivity ? (
          <div className="h-72 flex flex-col items-center justify-center text-center p-6 border border-dashed border-border rounded-xl">
            <div className="w-12 h-12 rounded-xl bg-navy-50 dark:bg-navy-950/60 flex items-center justify-center text-navy-600 dark:text-navy-400 mb-3">
              <BarChart3 className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-semibold text-foreground">
              No trend data available
            </h4>
            <p className="text-xs text-foreground-muted max-w-xs mt-1">
              Add transactions for the recent months to see your income and expense comparisons.
            </p>
          </div>
        ) : (
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData} barGap={6}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="var(--border)"
                  vertical={false}
                />
                <XAxis
                  dataKey="monthLabel"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "var(--foreground-muted)", fontSize: 12 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "var(--foreground-muted)", fontSize: 12 }}
                  tickFormatter={(val) => {
                    const prefix = currency === "INR" ? "₹" : "$";
                    if (val >= 1000) return `${prefix}${(val / 1000).toFixed(0)}k`;
                    return `${prefix}${val}`;
                  }}
                />
                <Tooltip
                  contentStyle={{
                    background: "var(--background-card)",
                    border: "1px solid var(--border)",
                    borderRadius: "12px",
                    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                  }}
                  labelStyle={{ color: "var(--foreground)", fontWeight: 600 }}
                  itemStyle={{ color: "var(--foreground-muted)" }}
                  formatter={(value: any, name: any) => [
                    formatCurrency(Math.round(Number(value || 0) * 100), currency),
                    name === "income" ? "Income" : "Expenses",
                  ]}
                />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{ paddingTop: "12px", fontSize: "12px" }}
                />
                <Bar
                  dataKey="income"
                  fill="#10b981"
                  radius={[6, 6, 0, 0]}
                  name="Income"
                />
                <Bar
                  dataKey="expenses"
                  fill="#ef4444"
                  radius={[6, 6, 0, 0]}
                  name="Expenses"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
