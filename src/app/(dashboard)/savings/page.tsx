"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Target,
  Sparkles,
  CheckCircle2,
  Calendar,
  DollarSign,
} from "lucide-react";

const mockGoals = [
  {
    id: "1",
    name: "Emergency Fund (6 Months)",
    target: 1000000,
    current: 650000,
    targetDate: "2027-06-01",
    color: "#10b981",
    category: "Security",
  },
  {
    id: "2",
    name: "MacBook Pro M-Series",
    target: 250000,
    current: 175000,
    targetDate: "2027-02-15",
    color: "#3b82f6",
    category: "Gadgets",
  },
  {
    id: "3",
    name: "Japan Summer Vacation",
    target: 350000,
    current: 120000,
    targetDate: "2027-07-20",
    color: "#f59e0b",
    category: "Travel",
  },
  {
    id: "4",
    name: "New Electric Car Downpayment",
    target: 500000,
    current: 500000,
    targetDate: "2026-12-01",
    color: "#8b5cf6",
    category: "Vehicles",
  },
];

export default function SavingsPage() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [showContributeModal, setShowContributeModal] = useState<string | null>(null);

  const totalSaved = mockGoals.reduce((sum, g) => sum + g.current, 0);
  const totalTarget = mockGoals.reduce((sum, g) => sum + g.target, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Savings Goals</h2>
          <p className="text-sm text-foreground-muted">
            Track your milestones and deposit funds towards your future
          </p>
        </div>
        <Button onClick={() => setShowAddForm(!showAddForm)}>
          <Plus className="w-4 h-4" />
          Create New Goal
        </Button>
      </div>

      {/* Overview Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-sm text-foreground-muted">Total Saved So Far</p>
              <p className="text-2xl font-bold text-emerald-500 mt-1">
                ${(totalSaved / 100).toLocaleString()}
              </p>
              <p className="text-xs text-foreground-muted mt-1">
                Across {mockGoals.length} active milestones
              </p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-emerald-50 dark:bg-emerald-900/50 flex items-center justify-center text-emerald-500">
              <DollarSign className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-sm text-foreground-muted">Aggregate Target</p>
              <p className="text-2xl font-bold text-foreground mt-1">
                ${(totalTarget / 100).toLocaleString()}
              </p>
              <p className="text-xs text-foreground-muted mt-1">
                {Math.round((totalSaved / totalTarget) * 100)}% overall funded
              </p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-navy-50 dark:bg-navy-900/50 flex items-center justify-center text-navy-600 dark:text-navy-400">
              <Target className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-sm text-foreground-muted">Completed Milestones</p>
              <p className="text-2xl font-bold text-foreground mt-1">1 Goal Met 🎉</p>
              <p className="text-xs text-foreground-muted mt-1">Electric car downpayment funded</p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-purple-50 dark:bg-purple-900/50 flex items-center justify-center text-purple-500">
              <Sparkles className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add Goal Form */}
      {showAddForm && (
        <Card className="animate-scale-in">
          <CardHeader>
            <CardTitle>Define a New Savings Target</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input label="Goal Title" placeholder="e.g. Wedding Fund, Bali Trip" />
              <Input label="Target Amount ($)" type="number" step="0.01" placeholder="5000.00" />
              <Input label="Target Date" type="date" />
              <div className="sm:col-span-3 flex gap-3">
                <Button type="button">Set Goal</Button>
                <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Goals Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {mockGoals.map((g) => {
          const progress = Math.min(Math.round((g.current / g.target) * 100), 100);
          const isComplete = g.current >= g.target;

          return (
            <Card key={g.id} hover className="overflow-hidden">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                      style={{ backgroundColor: `${g.color}20`, color: g.color }}
                    >
                      <Target className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground text-base">{g.name}</h4>
                      <div className="flex items-center gap-2 mt-0.5 text-xs text-foreground-muted">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Deadline: {new Date(g.targetDate).toLocaleDateString("en-GB")}</span>
                      </div>
                    </div>
                  </div>
                  {isComplete ? (
                    <Badge variant="success">Completed</Badge>
                  ) : (
                    <Badge variant="default">{progress}%</Badge>
                  )}
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1.5 font-medium">
                    <span className="text-foreground">
                      ${(g.current / 100).toLocaleString()}{" "}
                      <span className="text-xs text-foreground-muted">saved</span>
                    </span>
                    <span className="text-foreground-muted">
                      Goal: ${(g.target / 100).toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full bg-input-bg h-2.5 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${progress}%`,
                        backgroundColor: g.color,
                      }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-border">
                  <span className="text-xs text-foreground-muted">
                    {isComplete
                      ? "Target fully reached! 🎊"
                      : `$${((g.target - g.current) / 100).toLocaleString()} left to save`}
                  </span>
                  <Button
                    size="sm"
                    variant={isComplete ? "outline" : "secondary"}
                    onClick={() => setShowContributeModal(g.id)}
                  >
                    + Add Deposit
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

