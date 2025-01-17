import type { Transaction } from "~/core/types/transaction";

export function sortTransactionsByDate(
  transactions: Transaction[],
  ascending = false
): Transaction[] {
  return [...transactions].sort((a, b) => {
    const dateA = new Date(a.datetime);

    const dateB = new Date(b.datetime);

    return ascending
      ? dateA.getTime() - dateB.getTime()
      : dateB.getTime() - dateA.getTime();
  });
}
