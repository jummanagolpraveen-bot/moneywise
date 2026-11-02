"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  TrendingUp,
  Search,
  ArrowUpRight,
  Briefcase,
  Laptop,
  Building2,
  Wallet,
  Award,
  MoreHorizontal,
} from "lucide-react";
import { INCOME_CATEGORIES } from "@/lib/constants";

const mockIncome = [
  { id: "1", title: "Monthly Salary", category: "Salary", amount: 500000, date: "2026-11-01", payment_method: "Bank Transfer", note: "Full-time tech lead compensation" },
  { id: "2", title: "Freelance UI Design", category: "Freelancing", amount: 120000, date: "2026-10-29", payment_method: "Bank Transfer", note: "Mobile app dashboard contract" },
  { id: "3", title: "Pocket Money Allowance", category: "Pocket Money", amount: 200000, date: "2026-10-25", payment_method: "Cash", note: "Monthly family allowance" },
  { id: "4", title: "Quarterly Business Dividend", category: "Business", amount: 80000, date: "2026-10-15", payment_method: "Direct Deposit", note: "E-commerce store distribution" },
];

export default function IncomePage() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [search, setSearch] = useState("");

  const totalIncomeInCents = mockIncome.reduce((acc, item) => acc + item.amount, 0);

  const filteredIncome = mockIncome.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase()) ||
    item.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Income Tracking</h2>
          <p className="text-sm text-foreground-muted">
            Record and monitor all your income streams in one place
          </p>
        </div>
        <Button onClick={() => setShowAddForm(!showAddForm)}>
          <Plus className="w-4 h-4" />
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
                ${(totalIncomeInCents / 100).toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </p>
              <p className="text-xs text-foreground-muted mt-1">+14.2% from last month</p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-emerald-50 dark:bg-emerald-900/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-sm text-foreground-muted">Active Income Streams</p>
              <p className="text-2xl font-bold text-foreground mt-1">4 Categories</p>
              <p className="text-xs text-foreground-muted mt-1">Salary, Freelance, Pocket Money, Business</p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-navy-50 dark:bg-navy-900/50 flex items-center justify-center text-navy-600 dark:text-navy-400">
              <Briefcase className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-sm text-foreground-muted">Average / Income Event</p>
              <p className="text-2xl font-bold text-foreground mt-1">
                ${(totalIncomeInCents / mockIncome.length / 100).toFixed(2)}
              </p>
              <p className="text-xs text-foreground-muted mt-1">Consistent monthly flow</p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-amber-50 dark:bg-amber-900/50 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <Wallet className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <Card className="animate-scale-in">
          <CardHeader>
            <CardTitle>Record New Income</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Input label="Income Source" placeholder="e.g. Monthly Salary, Freelance" />
              <Input label="Amount ($)" type="number" step="0.01" placeholder="0.00" />
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-foreground">Category</label>
                <select className="w-full rounded-xl border border-border bg-input-bg px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                  {INCOME_CATEGORIES.map((cat) => (
                    <option key={cat.name} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              <Input label="Date Received" type="date" />
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-foreground">Deposit Method</label>
                <select className="w-full rounded-xl border border-border bg-input-bg px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                  <option>Bank Transfer</option>
                  <option>Direct Deposit</option>
                  <option>Cash</option>
                  <option>UPI</option>
                  <option>Check</option>
                  <option>Wallet</option>
                </select>
              </div>
              <Input label="Note (optional)" placeholder="Quarterly bonus, contract #123..." />
              <div className="sm:col-span-2 lg:col-span-3 flex gap-3">
                <Button type="button">Save Income Entry</Button>
                <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

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
          <div className="divide-y divide-border">
            {filteredIncome.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between px-6 py-4 hover:bg-input-bg/50 transition-colors"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/50 flex items-center justify-center text-emerald-500">
                    <ArrowUpRight className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{item.title}</p>
                    <p className="text-xs text-foreground-muted mt-0.5">
                      {item.category} • {item.payment_method}
                      {item.note ? ` • ${item.note}` : ""}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-emerald-500">
                    +${(item.amount / 100).toLocaleString("en-US", { minimumFractionDigits: 2 })}
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
