"use client";

import { ArrowUpRight, ArrowDownRight, TrendingUp } from "lucide-react";

// Mock data for the dashboard preview
const mockStats = [
  { label: "Total Balance", value: "$12,450.00", trend: "+12.5%", positive: true },
  { label: "Income", value: "$8,200.00", trend: "+8.3%", positive: true },
  { label: "Expenses", value: "$3,750.00", trend: "-5.2%", positive: false },
  { label: "Savings", value: "$4,450.00", trend: "+18.1%", positive: true },
];

const mockTransactions = [
  { title: "Salary", category: "Income", amount: "+$5,000.00", date: "01/11/2026", positive: true },
  { title: "Grocery Shopping", category: "Food", amount: "-$85.50", date: "31/10/2026", positive: false },
  { title: "Netflix", category: "Entertainment", amount: "-$15.99", date: "30/10/2026", positive: false },
  { title: "Freelance Project", category: "Freelancing", amount: "+$1,200.00", date: "29/10/2026", positive: true },
];

export function Preview() {
  return (
    <section id="preview" className="py-20 sm:py-28 bg-navy-50/50 dark:bg-navy-900/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-2xl mx-auto text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
            A dashboard that{" "}
            <span className="text-navy-600 dark:text-navy-400">makes sense</span>
          </h2>
          <p className="mt-4 text-lg text-foreground-muted">
            See your complete financial picture at a glance. No clutter, no confusion.
          </p>
        </div>

        {/* Dashboard Preview */}
        <div className="max-w-5xl mx-auto">
          <div className="bg-background-card rounded-3xl border border-border shadow-xl overflow-hidden">
            {/* Mock browser bar */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-input-bg">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="w-3 h-3 rounded-full bg-emerald-400" />
              </div>
              <div className="flex-1 mx-4">
                <div className="max-w-sm mx-auto bg-background rounded-lg px-3 py-1 text-xs text-foreground-muted text-center">
                  moneywise.app/dashboard
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="p-6 sm:p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-foreground">Dashboard</h3>
                <div className="flex items-center gap-2 text-sm text-foreground-muted">
                  <TrendingUp className="w-4 h-4 text-emerald-500" />
                  <span>November 2026</span>
                </div>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {mockStats.map((stat) => (
                  <div
                    key={stat.label}
                    className="p-4 rounded-xl border border-border bg-background"
                  >
                    <p className="text-xs text-foreground-muted mb-1">{stat.label}</p>
                    <p className="text-lg sm:text-xl font-bold text-foreground">{stat.value}</p>
                    <div className="flex items-center gap-1 mt-1">
                      {stat.positive ? (
                        <ArrowUpRight className="w-3 h-3 text-emerald-500" />
                      ) : (
                        <ArrowDownRight className="w-3 h-3 text-red-500" />
                      )}
                      <span
                        className={`text-xs font-medium ${
                          stat.positive ? "text-emerald-500" : "text-red-500"
                        }`}
                      >
                        {stat.trend}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Mini chart area + recent transactions */}
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {/* Chart placeholder */}
                <div className="lg:col-span-3 rounded-xl border border-border bg-background p-4">
                  <p className="text-sm font-medium text-foreground mb-4">Income vs Expenses</p>
                  <div className="h-40 flex items-end gap-2">
                    {[65, 40, 75, 50, 85, 60, 45, 70, 55, 80, 50, 90].map((h, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1">
                        <div
                          className="w-full rounded-t bg-navy-500/20 dark:bg-navy-400/20 relative overflow-hidden"
                          style={{ height: `${h}%` }}
                        >
                          <div
                            className="absolute bottom-0 left-0 right-0 bg-navy-500 dark:bg-navy-400 rounded-t"
                            style={{ height: `${h * 0.6}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent transactions */}
                <div className="lg:col-span-2 rounded-xl border border-border bg-background p-4">
                  <p className="text-sm font-medium text-foreground mb-3">Recent Transactions</p>
                  <div className="space-y-3">
                    {mockTransactions.map((tx) => (
                      <div key={tx.title} className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-foreground">{tx.title}</p>
                          <p className="text-xs text-foreground-muted">{tx.category}</p>
                        </div>
                        <span
                          className={`text-sm font-semibold ${
                            tx.positive ? "text-emerald-500" : "text-red-500"
                          }`}
                        >
                          {tx.amount}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

