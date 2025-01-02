import { useEffect, useState } from "react";

import { endOfMonth, startOfMonth } from "date-fns";
import { ActivityIndicator, ScrollView, View } from "react-native";

import { CategoryBreakdown } from "~/components/features/analytics/category-breakdown";
import { MonthlyOverview } from "~/components/features/analytics/monthly-overview";
import {
  fetchCategoryBreakdown,
  fetchMonthlyOverview
} from "~/core/api/analytics";
import { MonthlyData } from "~/core/types/analytics";

export default function AnalyticsScreen() {
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);

  const [categoryData, setCategoryData] = useState<CategoryBreakdownType[]>([]);

  const [isLoading, setIsLoading] = useState(true);

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
      } catch (error) {
        console.error(error);
        // Handle error (maybe show toast)
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator />
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
