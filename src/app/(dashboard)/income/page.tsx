"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Plus,
  TrendingUp,
  Search,
  ArrowUpRight,
  Briefcase,
  Wallet,
} from "lucide-react";
import { useTransactions } from "@/hooks/use-transactions";
import { TransactionModal } from "@/components/transactions/transaction-modal";
import { formatCurrency, formatDate } from "@/lib/utils";
import { useAuth } from "@/context/auth-provider";

export default function IncomePage() {
  const { profile } = useAuth();
  const currency = profile?.currency || "USD";

  const { transactions, isLoading, addTransaction } = useTransactions();
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");

  const incomeTransactions = transactions.filter((t) => t.type === "income");
  const totalIncome = incomeTransactions.reduce((acc, item) => acc + item.amount, 0);

  const filteredIncome = incomeTransactions.filter(
    (item) =>
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      (item.category?.name && item.category.name.toLowerCase().includes(search.toLowerCase())) ||
      (item.description && item.description.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-foreground">Income Tracking</h2>
          <p className="text-sm text-foreground-muted">
            Record and monitor all your income streams in one place
          </p>
        </div>
        <Button onClick={() => setShowModal(true)}>
          <Plus className="w-4 h-4 mr-1.5" />
          Add Income
        </Button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-sm text-foreground-muted">Total Recorded Income</p>
              <p className="text-2xl font-bold text-emerald-500 mt-1">
                {formatCurrency(totalIncome, currency)}
              </p>
              <p className="text-xs text-foreground-muted mt-1">
                {incomeTransactions.length} income entries recorded
              </p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-500">
              <TrendingUp className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-sm text-foreground-muted">Active Streams</p>
              <p className="text-2xl font-bold text-foreground mt-1">
                {new Set(incomeTransactions.map((t) => t.category?.name || "Other")).size} Categories
              </p>
              <p className="text-xs text-foreground-muted mt-1">Diversified sources</p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-navy-50 dark:bg-navy-950/50 flex items-center justify-center text-navy-600 dark:text-navy-400">
              <Briefcase className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-sm text-foreground-muted">Average Inflow</p>
              <p className="text-2xl font-bold text-foreground mt-1">
                {incomeTransactions.length > 0
                  ? formatCurrency(Math.round(totalIncome / incomeTransactions.length), currency)
                  : formatCurrency(0, currency)}
              </p>
              <p className="text-xs text-foreground-muted mt-1">Per transaction average</p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-amber-50 dark:bg-amber-950/50 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <Wallet className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Income List */}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <CardTitle>Income History</CardTitle>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-muted" />
            <input
              type="text"
              placeholder="Filter income..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-border bg-input-bg text-sm text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </CardHeader>
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
          ) : filteredIncome.length === 0 ? (
            <div className="text-center py-12 px-4">
              <p className="text-foreground-muted text-sm">
                No income transactions recorded yet.
              </p>
              <Button onClick={() => setShowModal(true)} size="sm" className="mt-3">
                <Plus className="w-4 h-4 mr-1.5" /> Record Income
              </Button>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {filteredIncome.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between px-6 py-4 hover:bg-input-bg/50 transition-colors"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-500">
                      <ArrowUpRight className="w-5 h-5" />
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
                    <p className="text-sm font-bold text-emerald-500">
                      +{formatCurrency(item.amount, currency)}
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

      {/* Transaction Modal */}
      <TransactionModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={async (data) => {
          await addTransaction({ ...data, type: "income" });
        }}
      />
    </div>
  );
}
