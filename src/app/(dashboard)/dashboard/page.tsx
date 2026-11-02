"use client";

import { StatsCards } from "@/components/dashboard/stats-cards";
import { IncomeExpenseChart } from "@/components/dashboard/income-expense-chart";
import { CategoryBreakdown } from "@/components/dashboard/category-breakdown";
import { RecentTransactions } from "@/components/dashboard/recent-transactions";
import { BudgetOverview } from "@/components/dashboard/budget-overview";
import { SavingsProgress } from "@/components/dashboard/savings-progress";
import { DATE_FILTERS } from "@/lib/constants";
import { useState } from "react";
import { Calendar } from "lucide-react";

export default function DashboardPage() {
  const [dateFilter, setDateFilter] = useState("this-month");

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Date Filter */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            Financial Overview
          </h2>
          <p className="text-sm text-foreground-muted">
            Track your money at a glance
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-foreground-muted" />
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="text-sm bg-input-bg border border-border rounded-xl px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer"
          >
            {DATE_FILTERS.map((filter) => (
              <option key={filter.value} value={filter.value}>
                {filter.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Stats */}
      <StatsCards />

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <IncomeExpenseChart />
        </div>
        <CategoryBreakdown />
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentTransactions />
        </div>
        <div className="space-y-6">
          <BudgetOverview />
          <SavingsProgress />
        </div>
      </div>
    </div>
  );
}

