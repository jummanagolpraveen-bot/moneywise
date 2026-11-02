"use client";

import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { SavingsGoal } from "@/types";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Trash2, History } from "lucide-react";

interface ContributionHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  goal: SavingsGoal | null;
  currency: string;
  onDeleteContribution: (contributionId: string, goalId: string, amount: number) => Promise<void>;
}

export function ContributionHistoryModal({
  isOpen,
  onClose,
  goal,
  currency,
  onDeleteContribution,
}: ContributionHistoryModalProps) {
  if (!goal) return null;

  const contributions = goal.contributions || [];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Deposit History — ${goal.name}`}
      description="All recorded deposits towards this milestone"
    >
      <div className="space-y-4 pt-2">
        {contributions.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-10 h-10 rounded-xl bg-input-bg flex items-center justify-center mx-auto mb-2 text-foreground-muted">
              <History className="w-5 h-5" />
            </div>
            <p className="text-sm font-medium text-foreground">No deposits recorded</p>
            <p className="text-xs text-foreground-muted mt-0.5">
              Make a deposit to start building your savings towards this goal.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border max-h-72 overflow-y-auto pr-1">
            {contributions.map((c) => (
              <div
                key={c.id}
                className="flex items-center justify-between py-3 hover:bg-input-bg/40 px-2 rounded-lg transition-colors"
              >
                <div>
                  <p className="text-sm font-bold text-emerald-500">
                    +{formatCurrency(c.amount, currency)}
                  </p>
                  <p className="text-xs text-foreground-muted mt-0.5">
                    {formatDate(c.contribution_date)}
                    {c.note ? ` • ${c.note}` : ""}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onDeleteContribution(c.id, goal.id, c.amount)}
                  className="p-1.5 text-foreground-muted hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/60 rounded-lg transition-colors cursor-pointer"
                  title="Remove deposit"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="pt-2 border-t border-border flex justify-end">
          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
}
