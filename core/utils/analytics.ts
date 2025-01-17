import { startOfMonth, endOfMonth, subMonths, format } from "date-fns";

import { CategoryBreakdownData, MonthlyOverviewData } from "../types/analytics";
import { Category } from "../types/category";

import type { Transaction } from "~/core/types/transaction";

export function getMonthlyOverview(
  transactions: Transaction[],
  monthsCount: number = 6
): MonthlyOverviewData[] {
  const today = new Date();

  const months = Array.from({ length: monthsCount }, (_, i) => {
    const date = subMonths(today, i);

    return {
      startDate: startOfMonth(date),
      endDate: endOfMonth(date),
      label: format(date, "MMM")
    };
  }).reverse();

  return months.map(({ startDate, endDate, label }) => {
    const monthTransactions = transactions.filter((t) => {
      const date = new Date(t.datetime);

      return date >= startDate && date <= endDate;
    });

    const income = monthTransactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);

    const expense = monthTransactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      month: label,
      income,
      expense,
      net: income - expense
    };
  });
}

export function getCategoryBreakdown(
  transactions: Transaction[],
  categories: Category[]
): CategoryBreakdownData[] {
  const expenseTransactions = transactions.filter((t) => t.type === "expense");

  const totalExpenses = expenseTransactions.reduce(
    (sum, t) => sum + t.amount,
    0
  );

  const breakdownMap = expenseTransactions.reduce(
    (acc, transaction) => {
      const category = categories.find((c) => c.id === transaction.category_id);

      if (!category) return acc;

      if (!acc[category.id]) {
        acc[category.id] = {
          categoryId: category.id,
          categoryTitle: category.title,
          categoryEmoji: category.emoji,
          total: 0,
          percentage: 0
        };
      }

      acc[category.id].total += transaction.amount;

      return acc;
    },
    {} as Record<string, CategoryBreakdownData>
  );

  return Object.values(breakdownMap)
    .map((item) => ({
      ...item,
      percentage: +(
        totalExpenses > 0 ? (item.total / totalExpenses) * 100 : 0
      ).toFixed(2)
    }))
    .sort((a, b) => b.total - a.total);
}
