import { TransactionType } from "../types/transaction";

import type { Goal, GoalWithProgress } from "~/core/types/goal";

type GoalWithTransactions = Goal & {
  transactions: {
    amount: number;
    type: TransactionType;
  }[];
};

export function mapGoal(
  goal: GoalWithTransactions,
  _index?: number
): GoalWithProgress {
  const currentAmount = goal.transactions.reduce(
    (total, transaction) =>
      total +
      (transaction.type === "income"
        ? transaction.amount
        : -transaction.amount),
    0
  );

  // Remove transactions field and add currentAmount
  const { transactions, ...restGoal } = goal;

  return {
    ...restGoal,
    currentAmount,
    progress: Math.min((currentAmount / restGoal.amount) * 100, 100)
  };
}
