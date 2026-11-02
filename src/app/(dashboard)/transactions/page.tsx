"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Search,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
  Edit2,
  Trash2,
  ChevronDown,
} from "lucide-react";

// Mock transactions data
const mockTransactions = [
  { id: "1", title: "Monthly Salary", category: "Salary", type: "income" as const, amount: 500000, date: "2026-11-01", payment_method: "Bank Transfer", description: "November salary" },
  { id: "2", title: "Grocery Shopping", category: "Food", type: "expense" as const, amount: 8550, date: "2026-10-31", payment_method: "Debit Card", description: "Weekly groceries" },
  { id: "3", title: "Netflix Subscription", category: "Entertainment", type: "expense" as const, amount: 1599, date: "2026-10-30", payment_method: "Credit Card", description: "" },
  { id: "4", title: "Freelance Web Project", category: "Freelancing", type: "income" as const, amount: 120000, date: "2026-10-29", payment_method: "Bank Transfer", description: "Website redesign project" },
  { id: "5", title: "Electricity Bill", category: "Bills", type: "expense" as const, amount: 7500, date: "2026-10-28", payment_method: "Net Banking", description: "October bill" },
  { id: "6", title: "Uber Ride", category: "Transportation", type: "expense" as const, amount: 2350, date: "2026-10-27", payment_method: "Wallet", description: "" },
  { id: "7", title: "Coffee & Snacks", category: "Food", type: "expense" as const, amount: 450, date: "2026-10-26", payment_method: "Cash", description: "" },
  { id: "8", title: "Pocket Money", category: "Pocket Money", type: "income" as const, amount: 200000, date: "2026-10-25", payment_method: "Cash", description: "From parents" },
];

export default function TransactionsPage() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [showAddForm, setShowAddForm] = useState(false);
  const [actionMenuId, setActionMenuId] = useState<string | null>(null);

  const filteredTransactions = mockTransactions.filter((tx) => {
    const matchesSearch =
      tx.title.toLowerCase().includes(search.toLowerCase()) ||
      tx.category.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === "all" || tx.type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            All Transactions
          </h2>
          <p className="text-sm text-foreground-muted">
            Manage your income and expenses
          </p>
        </div>
        <Button onClick={() => setShowAddForm(!showAddForm)}>
          <Plus className="w-4 h-4" />
          Add Transaction
        </Button>
      </div>

      {/* Add Transaction Form */}
      {showAddForm && (
        <Card className="animate-scale-in">
          <CardHeader>
            <CardTitle>New Transaction</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Input label="Title" placeholder="e.g., Grocery Shopping" />
              <Input label="Amount" type="number" placeholder="0.00" />
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-foreground">
                  Type
                </label>
                <select className="w-full rounded-xl border border-border bg-input-bg px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-foreground">
                  Category
                </label>
                <select className="w-full rounded-xl border border-border bg-input-bg px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                  <option>Food</option>
                  <option>Transportation</option>
                  <option>Shopping</option>
                  <option>Entertainment</option>
                  <option>Bills</option>
                  <option>Healthcare</option>
                  <option>Other</option>
                </select>
              </div>
              <Input label="Date" type="date" />
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-foreground">
                  Payment Method
                </label>
                <select className="w-full rounded-xl border border-border bg-input-bg px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                  <option>Cash</option>
                  <option>Credit Card</option>
                  <option>Debit Card</option>
                  <option>UPI</option>
                  <option>Bank Transfer</option>
                  <option>Net Banking</option>
                  <option>Wallet</option>
                </select>
              </div>
              <div className="sm:col-span-2 lg:col-span-3">
                <Input label="Description (optional)" placeholder="Add a note..." />
              </div>
              <div className="sm:col-span-2 lg:col-span-3 flex gap-3">
                <Button type="button">Save Transaction</Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAddForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-muted" />
          <input
            type="text"
            placeholder="Search transactions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-input-bg text-sm text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <div className="flex gap-2">
          {["all", "income", "expense"].map((type) => (
            <button
              key={type}
              onClick={() => setTypeFilter(type)}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                typeFilter === type
                  ? "bg-navy-600 text-white"
                  : "bg-input-bg text-foreground-muted hover:text-foreground border border-border"
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Transactions List */}
      <Card>
        <CardContent className="p-0">
          {/* Table header */}
          <div className="hidden sm:grid grid-cols-12 gap-4 px-6 py-3 border-b border-border text-xs font-medium text-foreground-muted uppercase tracking-wider">
            <div className="col-span-4">Transaction</div>
            <div className="col-span-2">Category</div>
            <div className="col-span-2">Date</div>
            <div className="col-span-2">Payment</div>
            <div className="col-span-1 text-right">Amount</div>
            <div className="col-span-1" />
          </div>

          {/* Transaction rows */}
          <div className="divide-y divide-border">
            {filteredTransactions.map((tx) => (
              <div
                key={tx.id}
                className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 px-6 py-4 hover:bg-input-bg/50 transition-colors items-center"
              >
                {/* Transaction info */}
                <div className="col-span-4 flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
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
                    {tx.description && (
                      <p className="text-xs text-foreground-muted">{tx.description}</p>
                    )}
                  </div>
                </div>

                {/* Category */}
                <div className="col-span-2">
                  <Badge variant={tx.type === "income" ? "success" : "default"}>
                    {tx.category}
                  </Badge>
                </div>

                {/* Date */}
                <div className="col-span-2 text-sm text-foreground-muted">
                  {new Date(tx.date).toLocaleDateString("en-GB")}
                </div>

                {/* Payment method */}
                <div className="col-span-2 text-sm text-foreground-muted">
                  {tx.payment_method}
                </div>

                {/* Amount */}
                <div
                  className={`col-span-1 text-sm font-semibold text-right ${
                    tx.type === "income" ? "text-emerald-500" : "text-red-500"
                  }`}
                >
                  {tx.type === "income" ? "+" : "-"}$
                  {(tx.amount / 100).toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                  })}
                </div>

                {/* Actions */}
                <div className="col-span-1 flex justify-end relative">
                  <button
                    onClick={() =>
                      setActionMenuId(actionMenuId === tx.id ? null : tx.id)
                    }
                    className="p-1.5 rounded-lg hover:bg-input-bg text-foreground-muted cursor-pointer"
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                  {actionMenuId === tx.id && (
                    <div className="absolute right-0 top-8 z-10 w-36 bg-background-card border border-border rounded-xl shadow-lg py-1 animate-scale-in">
                      <button className="flex items-center gap-2 w-full px-3 py-2 text-sm text-foreground hover:bg-input-bg cursor-pointer">
                        <Edit2 className="w-3.5 h-3.5" />
                        Edit
                      </button>
                      <button className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950 cursor-pointer">
                        <Trash2 className="w-3.5 h-3.5" />
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Empty state */}
          {filteredTransactions.length === 0 && (
            <div className="text-center py-12">
              <p className="text-foreground-muted">No transactions found</p>
              <p className="text-sm text-foreground-muted mt-1">
                Try adjusting your search or filters
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

