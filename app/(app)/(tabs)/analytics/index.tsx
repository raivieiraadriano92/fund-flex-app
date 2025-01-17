import { useMemo } from "react";

import { endOfToday, parseISO, startOfToday, subMonths } from "date-fns";
import { ScrollView, View } from "react-native";

import { CategoryBreakdown } from "~/components/features/analytics/category-breakdown";
import { MonthlyOverview } from "~/components/features/analytics/monthly-overview";
import { P } from "~/components/ui/typography";
import {
  getCategoryBreakdown,
  getMonthlyOverview
} from "~/core/utils/analytics";
import { useCategoriesStore } from "~/store/categories";
import { useTransactionsStore } from "~/store/transactions";

const sixMonthsAgo = subMonths(startOfToday(), 6);

const today = endOfToday();

export default function AnalyticsScreen() {
  const transactions = useTransactionsStore((state) =>
    // last 6 months of transactions
    state.transactions.filter((t) => {
      const date = parseISO(t.datetime);

      return date >= sixMonthsAgo && date <= today;
    })
  );

  const categories = useCategoriesStore((state) => state.categories);

  const monthlyData = useMemo(
    () => getMonthlyOverview(transactions),
    [transactions]
  );

  const categoryData = useMemo(
    () => getCategoryBreakdown(transactions, categories),
    [transactions, categories]
  );

  const hasTransactions = useTransactionsStore(
    (state) => state.transactions.length > 0
  );

  if (!hasTransactions) {
    return (
      <View className="flex-1 items-center justify-center">
        <P>No transactions found!</P>
      </View>
    );
  }

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      contentContainerClassName="p-6 gap-8"
      showsVerticalScrollIndicator={false}
    >
      <MonthlyOverview data={monthlyData} />
      <CategoryBreakdown data={categoryData} />
    </ScrollView>
  );
}
