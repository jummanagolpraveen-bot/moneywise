"use client";

import {
  BarChart3,
  Shield,
  Wallet,
  Target,
  PieChart,
  TrendingUp,
} from "lucide-react";

const features = [
  {
    icon: Wallet,
    title: "Track Every Rupee & Dollar",
    description:
      "Log income and expenses effortlessly. Categorize transactions and see exactly where your money goes.",
    color: "text-navy-600 bg-navy-50 dark:bg-navy-900 dark:text-navy-300",
  },
  {
    icon: BarChart3,
    title: "Smart Budgets",
    description:
      "Set monthly budgets by category. Get real-time alerts when you're approaching or exceeding limits.",
    color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-900 dark:text-emerald-300",
  },
  {
    icon: Target,
    title: "Savings Goals",
    description:
      "Create savings targets with deadlines. Track contributions and watch your progress grow over time.",
    color: "text-amber-600 bg-amber-50 dark:bg-amber-900 dark:text-amber-300",
  },
  {
    icon: PieChart,
    title: "Visual Analytics",
    description:
      "Beautiful charts and reports that make your financial data easy to understand at a glance.",
    color: "text-purple-600 bg-purple-50 dark:bg-purple-900 dark:text-purple-300",
  },
  {
    icon: TrendingUp,
    title: "Income Insights",
    description:
      "Monitor all your income sources — salary, freelancing, business, and more — in one place.",
    color: "text-cyan-600 bg-cyan-50 dark:bg-cyan-900 dark:text-cyan-300",
  },
  {
    icon: Shield,
    title: "Bank-Grade Security",
    description:
      "Your financial data is protected with row-level security. Only you can access your information.",
    color: "text-rose-600 bg-rose-50 dark:bg-rose-900 dark:text-rose-300",
  },
];

export function Features() {
  return (
    <section id="features" className="py-20 sm:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-2xl mx-auto text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
            Everything you need to{" "}
            <span className="text-emerald-500">manage your money</span>
          </h2>
          <p className="mt-4 text-lg text-foreground-muted">
            Powerful tools designed for simplicity. No financial expertise required.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group p-6 rounded-2xl border border-border bg-background-card hover:shadow-lg hover:border-border-hover transition-all duration-300"
            >
              <div
                className={`w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center mb-5`}
              >
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-foreground-muted text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

