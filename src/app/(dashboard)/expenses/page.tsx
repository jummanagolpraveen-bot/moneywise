"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Plus,
  TrendingDown,
  Search,
  ArrowDownRight,
  ShoppingBag,
  Receipt,
} from "lucide-react";
import { useTransactions } from "@/hooks/use-transactions";
import { TransactionModal } from "@/components/transactions/transaction-modal";
import { formatCurrency, formatDate } from "@/lib/utils";
import { useAuth } from "@/context/auth-provider";
import { useCategories } from "@/hooks/use-categories";

export default function ExpensesPage() {
  const { profile } = useAuth();
  const currency = profile?.currency || "USD";

  const { transactions, isLoading, addTransaction } = useTransactions();
  const { categories } = useCategories();
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const expenseTransactions = transactions.filter((t) => t.type === "expense");
  const totalExpense = expenseTransactions.reduce((acc, item) => acc + item.amount, 0);

  const filteredExpenses = expenseTransactions.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      (item.category?.name && item.category.name.toLowerCase().includes(search.toLowerCase())) ||
      (item.description && item.description.toLowerCase().includes(search.toLowerCase()));

    const matchesCategory =
      selectedCategory === "all" ||
      item.category_id === selectedCategory ||
      item.category?.name === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-foreground">Expense Control</h2>
          <p className="text-sm text-foreground-muted">
            Track daily expenditures and categorize your lifestyle spending
          </p>
        </div>
        <Button variant="danger" onClick={() => setShowModal(true)}>
          <Plus className="w-4 h-4 mr-1.5" />
          Log Expense
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-sm text-foreground-muted">Total Outflow</p>
              <p className="text-2xl font-bold text-red-500 mt-1">
                {formatCurrency(totalExpense, currency)}
              </p>
              <p className="text-xs text-foreground-muted mt-1">
                {expenseTransactions.length} expenses logged
              </p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-red-50 dark:bg-red-950/50 flex items-center justify-center text-red-500">
              <TrendingDown className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-sm text-foreground-muted">Expense Categories</p>
              <p className="text-2xl font-bold text-foreground mt-1">
                {new Set(expenseTransactions.map((t) => t.category?.name || "General")).size} Active
              </p>
              <p className="text-xs text-foreground-muted mt-1">Categorized tracking</p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-pink-50 dark:bg-pink-950/50 flex items-center justify-center text-pink-600 dark:text-pink-400">
              <ShoppingBag className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-sm text-foreground-muted">Average Spend</p>
              <p className="text-2xl font-bold text-foreground mt-1">
                {expenseTransactions.length > 0
                  ? formatCurrency(Math.round(totalExpense / expenseTransactions.length), currency)
                  : formatCurrency(0, currency)}
              </p>
              <p className="text-xs text-foreground-muted mt-1">Per transaction average</p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-amber-50 dark:bg-amber-950/50 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <Receipt className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-muted" />
          <input
            type="text"
            placeholder="Search expenses by title, note, or vendor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-border bg-input-bg text-sm text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="rounded-xl border border-border bg-input-bg px-4 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="all">All Expense Categories</option>
          {categories
            .filter((c) => c.type === "expense")
            .map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
        </select>
      </div>

      {/* Expenses List */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between">
                  <Skeleton className="w-32 h-4" />
                  <Skeleton className="w-20 h-4" />
                </div>
              ))}
            </div>
          ) : filteredExpenses.length === 0 ? (
            <div className="text-center py-12 px-4">
              <p className="text-foreground-muted text-sm">
                No expense records found.
              </p>
              <Button
                variant="danger"
                size="sm"
                onClick={() => setShowModal(true)}
                className="mt-3"
              >
                <Plus className="w-4 h-4 mr-1.5" /> Log First Expense
              </Button>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {filteredExpenses.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between px-6 py-4 hover:bg-input-bg/50 transition-colors"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-950/50 flex items-center justify-center text-red-500">
                      <ArrowDownRight className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{item.title}</p>
                      <p className="text-xs text-foreground-muted mt-0.5">
                        {item.category?.name || "General"} • {item.payment_method}
                        {item.description ? ` • ${item.description}` : ""}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-red-500">
                      -{formatCurrency(item.amount, currency)}
                    </p>
                    <p className="text-xs text-foreground-muted mt-0.5">
                      {formatDate(item.transaction_date)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal */}
      <TransactionModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={async (data) => {
          await addTransaction({ ...data, type: "expense" });
        }}
      />
    </div>
  );
}
