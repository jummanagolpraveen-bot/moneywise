"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Target } from "lucide-react";
import Link from "next/link";

// Mock data — will be replaced with real data in Phase 6
const goals = [
  {
    id: "1",
    name: "Emergency Fund",
    target: 1000000,
    current: 650000,
    targetDate: "2027-06-01",
    color: "#10b981",
  },
  {
    id: "2",
    name: "New Laptop",
    target: 150000,
    current: 95000,
    targetDate: "2027-03-01",
    color: "#3b82f6",
  },
  {
    id: "3",
    name: "Vacation Fund",
    target: 300000,
    current: 120000,
    targetDate: "2027-12-01",
    color: "#f59e0b",
  },
];

export function SavingsProgress() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Savings Goals</CardTitle>
        <Link
          href="/savings"
          className="text-sm text-navy-600 dark:text-navy-400 hover:underline"
        >
          View all
        </Link>
      </CardHeader>
      <CardContent>
        <div className="space-y-5">
          {goals.map((goal) => {
            const percentage = Math.round((goal.current / goal.target) * 100);

            return (
              <div key={goal.id} className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${goal.color}15` }}
                    >
                      <Target className="w-4 h-4" style={{ color: goal.color }} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{goal.name}</p>
                      <p className="text-xs text-foreground-muted">
                        Due {new Date(goal.targetDate).toLocaleDateString("en-GB")}
                      </p>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-foreground">
                    {percentage}%
                  </span>
                </div>

                <div className="h-2 bg-input-bg rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${percentage}%`,
                      backgroundColor: goal.color,
                    }}
                  />
                </div>

                <div className="flex items-center justify-between text-xs text-foreground-muted">
                  <span>
                    ${(goal.current / 100).toLocaleString()} saved
                  </span>
                  <span>
                    ${(goal.target / 100).toLocaleString()} target
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

