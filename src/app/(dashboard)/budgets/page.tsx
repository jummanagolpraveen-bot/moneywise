"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  PiggyBank,
  AlertTriangle,
  CheckCircle,
  TrendingDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { EXPENSE_CATEGORIES } from "@/lib/constants";

const mockBudgets = [
  { id: "1", category: "Food & Dining", budgeted: 100000, spent: 85500, color: "#f97316" },
  { id: "2", category: "Transportation", budgeted: 50000, spent: 42000, color: "#3b82f6" },
  { id: "3", category: "Shopping", budgeted: 80000, spent: 91000, color: "#ec4899" }, // Exceeded
  { id: "4", category: "Entertainment", budgeted: 40000, spent: 32000, color: "#06b6d4" },
  { id: "5", category: "Bills & Utilities", budgeted: 120000, spent: 95000, color: "#f59e0b" },
  { id: "6", category: "Healthcare", budgeted: 30000, spent: 4200, color: "#ef4444" },
];

export default function BudgetsPage() {
  const [showAddForm, setShowAddForm] = useState(false);

  const totalBudgeted = mockBudgets.reduce((acc, b) => acc + b.budgeted, 0);
  const totalSpent = mockBudgets.reduce((acc, b) => acc + b.spent, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Budget Management</h2>
          <p className="text-sm text-foreground-muted">
            Plan your monthly spending limits and prevent overspending
          </p>
        </div>
        <Button onClick={() => setShowAddForm(!showAddForm)}>
          <Plus className="w-4 h-4" />
          Create New Budget
        </Button>
      </div>

      {/* Global Status Bar */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div>
              <p className="text-sm text-foreground-muted">Overall Monthly Budget</p>
              <h3 className="text-2xl font-bold text-foreground mt-0.5">
                ${(totalSpent / 100).toLocaleString()} of ${(totalBudgeted / 100).toLocaleString()} spent
              </h3>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant={totalSpent > totalBudgeted ? "danger" : "success"}>
                {Math.round((totalSpent / totalBudgeted) * 100)}% Used
              </Badge>
              <span className="text-sm font-semibold text-emerald-500">
                ${((totalBudgeted - totalSpent) / 100).toLocaleString()} remaining
              </span>
            </div>
          </div>
          <div className="w-full bg-input-bg h-3 rounded-full overflow-hidden">
            <div
              className="bg-navy-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(Math.round((totalSpent / totalBudgeted) * 100), 100)}%` }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Add Budget Form */}
      {showAddForm && (
        <Card className="animate-scale-in">
          <CardHeader>
            <CardTitle>Set Category Budget</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-foreground">Category</label>
                <select className="w-full rounded-xl border border-border bg-input-bg px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                  {EXPENSE_CATEGORIES.map((cat) => (
                    <option key={cat.name} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <Input label="Monthly Cap ($)" type="number" placeholder="500.00" />
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-foreground">Month</label>
                <select className="w-full rounded-xl border border-border bg-input-bg px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                  <option>Current Month (November 2026)</option>
                  <option>Next Month (December 2026)</option>
                </select>
              </div>
              <div className="sm:col-span-3 flex gap-3">
                <Button type="button">Save Budget Limit</Button>
                <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Budget Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {mockBudgets.map((b) => {
          const pct = Math.round((b.spent / b.budgeted) * 100);
          const isOver = pct > 100;
          const isNear = pct >= 80 && !isOver;

          return (
            <Card key={b.id} hover className="border-border">
              <CardContent className="p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-3.5 h-3.5 rounded-full"
                      style={{ backgroundColor: b.color }}
                    />
                    <h4 className="font-semibold text-foreground">{b.category}</h4>
                  </div>
                  {isOver ? (
                    <span className="flex items-center gap-1 text-xs font-semibold text-red-500">
                      <AlertTriangle className="w-3.5 h-3.5" /> Over Budget
                    </span>
                  ) : isNear ? (
                    <span className="flex items-center gap-1 text-xs font-semibold text-amber-500">
                      <AlertTriangle className="w-3.5 h-3.5" /> Warning (80%+)
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-xs font-semibold text-emerald-500">
                      <CheckCircle className="w-3.5 h-3.5" /> On Track
                    </span>
                  )}
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-foreground font-medium">
                      ${(b.spent / 100).toLocaleString()}
                    </span>
                    <span className="text-foreground-muted">
                      Budget: ${(b.budgeted / 100).toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full bg-input-bg h-2 rounded-full overflow-hidden">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all duration-500",
                        isOver ? "bg-red-500" : isNear ? "bg-amber-500" : "bg-emerald-500"
                      )}
                      style={{ width: `${Math.min(pct, 100)}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-foreground-muted pt-1 border-t border-border">
                  <span>{pct}% utilized</span>
                  <span className={cn(isOver ? "text-red-500 font-semibold" : "")}>
                    {isOver
                      ? `Exceeded by $${((b.spent - b.budgeted) / 100).toLocaleString()}`
                      : `$${((b.budgeted - b.spent) / 100).toLocaleString()} remaining`}
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

