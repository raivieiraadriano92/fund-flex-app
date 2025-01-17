import { useTheme } from "@react-navigation/native";
import { View } from "react-native";
import { BarChart, barDataItem } from "react-native-gifted-charts";
import defaultColors from "tailwindcss/colors";

import { Amount } from "~/components/ui/amount";
import { Separator } from "~/components/ui/separator";
import { Text } from "~/components/ui/text";
import { H3, P } from "~/components/ui/typography";
import { MonthlyOverviewData } from "~/core/types/analytics";
import { calculateChartScale } from "~/core/utils/chart";
import { formatCurrency } from "~/core/utils/currency";
import { useCurrencyStore } from "~/store/currency";

interface MonthlyOverviewProps {
  data: MonthlyOverviewData[];
}

export function MonthlyOverview({ data }: MonthlyOverviewProps) {
  const barData = data.flatMap<barDataItem>((item) => [
    {
      value: item.income,
      label: item.month,
      frontColor: defaultColors.green[500],
      spacing: 4
    },
    {
      value: item.expense,
      frontColor: defaultColors.red[500],
      spacing: 4
    },
    {
      value: item.net,
      frontColor: defaultColors.blue[500]
    }
  ]);

  const theme = useTheme();

  const currencyCode = useCurrencyStore((state) => state.currency);

  const values = data.flatMap((item) => [item.income, item.expense, item.net]);

  const { noOfSections, yAxisLabelTexts } = calculateChartScale(values);

  return (
    <View className="gap-4">
      <View>
        <H3>Monthly Overview</H3>
        <P className="text-muted-foreground">
          Last 6 months of income and expenses
        </P>
      </View>

      <BarChart
        data={barData}
        barWidth={16}
        barBorderRadius={4}
        yAxisThickness={0}
        xAxisThickness={0}
        hideRules
        yAxisTextStyle={{ color: theme.colors.text }}
        noOfSections={noOfSections}
        yAxisLabelTexts={yAxisLabelTexts}
        labelWidth={52}
        xAxisLabelTextStyle={{ color: theme.colors.text, textAlign: "center" }}
        renderTooltip={(item) => (
          <View
            style={{
              marginBottom: 12,
              // marginLeft: -12,
              backgroundColor: item.frontColor,
              paddingHorizontal: 6,
              paddingVertical: 4,
              borderRadius: 4
            }}
          >
            <Text>{formatCurrency(item.value, currencyCode)}</Text>
          </View>
        )}
      />

      {/* Legend */}
      <View className="flex-row justify-center gap-4">
        <View className="flex-row items-center gap-2">
          <View className="h-3 w-3 rounded-full bg-green-500" />
          <P>Income</P>
        </View>
        <View className="flex-row items-center gap-2">
          <View className="h-3 w-3 rounded-full bg-red-500" />
          <P>Expense</P>
        </View>
        <View className="flex-row items-center gap-2">
          <View className="h-3 w-3 rounded-full bg-blue-500" />
          <P>Net</P>
        </View>
      </View>

      {/* Summary */}
      <View className="gap-4 rounded-xl bg-primary-foreground p-4">
        {data.map((month, index) => (
          <View className="gap-4" key={month.month}>
            {!!index && <Separator />}
            <View className="gap-1">
              <P className="font-medium">{month.month}</P>
              <View className="flex-row justify-between">
                <P className="text-muted-foreground">Income</P>
                <Amount amount={month.income} type="income" />
              </View>
              <View className="flex-row justify-between">
                <P className="text-muted-foreground">Expense</P>
                <Amount amount={month.expense} type="expense" />
              </View>
              <View className="flex-row justify-between">
                <P className="text-muted-foreground">Net</P>
                <Amount
                  amount={month.net}
                  type={month.net >= 0 ? "income" : "expense"}
                />
              </View>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}
