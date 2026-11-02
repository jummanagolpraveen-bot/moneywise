"use client";

import { useState, useMemo, useEffect } from "react";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { IncomeExpenseChart } from "@/components/dashboard/income-expense-chart";
import { CategoryBreakdown } from "@/components/dashboard/category-breakdown";
import { RecentTransactions } from "@/components/dashboard/recent-transactions";
import { BudgetOverview } from "@/components/dashboard/budget-overview";
import { SavingsProgress } from "@/components/dashboard/savings-progress";
import { TransactionModal } from "@/components/transactions/transaction-modal";
import { Button } from "@/components/ui/button";
import { DATE_FILTERS } from "@/lib/constants";
import { useTransactions } from "@/hooks/use-transactions";
import { useAuth } from "@/context/auth-provider";
import {
  getDateRangeBounds,
  getPreviousPeriodBounds,
  parseDateOnly,
} from "@/lib/utils";
import { Calendar, Plus, RefreshCw } from "lucide-react";

export default function DashboardPage() {
  const { profile } = useAuth();
  const currency = profile?.currency || "USD";

  const {
    transactions,
    isLoading,
    addTransaction,
    refreshTransactions,
    totalBalance,
  } = useTransactions();

  const [dateFilter, setDateFilter] = useState<string>("this-month");
  const [customStart, setCustomStart] = useState<string>("");
  const [customEnd, setCustomEnd] = useState<string>("");
  const [isClient, setIsClient] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const d = new Date();
    d.setDate(1);
    setCustomStart(d.toISOString().split("T")[0]);
    setCustomEnd(new Date().toISOString().split("T")[0]);
  }, []);

  // Compute Active Period Date Bounds (only once client is mounted)
  const currentBounds = useMemo(() => {
    if (!isClient) return null;
    return getDateRangeBounds(dateFilter, customStart, customEnd);
  }, [dateFilter, customStart, customEnd, isClient]);

  // Compute Previous Period Date Bounds (for percentage trend comparisons)
  const previousBounds = useMemo(() => {
    if (!isClient) return null;
    return getPreviousPeriodBounds(dateFilter, currentBounds);
  }, [dateFilter, currentBounds, isClient]);

  // Filter transactions for Current Period
  const periodTransactions = useMemo(() => {
    if (!currentBounds) return transactions; // All time or before client init

    return transactions.filter((tx) => {
      const txDate = parseDateOnly(tx.transaction_date);
      return txDate >= currentBounds.start && txDate <= currentBounds.end;
    });
  }, [transactions, currentBounds]);

  // Filter transactions for Previous Period
  const prevPeriodTransactions = useMemo(() => {
    if (!previousBounds) return [];

    return transactions.filter((tx) => {
      const txDate = parseDateOnly(tx.transaction_date);
      return txDate >= previousBounds.start && txDate <= previousBounds.end;
    });
  }, [transactions, previousBounds]);

  // Financial Calculations for current period
  const periodIncome = useMemo(() => {
    return periodTransactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);
  }, [periodTransactions]);

  const periodExpenses = useMemo(() => {
    return periodTransactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);
  }, [periodTransactions]);

  const periodSavings = periodIncome - periodExpenses;

  // Financial Calculations for previous period
  const prevIncome = useMemo(() => {
    if (prevPeriodTransactions.length === 0) return null;
    return prevPeriodTransactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);
  }, [prevPeriodTransactions]);

  const prevExpenses = useMemo(() => {
    if (prevPeriodTransactions.length === 0) return null;
    return prevPeriodTransactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);
  }, [prevPeriodTransactions]);

  const prevSavings =
    prevIncome !== null && prevExpenses !== null
      ? prevIncome - prevExpenses
      : null;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Dashboard Top Header & Controls */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-foreground">
            Financial Overview
          </h2>
          <p className="text-sm text-foreground-muted">
            Live insights, cash flow tracking, and category analytics
          </p>
        </div>

        {/* Action & Filter Controls */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          {/* Quick Refresh */}
          <button
            type="button"
            onClick={() => refreshTransactions()}
            className="p-2 rounded-xl border border-border bg-input-bg text-foreground-muted hover:text-foreground hover:bg-input-bg/80 transition-colors cursor-pointer"
            title="Refresh Financial Data"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
          </button>

          {/* Date Filter Dropdown */}
          <div className="flex items-center gap-2 bg-input-bg border border-border rounded-xl px-3 py-1.5 shadow-sm">
            <Calendar className="w-4 h-4 text-foreground-muted shrink-0" />
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="text-xs sm:text-sm bg-transparent border-none text-foreground focus:outline-none cursor-pointer pr-1"
            >
              {DATE_FILTERS.map((filter) => (
                <option key={filter.value} value={filter.value}>
                  {filter.label}
                </option>
              ))}
            </select>
          </div>

          {/* Custom Date Inputs (when Custom is selected) */}
          {dateFilter === "custom" && (
            <div className="flex items-center gap-2 text-xs">
              <input
                type="date"
                value={customStart}
                onChange={(e) => setCustomStart(e.target.value)}
                className="bg-input-bg border border-border rounded-xl px-2.5 py-1.5 text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <span className="text-foreground-muted">to</span>
              <input
                type="date"
                value={customEnd}
                onChange={(e) => setCustomEnd(e.target.value)}
                className="bg-input-bg border border-border rounded-xl px-2.5 py-1.5 text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          )}

          {/* Add Transaction Button */}
          <Button onClick={() => setIsModalOpen(true)} size="sm" className="ml-auto sm:ml-0">
            <Plus className="w-4 h-4 mr-1.5" />
            Add Transaction
          </Button>
        </div>
      </div>

      {/* 1. Live Financial Summary Cards */}
      <StatsCards
        totalBalance={totalBalance}
        periodIncome={periodIncome}
        periodExpenses={periodExpenses}
        periodSavings={periodSavings}
        prevIncome={prevIncome}
        prevExpenses={prevExpenses}
        prevSavings={prevSavings}
        currency={currency}
        isLoading={isLoading}
      />

      {/* 2. Charts Row: Monthly Cash Flow & Expense Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <IncomeExpenseChart
            transactions={periodTransactions}
            currency={currency}
            isLoading={isLoading}
          />
        </div>
        <div>
          <CategoryBreakdown
            transactions={periodTransactions}
            currency={currency}
            isLoading={isLoading}
          />
        </div>
      </div>

      {/* 3. Bottom Row: Recent Database Activity & Side Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentTransactions
            transactions={transactions}
            currency={currency}
            isLoading={isLoading}
          />
        </div>
        <div className="space-y-6">
          <BudgetOverview />
          <SavingsProgress />
        </div>
      </div>

      {/* Quick Add Transaction Modal */}
      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={async (data) => {
          await addTransaction(data);
        }}
      />
    </div>
  );
}
