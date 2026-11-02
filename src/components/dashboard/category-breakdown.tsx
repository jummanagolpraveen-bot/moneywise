"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CHART_COLORS } from "@/lib/constants";

// Mock data — will be replaced with real data in Phase 5
const data = [
  { name: "Food", value: 850, color: CHART_COLORS[0] },
  { name: "Transportation", value: 420, color: CHART_COLORS[1] },
  { name: "Shopping", value: 680, color: CHART_COLORS[2] },
  { name: "Entertainment", value: 320, color: CHART_COLORS[3] },
  { name: "Bills", value: 950, color: CHART_COLORS[4] },
  { name: "Other", value: 530, color: CHART_COLORS[5] },
];

const total = data.reduce((sum, item) => sum + item.value, 0);

export function CategoryBreakdown() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Expense Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row items-center gap-6">
          {/* Pie chart */}
          <div className="w-48 h-48 shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  dataKey="value"
                  strokeWidth={2}
                  stroke="var(--background-card)"
                >
                  {data.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "var(--background-card)",
                    border: "1px solid var(--border)",
                    borderRadius: "12px",
                    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
                  }}
                  formatter={(value: any) => [`$${Number(value || 0).toLocaleString()}`, ""]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend */}
          <div className="flex-1 grid grid-cols-2 gap-3 w-full">
            {data.map((item) => {
              const percentage = Math.round((item.value / total) * 100);
              return (
                <div key={item.name} className="flex items-center gap-2.5">
                  <div
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <div className="min-w-0">
                    <p className="text-sm text-foreground truncate">{item.name}</p>
                    <p className="text-xs text-foreground-muted">
                      ${item.value.toLocaleString()} · {percentage}%
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

