"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Plus,
  Target,
  Sparkles,
  CheckCircle2,
  Calendar,
  Edit2,
  Trash2,
  History,
  TrendingUp,
} from "lucide-react";
import { useSavings } from "@/hooks/use-savings";
import { useAuth } from "@/context/auth-provider";
import { SavingsModal } from "@/components/savings/savings-modal";
import { ContributionModal } from "@/components/savings/contribution-modal";
import { ContributionHistoryModal } from "@/components/savings/contribution-history-modal";
import { DeleteModal } from "@/components/transactions/delete-modal";
import { formatCurrency, formatDate } from "@/lib/utils";
import { SavingsGoal } from "@/types";

export default function SavingsPage() {
  const { profile } = useAuth();
  const currency = profile?.currency || "USD";

  const {
    goals,
    totalSaved,
    totalTarget,
    overallPercentage,
    completedCount,
    activeCount,
    isLoading,
    createGoal,
    updateGoal,
    deleteGoal,
    addContribution,
    deleteContribution,
  } = useSavings();

  // Modal states
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [goalToEdit, setGoalToEdit] = useState<SavingsGoal | null>(null);
  const [goalToDelete, setGoalToDelete] = useState<SavingsGoal | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [contributeGoal, setContributeGoal] = useState<SavingsGoal | null>(null);
  const [historyGoal, setHistoryGoal] = useState<SavingsGoal | null>(null);

  const handleOpenAddGoal = () => {
    setGoalToEdit(null);
    setIsGoalModalOpen(true);
  };

  const handleOpenEditGoal = (goal: SavingsGoal) => {
    setGoalToEdit(goal);
    setIsGoalModalOpen(true);
  };

  const handleSaveGoal = async (data: any) => {
    if (goalToEdit) {
      await updateGoal(goalToEdit.id, data);
    } else {
      await createGoal(data);
    }
  };

  const handleConfirmDelete = async () => {
    if (!goalToDelete) return;
    setIsDeleting(true);
    try {
      await deleteGoal(goalToDelete.id);
      setGoalToDelete(null);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-foreground">Savings Goals</h2>
          <p className="text-sm text-foreground-muted">
            Define savings milestones, deposit contributions, and track progress
          </p>
        </div>
        <Button onClick={handleOpenAddGoal} size="sm">
          <Plus className="w-4 h-4 mr-1.5" />
          Create New Goal
        </Button>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs text-foreground-muted">Total Saved So Far</p>
              <p className="text-2xl font-bold text-emerald-500 mt-1">
                {formatCurrency(totalSaved, currency)}
              </p>
              <p className="text-xs text-foreground-muted mt-0.5">
                Across {goals.length} milestones
              </p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-500">
              <TrendingUp className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs text-foreground-muted">Aggregate Target</p>
              <p className="text-2xl font-bold text-foreground mt-1">
                {formatCurrency(totalTarget, currency)}
              </p>
              <p className="text-xs text-foreground-muted mt-0.5">
                {overallPercentage}% overall funded
              </p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-navy-50 dark:bg-navy-950/60 flex items-center justify-center text-navy-600 dark:text-navy-400">
              <Target className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs text-foreground-muted">Milestones Met</p>
              <p className="text-2xl font-bold text-foreground mt-1">
                {completedCount} Completed
              </p>
              <p className="text-xs text-foreground-muted mt-0.5">
                {activeCount} active targets in progress
              </p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-purple-50 dark:bg-purple-950/60 flex items-center justify-center text-purple-500">
              <Sparkles className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Goals Grid */}
      <div>
        <h3 className="text-base font-bold text-foreground mb-4">
          Active & Completed Goals
        </h3>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[1, 2].map((i) => (
              <div key={i} className="bg-background-card rounded-2xl border border-border p-6 space-y-4">
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-2 w-full" />
                <Skeleton className="h-4 w-32" />
              </div>
            ))}
          </div>
        ) : goals.length === 0 ? (
          <div className="text-center py-16 px-4 border border-dashed border-border rounded-2xl bg-background-card">
            <div className="w-12 h-12 rounded-2xl bg-navy-50 dark:bg-navy-950/60 flex items-center justify-center mx-auto mb-3 text-navy-600 dark:text-navy-400">
              <Target className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-foreground">
              No savings goals created yet
            </h4>
            <p className="text-xs text-foreground-muted max-w-sm mx-auto mt-1">
              Set milestones for vacation funds, emergency reserves, gadgets, or college fees and monitor your progress.
            </p>
            <Button onClick={handleOpenAddGoal} className="mt-5">
              <Plus className="w-4 h-4 mr-1.5" />
              Define Your First Goal
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {goals.map((g) => {
              const progress = Math.min(
                100,
                g.target_amount > 0
                  ? Math.round((g.current_amount / g.target_amount) * 100)
                  : 0
              );
              const isCompleted =
                g.status === "completed" || g.current_amount >= g.target_amount;
              const remainingToSave = Math.max(0, g.target_amount - g.current_amount);

              return (
                <Card key={g.id} hover className="overflow-hidden">
                  <CardContent className="p-6 space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-500 flex items-center justify-center shrink-0">
                          <Target className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-semibold text-foreground text-base truncate">
                            {g.name}
                          </h4>
                          <div className="flex items-center gap-2 mt-0.5 text-xs text-foreground-muted">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>Target: {formatDate(g.target_date)}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {isCompleted ? (
                          <Badge variant="success" className="gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Reached
                          </Badge>
                        ) : (
                          <Badge variant="default">{progress}%</Badge>
                        )}

                        <button
                          type="button"
                          onClick={() => handleOpenEditGoal(g)}
                          className="p-1 rounded-lg text-foreground-muted hover:text-foreground hover:bg-input-bg transition-colors cursor-pointer"
                          title="Edit goal"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setGoalToDelete(g)}
                          className="p-1 rounded-lg text-foreground-muted hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950 transition-colors cursor-pointer"
                          title="Delete goal"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Progress Bar & Amounts */}
                    <div>
                      <div className="flex justify-between text-xs font-semibold mb-1.5">
                        <span className="text-foreground">
                          {formatCurrency(g.current_amount, currency)}{" "}
                          <span className="text-foreground-muted font-normal">saved</span>
                        </span>
                        <span className="text-foreground-muted">
                          Goal: {formatCurrency(g.target_amount, currency)}
                        </span>
                      </div>
                      <div className="w-full bg-input-bg h-2.5 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500 bg-emerald-500"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>

                    {/* Footer Info & Actions */}
                    <div className="flex items-center justify-between pt-2 border-t border-border">
                      <span className="text-xs text-foreground-muted">
                        {isCompleted
                          ? "Goal milestone reached! 🎉"
                          : `${formatCurrency(remainingToSave, currency)} left to save`}
                      </span>

                      <div className="flex items-center gap-2">
                        {/* Contribution History Button */}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setHistoryGoal(g)}
                          title="View deposit history"
                          className="text-xs px-2"
                        >
                          <History className="w-3.5 h-3.5 mr-1" />
                          History ({g.contributions?.length || 0})
                        </Button>

                        {/* Add Deposit Button */}
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => setContributeGoal(g)}
                          className="text-xs"
                        >
                          + Deposit
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Goal Modal (Create / Edit) */}
      <SavingsModal
        isOpen={isGoalModalOpen}
        onClose={() => setIsGoalModalOpen(false)}
        onSubmit={handleSaveGoal}
        goalToEdit={goalToEdit}
      />

      {/* Contribution Deposit Modal */}
      <ContributionModal
        isOpen={!!contributeGoal}
        onClose={() => setContributeGoal(null)}
        onSubmit={async (data) => {
          await addContribution(data);
        }}
        goal={contributeGoal}
      />

      {/* Contribution History Modal */}
      <ContributionHistoryModal
        isOpen={!!historyGoal}
        onClose={() => setHistoryGoal(null)}
        goal={historyGoal}
        currency={currency}
        onDeleteContribution={async (cId, gId, amt) => {
          await deleteContribution(cId, gId, amt);
        }}
      />

      {/* Delete Goal Modal */}
      <DeleteModal
        isOpen={!!goalToDelete}
        onClose={() => setGoalToDelete(null)}
        onConfirm={handleConfirmDelete}
        title={goalToDelete?.name || "this goal"}
        isDeleting={isDeleting}
      />
    </div>
  );
}
