"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import Link from "next/link";

// Mock data — will be replaced with real data in Phase 5
const transactions = [
  {
    id: "1",
    title: "Salary",
    category: "Salary",
    amount: 500000,
    type: "income" as const,
    date: "2026-11-01",
    payment_method: "Bank Transfer",
  },
  {
    id: "2",
    title: "Grocery Shopping",
    category: "Food",
    amount: 8550,
    type: "expense" as const,
    date: "2026-10-31",
    payment_method: "Debit Card",
  },
  {
    id: "3",
    title: "Netflix Subscription",
    category: "Entertainment",
    amount: 1599,
    type: "expense" as const,
    date: "2026-10-30",
    payment_method: "Credit Card",
  },
  {
    id: "4",
    title: "Freelance Project",
    category: "Freelancing",
    amount: 120000,
    type: "income" as const,
    date: "2026-10-29",
    payment_method: "Bank Transfer",
  },
  {
    id: "5",
    title: "Electricity Bill",
    category: "Bills",
    amount: 7500,
    type: "expense" as const,
    date: "2026-10-28",
    payment_method: "Net Banking",
  },
];

export function RecentTransactions() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Transactions</CardTitle>
        <Link
          href="/transactions"
          className="text-sm text-navy-600 dark:text-navy-400 hover:underline"
        >
          View all
        </Link>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-border">
          {transactions.map((tx) => (
            <div
              key={tx.id}
              className="flex items-center justify-between px-6 py-3.5 hover:bg-input-bg/50 transition-colors"
            >
              <div className="flex items-center gap-3.5">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                    tx.type === "income"
                      ? "bg-emerald-50 dark:bg-emerald-900"
                      : "bg-red-50 dark:bg-red-900"
                  }`}
                >
                  {tx.type === "income" ? (
                    <ArrowUpRight className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4 text-red-500" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{tx.title}</p>
                  <p className="text-xs text-foreground-muted">
                    {tx.category} · {tx.payment_method}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p
                  className={`text-sm font-semibold ${
                    tx.type === "income" ? "text-emerald-500" : "text-red-500"
                  }`}
                >
                  {tx.type === "income" ? "+" : "-"}$
                  {(tx.amount / 100).toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                  })}
                </p>
                <p className="text-xs text-foreground-muted">
                  {new Date(tx.date).toLocaleDateString("en-GB")}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

