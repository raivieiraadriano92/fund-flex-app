import { useEffect, useState } from "react";

import { ActivityIndicator, ScrollView, View } from "react-native";

import { MonthlyOverview } from "~/components/features/analytics/monthly-overview";
import { fetchMonthlyOverview } from "~/core/api/analytics";
import { MonthlyData } from "~/core/types/analytics";

export default function AnalyticsScreen() {
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);

        const data = await fetchMonthlyOverview();

        setMonthlyData(data);
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
      contentContainerClassName="p-6"
      showsVerticalScrollIndicator={false}
    >
      <MonthlyOverview data={monthlyData} />
    </ScrollView>
  );
}
