"use client";

import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Plus,
  Search,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
  Edit2,
  Trash2,
  ArrowUpDown,
  Download,
  Calendar,
} from "lucide-react";
import { useTransactions } from "@/hooks/use-transactions";
import { useCategories } from "@/hooks/use-categories";
import { TransactionModal } from "@/components/transactions/transaction-modal";
import { DeleteModal } from "@/components/transactions/delete-modal";
import { Transaction } from "@/types";
import { formatCurrency, formatDate } from "@/lib/utils";
import { useAuth } from "@/context/auth-provider";

export default function TransactionsPage() {
  const { profile } = useAuth();
  const currency = profile?.currency || "USD";

  const {
    transactions,
    isLoading,
    addTransaction,
    updateTransaction,
    deleteTransaction,
  } = useTransactions();

  const { categories } = useCategories();

  // Filters & Search
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [dateRangeFilter, setDateRangeFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"date-desc" | "date-asc" | "amount-desc" | "amount-asc">("date-desc");

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [deletingTransaction, setDeletingTransaction] = useState<Transaction | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Filtered & Sorted Transactions
  const filteredTransactions = useMemo(() => {
    return transactions
      .filter((tx) => {
        // Search term
        const matchesSearch =
          tx.title.toLowerCase().includes(search.toLowerCase()) ||
          (tx.description && tx.description.toLowerCase().includes(search.toLowerCase())) ||
          (tx.category?.name && tx.category.name.toLowerCase().includes(search.toLowerCase()));

        // Type filter
        const matchesType = typeFilter === "all" || tx.type === typeFilter;

        // Category filter
        const matchesCategory =
          categoryFilter === "all" ||
          (tx.category_id === categoryFilter) ||
          (tx.category?.name === categoryFilter);

        // Date Range
        const txDate = new Date(tx.transaction_date);
        const now = new Date();
        let matchesDate = true;

        if (dateRangeFilter === "this-month") {
          matchesDate =
            txDate.getMonth() === now.getMonth() &&
            txDate.getFullYear() === now.getFullYear();
        } else if (dateRangeFilter === "last-month") {
          const lastMonth = now.getMonth() === 0 ? 11 : now.getMonth() - 1;
          const year = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();
          matchesDate =
            txDate.getMonth() === lastMonth && txDate.getFullYear() === year;
        } else if (dateRangeFilter === "this-year") {
          matchesDate = txDate.getFullYear() === now.getFullYear();
        }

        return matchesSearch && matchesType && matchesCategory && matchesDate;
      })
      .sort((a, b) => {
        if (sortBy === "date-desc") {
          return new Date(b.transaction_date).getTime() - new Date(a.transaction_date).getTime();
        }
        if (sortBy === "date-asc") {
          return new Date(a.transaction_date).getTime() - new Date(b.transaction_date).getTime();
        }
        if (sortBy === "amount-desc") {
          return b.amount - a.amount;
        }
        if (sortBy === "amount-asc") {
          return a.amount - b.amount;
        }
        return 0;
      });
  }, [transactions, search, typeFilter, categoryFilter, dateRangeFilter, sortBy]);

  const handleOpenAdd = () => {
    setEditingTransaction(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (tx: Transaction) => {
    setEditingTransaction(tx);
    setIsModalOpen(true);
    setActiveMenuId(null);
  };

  const handleOpenDelete = (tx: Transaction) => {
    setDeletingTransaction(tx);
    setActiveMenuId(null);
  };

  const handleSaveTransaction = async (data: any) => {
    if (editingTransaction) {
      await updateTransaction(editingTransaction.id, data);
    } else {
      await addTransaction(data);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingTransaction) return;
    setIsDeleting(true);
    try {
      await deleteTransaction(deletingTransaction.id);
      setDeletingTransaction(null);
    } finally {
      setIsDeleting(false);
    }
  };

  // Export to CSV
  const handleExportCSV = () => {
    if (filteredTransactions.length === 0) return;
    const headers = ["Title,Type,Category,Amount,Date,Payment Method,Description"];
    const rows = filteredTransactions.map((tx) =>
      `"${tx.title}","${tx.type}","${tx.category?.name || "Uncategorized"}",${(tx.amount / 100).toFixed(2)},"${tx.transaction_date}","${tx.payment_method}","${tx.description || ""}"`
    );
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `moneywise_transactions_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-fade-in" onClick={() => activeMenuId && setActiveMenuId(null)}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-foreground">Transactions</h2>
          <p className="text-sm text-foreground-muted">
            Track, filter, and manage your income and expenses
          </p>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            disabled={filteredTransactions.length === 0}
            className="flex-1 sm:flex-initial"
          >
            <Download className="w-4 h-4 mr-1.5" />
            Export CSV
          </Button>
          <Button onClick={handleOpenAdd} className="flex-1 sm:flex-initial">
            <Plus className="w-4 h-4 mr-1.5" />
            Add Transaction
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <Card>
        <CardContent className="p-4 space-y-3">
          <div className="flex flex-col md:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-muted" />
              <input
                type="text"
                placeholder="Search transactions by title, category, or note..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-border bg-input-bg text-sm text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            {/* Type Filter Buttons */}
            <div className="flex gap-1.5 p-1 bg-input-bg rounded-xl border border-border">
              {["all", "income", "expense"].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setTypeFilter(type)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all cursor-pointer ${
                    typeFilter === type
                      ? "bg-navy-600 text-white shadow-sm"
                      : "text-foreground-muted hover:text-foreground"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-border text-xs">
            {/* Category Filter */}
            <div className="flex items-center gap-2">
              <span className="text-foreground-muted">Category:</span>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="rounded-lg border border-border bg-input-bg px-2.5 py-1.5 text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="all">All Categories</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Range Filter */}
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-foreground-muted" />
              <select
                value={dateRangeFilter}
                onChange={(e) => setDateRangeFilter(e.target.value)}
                className="rounded-lg border border-border bg-input-bg px-2.5 py-1.5 text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="all">All Time</option>
                <option value="this-month">This Month</option>
                <option value="last-month">Last Month</option>
                <option value="this-year">This Year</option>
              </select>
            </div>

            {/* Sort Order */}
            <div className="flex items-center gap-2 sm:ml-auto">
              <ArrowUpDown className="w-3.5 h-3.5 text-foreground-muted" />
              <select
                value={sortBy}
                onChange={(e: any) => setSortBy(e.target.value)}
                className="rounded-lg border border-border bg-input-bg px-2.5 py-1.5 text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="date-desc">Newest First</option>
                <option value="date-asc">Oldest First</option>
                <option value="amount-desc">Highest Amount</option>
                <option value="amount-asc">Lowest Amount</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transactions List */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Skeleton className="w-10 h-10 rounded-xl" />
                    <div className="space-y-1.5">
                      <Skeleton className="w-36 h-4" />
                      <Skeleton className="w-24 h-3" />
                    </div>
                  </div>
                  <Skeleton className="w-20 h-5" />
                </div>
              ))}
            </div>
          ) : filteredTransactions.length === 0 ? (
            <div className="text-center py-16 px-4">
              <div className="w-14 h-14 bg-navy-50 dark:bg-navy-950/50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-navy-600 dark:text-navy-400">
                <Search className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-foreground">
                {transactions.length === 0
                  ? "No transactions recorded yet"
                  : "No matching transactions"}
              </h3>
              <p className="text-sm text-foreground-muted mt-1 max-w-sm mx-auto">
                {transactions.length === 0
                  ? "Get started by recording your first expense or income stream."
                  : "Try clearing your filters or searching with different terms."}
              </p>
              {transactions.length === 0 ? (
                <Button onClick={handleOpenAdd} className="mt-5">
                  <Plus className="w-4 h-4 mr-1.5" />
                  Add Transaction
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-5"
                  onClick={() => {
                    setSearch("");
                    setTypeFilter("all");
                    setCategoryFilter("all");
                    setDateRangeFilter("all");
                  }}
                >
                  Reset Filters
                </Button>
              )}
            </div>
          ) : (
            <div className="divide-y divide-border">
              {filteredTransactions.map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between px-6 py-4 hover:bg-input-bg/40 transition-colors"
                >
                  {/* Left: Icon & Title */}
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        tx.type === "income"
                          ? "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-500"
                          : "bg-red-50 dark:bg-red-950/50 text-red-500"
                      }`}
                    >
                      {tx.type === "income" ? (
                        <ArrowUpRight className="w-5 h-5" />
                      ) : (
                        <ArrowDownRight className="w-5 h-5" />
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-foreground truncate">
                          {tx.title}
                        </p>
                        <Badge
                          variant={tx.type === "income" ? "success" : "default"}
                          className="text-[10px] py-0 px-2 hidden sm:inline-flex"
                        >
                          {tx.category?.name || "General"}
                        </Badge>
                      </div>
                      <p className="text-xs text-foreground-muted truncate mt-0.5">
                        {formatDate(tx.transaction_date)} • {tx.payment_method}
                        {tx.description ? ` • ${tx.description}` : ""}
                      </p>
                    </div>
                  </div>

                  {/* Right: Amount & Action Menu */}
                  <div className="flex items-center gap-4 shrink-0">
                    <div className="text-right">
                      <p
                        className={`text-sm font-bold ${
                          tx.type === "income"
                            ? "text-emerald-500"
                            : "text-red-500"
                        }`}
                      >
                        {tx.type === "income" ? "+" : "-"}
                        {formatCurrency(tx.amount, currency)}
                      </p>
                    </div>

                    {/* Action Dropdown Menu */}
                    <div className="relative">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveMenuId(activeMenuId === tx.id ? null : tx.id);
                        }}
                        className="p-1.5 rounded-lg hover:bg-input-bg text-foreground-muted hover:text-foreground transition-colors cursor-pointer"
                        aria-label="Actions"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </button>

                      {activeMenuId === tx.id && (
                        <div
                          className="absolute right-0 top-8 z-20 w-36 bg-background-card border border-border rounded-xl shadow-xl py-1 animate-scale-in"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(tx)}
                            className="flex items-center gap-2 w-full px-3 py-2 text-xs font-medium text-foreground hover:bg-input-bg transition-colors cursor-pointer"
                          >
                            <Edit2 className="w-3.5 h-3.5 text-navy-600 dark:text-navy-400" />
                            Edit Record
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenDelete(tx)}
                            className="flex items-center gap-2 w-full px-3 py-2 text-xs font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-950 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add / Edit Transaction Modal */}
      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSaveTransaction}
        transactionToEdit={editingTransaction}
      />

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={!!deletingTransaction}
        onClose={() => setDeletingTransaction(null)}
        onConfirm={handleConfirmDelete}
        title={deletingTransaction?.title || "this transaction"}
        isDeleting={isDeleting}
      />
    </div>
  );
}
