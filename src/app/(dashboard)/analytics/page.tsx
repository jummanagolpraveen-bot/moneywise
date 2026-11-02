"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IncomeExpenseChart } from "@/components/dashboard/income-expense-chart";
import { CategoryBreakdown } from "@/components/dashboard/category-breakdown";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp, Award, DollarSign, Calendar } from "lucide-react";

const netWorthTrend = [
  { month: "Jan", netWorth: 12000 },
  { month: "Feb", netWorth: 13500 },
  { month: "Mar", netWorth: 14200 },
  { month: "Apr", netWorth: 15800 },
  { month: "May", netWorth: 17100 },
  { month: "Jun", netWorth: 18400 },
  { month: "Jul", netWorth: 20200 },
  { month: "Aug", netWorth: 22100 },
  { month: "Sep", netWorth: 24500 },
  { month: "Oct", netWorth: 26800 },
  { month: "Nov", netWorth: 29500 },
];

export default function AnalyticsPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold text-foreground">Financial Analytics & Trends</h2>
        <p className="text-sm text-foreground-muted">
          Deep-dive analysis into cashflow velocity, net savings rate, and spending patterns
        </p>
      </div>

      {/* Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-5">
            <p className="text-xs text-foreground-muted">Average Savings Rate</p>
            <p className="text-2xl font-bold text-emerald-500 mt-1">54.2%</p>
            <p className="text-xs text-foreground-muted mt-0.5">Top tier financial health</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-xs text-foreground-muted">Highest Expense Month</p>
            <p className="text-2xl font-bold text-foreground mt-1">November</p>
            <p className="text-xs text-foreground-muted mt-0.5">$3,750 spent</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-xs text-foreground-muted">Peak Income Month</p>
            <p className="text-2xl font-bold text-navy-600 dark:text-navy-300 mt-1">November</p>
            <p className="text-xs text-foreground-muted mt-0.5">$8,200 deposited</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-xs text-foreground-muted">Estimated 1-Yr Net Growth</p>
            <p className="text-2xl font-bold text-emerald-500 mt-1">+$42,500</p>
            <p className="text-xs text-foreground-muted mt-0.5">Based on 6mo velocity</p>
          </CardContent>
        </Card>
      </div>

      {/* Net Worth Accumulation Curve */}
      <Card>
        <CardHeader>
          <CardTitle>Cumulative Net Savings Trajectory (2026)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={netWorthTrend}>
                <defs>
                  <linearGradient id="netWorthGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "var(--foreground-muted)", fontSize: 12 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "var(--foreground-muted)", fontSize: 12 }}
                  tickFormatter={(val) => `$${(val / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  contentStyle={{
                    background: "var(--background-card)",
                    border: "1px solid var(--border)",
                    borderRadius: "12px",
                  }}
                  formatter={(val: any) => [`$${Number(val || 0).toLocaleString()}`, "Net Savings"]}
                />
                <Area
                  type="monotone"
                  dataKey="netWorth"
                  stroke="#10b981"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#netWorthGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Core Charts Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <IncomeExpenseChart />
        </div>
        <CategoryBreakdown />
      </div>
    </div>
  );
}

