"use client";

import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string;
  trend: string;
  trendPositive: boolean;
  icon: React.ReactNode;
  iconBg: string;
}

function StatCard({ title, value, trend, trendPositive, icon, iconBg }: StatCardProps) {
  return (
    <Card hover>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm text-foreground-muted">{title}</p>
            <p className="text-2xl font-bold text-foreground">{value}</p>
            <div className="flex items-center gap-1.5">
              {trendPositive ? (
                <ArrowUpRight className="w-4 h-4 text-emerald-500" />
              ) : (
                <ArrowDownRight className="w-4 h-4 text-red-500" />
              )}
              <span
                className={cn(
                  "text-xs font-medium",
                  trendPositive ? "text-emerald-500" : "text-red-500"
                )}
              >
                {trend}
              </span>
              <span className="text-xs text-foreground-muted">vs last month</span>
            </div>
          </div>
          <div className={cn("w-11 h-11 rounded-xl flex items-center justify-center", iconBg)}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function StatsCards() {
  // Mock data — will be replaced with real data in Phase 5
  const stats: StatCardProps[] = [
    {
      title: "Total Balance",
      value: "$12,450.00",
      trend: "+12.5%",
      trendPositive: true,
      icon: <DollarSign className="w-5 h-5 text-navy-600 dark:text-navy-400" />,
      iconBg: "bg-navy-50 dark:bg-navy-900",
    },
    {
      title: "Total Income",
      value: "$8,200.00",
      trend: "+8.3%",
      trendPositive: true,
      icon: <TrendingUp className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />,
      iconBg: "bg-emerald-50 dark:bg-emerald-900",
    },
    {
      title: "Total Expenses",
      value: "$3,750.00",
      trend: "+5.2%",
      trendPositive: false,
      icon: <TrendingDown className="w-5 h-5 text-red-500" />,
      iconBg: "bg-red-50 dark:bg-red-900",
    },
    {
      title: "Savings",
      value: "$4,450.00",
      trend: "+18.1%",
      trendPositive: true,
      icon: <Wallet className="w-5 h-5 text-amber-600 dark:text-amber-400" />,
      iconBg: "bg-amber-50 dark:bg-amber-900",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <StatCard key={stat.title} {...stat} />
      ))}
    </div>
  );
}

