"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, ArrowDownRight, ArrowRight, Clock } from "lucide-react";
import Link from "next/link";
import { Transaction } from "@/types";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface RecentTransactionsProps {
  transactions: Transaction[];
  currency?: string;
  isLoading?: boolean;
}

export function RecentTransactions({
  transactions,
  currency = "USD",
  isLoading = false,
}: RecentTransactionsProps) {
  // Sort by date descending and take top 5
  const latestFive = [...transactions]
    .sort(
      (a, b) =>
        new Date(b.transaction_date).getTime() -
        new Date(a.transaction_date).getTime()
    )
    .slice(0, 5);

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div>
          <CardTitle>Recent Activity</CardTitle>
          <p className="text-xs text-foreground-muted mt-0.5">
            Latest recorded transactions
          </p>
        </div>
        <Link
          href="/transactions"
          className="text-xs font-semibold text-navy-600 dark:text-navy-400 hover:underline inline-flex items-center gap-1"
        >
          View all <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </CardHeader>
      <CardContent className="p-0 flex-1 flex flex-col justify-center">
        {isLoading ? (
          <div className="p-6 space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Skeleton className="w-9 h-9 rounded-xl" />
                  <div className="space-y-1">
                    <Skeleton className="w-28 h-4" />
                    <Skeleton className="w-16 h-3" />
                  </div>
                </div>
                <Skeleton className="w-16 h-4" />
              </div>
            ))}
          </div>
        ) : latestFive.length === 0 ? (
          <div className="py-12 text-center px-4">
            <div className="w-10 h-10 rounded-xl bg-input-bg flex items-center justify-center mx-auto mb-2 text-foreground-muted">
              <Clock className="w-5 h-5" />
            </div>
            <p className="text-sm font-medium text-foreground">No transactions yet</p>
            <p className="text-xs text-foreground-muted mt-0.5 max-w-xs mx-auto">
              Your latest financial entries will appear here as soon as you record them.
            </p>
            <Link
              href="/transactions"
              className="inline-block mt-3 text-xs font-semibold text-navy-600 dark:text-navy-400 hover:underline"
            >
              + Record a transaction
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {latestFive.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between px-6 py-3 hover:bg-input-bg/40 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      tx.type === "income"
                        ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-500"
                        : "bg-red-50 dark:bg-red-950/60 text-red-500"
                    }`}
                  >
                    {tx.type === "income" ? (
                      <ArrowUpRight className="w-4 h-4" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-foreground truncate">
                        {tx.title}
                      </p>
                      <Badge
                        variant={tx.type === "income" ? "success" : "default"}
                        className="text-[10px] py-0 px-1.5 hidden sm:inline-flex"
                      >
                        {tx.category?.name || "General"}
                      </Badge>
                    </div>
                    <p className="text-xs text-foreground-muted truncate">
                      {formatDate(tx.transaction_date)} • {tx.payment_method}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <p
                    className={`text-sm font-bold ${
                      tx.type === "income" ? "text-emerald-500" : "text-red-500"
                    }`}
                  >
                    {tx.type === "income" ? "+" : "-"}
                    {formatCurrency(tx.amount, currency)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
