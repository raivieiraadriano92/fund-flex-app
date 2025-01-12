import { useEffect, useState } from "react";

import { endOfMonth, startOfMonth } from "date-fns";
import { ActivityIndicator, ScrollView, View } from "react-native";

import { CategoryBreakdown } from "~/components/features/analytics/category-breakdown";
import { MonthlyOverview } from "~/components/features/analytics/monthly-overview";
import { P } from "~/components/ui/typography";
import {
  fetchCategoryBreakdown,
  fetchMonthlyOverview
} from "~/core/api/analytics";
import { CategoryBreakdownData, MonthlyData } from "~/core/types/analytics";
import { useTransactionsStore } from "~/store/transactions";

export default function AnalyticsScreen() {
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);

  const [categoryData, setCategoryData] = useState<CategoryBreakdownData[]>([]);

  const hasTransactions = useTransactionsStore(
    (state) => state.transactions.length > 0
  );

  const [isLoading, setIsLoading] = useState(hasTransactions);

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);

        const sixMonthsAgo = new Date();

        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const startDate = startOfMonth(sixMonthsAgo);

        const endDate = endOfMonth(new Date());

        const [monthlyOverview, categoryBreakdown] = await Promise.all([
          fetchMonthlyOverview(startDate, endDate),
          fetchCategoryBreakdown(startDate, endDate)
        ]);

        setMonthlyData(monthlyOverview);

        setCategoryData(categoryBreakdown);
      } catch (_error) {
        // Handle error (maybe show toast)
      } finally {
        setIsLoading(false);
      }
    }

    if (hasTransactions) {
      loadData();
    }
  }, [hasTransactions]);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator />
      </View>
    );
  }

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
