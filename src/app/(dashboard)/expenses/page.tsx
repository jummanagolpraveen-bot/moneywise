"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  TrendingDown,
  Search,
  ArrowDownRight,
  ShoppingBag,
  Receipt,
  Car,
  UtensilsCrossed,
} from "lucide-react";
import { EXPENSE_CATEGORIES } from "@/lib/constants";

const mockExpenses = [
  { id: "1", title: "Whole Foods Market", category: "Food", amount: 8550, date: "2026-10-31", payment_method: "Debit Card", description: "Fresh groceries & vegetables" },
  { id: "2", title: "Monthly Metro Pass", category: "Transportation", amount: 7500, date: "2026-10-30", payment_method: "Credit Card", description: "Public transport card reload" },
  { id: "3", title: "Netflix Premium", category: "Entertainment", amount: 1599, date: "2026-10-29", payment_method: "Credit Card", description: "4K streaming subscription" },
  { id: "4", title: "Electric Utility Provider", category: "Bills", amount: 9500, date: "2026-10-28", payment_method: "Net Banking", description: "October power bill" },
  { id: "5", title: "Nike Running Shoes", category: "Shopping", amount: 13000, date: "2026-10-27", payment_method: "Debit Card", description: "Marathon trainers" },
  { id: "6", title: "Pharmacy & Prescriptions", category: "Healthcare", amount: 4200, date: "2026-10-25", payment_method: "Cash", description: "Vitamins and checkup medicines" },
];

export default function ExpensesPage() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const totalExpenseInCents = mockExpenses.reduce((acc, item) => acc + item.amount, 0);

  const filteredExpenses = mockExpenses.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Expense Control</h2>
          <p className="text-sm text-foreground-muted">
            Track daily expenditures and categorize your lifestyle spending
          </p>
        </div>
        <Button variant="danger" onClick={() => setShowAddForm(!showAddForm)}>
          <Plus className="w-4 h-4" />
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
                ${(totalExpenseInCents / 100).toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </p>
              <p className="text-xs text-foreground-muted mt-1">-5.2% reduction from last month</p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-red-50 dark:bg-red-900/50 flex items-center justify-center text-red-500">
              <TrendingDown className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-sm text-foreground-muted">Top Spending Category</p>
              <p className="text-2xl font-bold text-foreground mt-1">Shopping</p>
              <p className="text-xs text-foreground-muted mt-1">$130.00 spent this period</p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-pink-50 dark:bg-pink-900/50 flex items-center justify-center text-pink-600 dark:text-pink-400">
              <ShoppingBag className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-sm text-foreground-muted">Essential Bills Ratio</p>
              <p className="text-2xl font-bold text-foreground mt-1">42%</p>
              <p className="text-xs text-foreground-muted mt-1">Rent, Utilities & Groceries</p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-amber-50 dark:bg-amber-900/50 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <Receipt className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add Expense Form */}
      {showAddForm && (
        <Card className="animate-scale-in">
          <CardHeader>
            <CardTitle>Log New Expense</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Input label="Title / Merchant" placeholder="e.g. Starbucks, Target, Uber" />
              <Input label="Amount ($)" type="number" step="0.01" placeholder="0.00" />
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-foreground">Category</label>
                <select className="w-full rounded-xl border border-border bg-input-bg px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                  {EXPENSE_CATEGORIES.map((cat) => (
                    <option key={cat.name} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              <Input label="Date" type="date" />
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-foreground">Payment Method</label>
                <select className="w-full rounded-xl border border-border bg-input-bg px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                  <option>Credit Card</option>
                  <option>Debit Card</option>
                  <option>Cash</option>
                  <option>UPI</option>
                  <option>Net Banking</option>
                  <option>Wallet</option>
                </select>
              </div>
              <Input label="Description / Note" placeholder="Items purchased, invoice number..." />
              <div className="sm:col-span-2 lg:col-span-3 flex gap-3">
                <Button type="button" variant="danger">Record Expense</Button>
                <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-muted" />
          <input
            type="text"
            placeholder="Search expenses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-border bg-input-bg text-sm text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="rounded-xl border border-border bg-input-bg px-4 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="all">All Categories</option>
          {EXPENSE_CATEGORIES.map((cat) => (
            <option key={cat.name} value={cat.name}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Expenses Table */}
      <Card>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {filteredExpenses.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between px-6 py-4 hover:bg-input-bg/50 transition-colors"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-900/50 flex items-center justify-center text-red-500">
                    <ArrowDownRight className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{item.title}</p>
                    <p className="text-xs text-foreground-muted mt-0.5">
                      {item.category} • {item.payment_method}
                      {item.description ? ` • ${item.description}` : ""}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-red-500">
                    -${(item.amount / 100).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </p>
                  <p className="text-xs text-foreground-muted mt-0.5">
                    {new Date(item.date).toLocaleDateString("en-GB")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
