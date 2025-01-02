import { useTheme } from "@react-navigation/native";
import { View } from "react-native";
import { PieChart } from "react-native-gifted-charts";
import defaultColors from "tailwindcss/colors";

import type { CategoryBreakdownData } from "~/core/types/analytics";

import { Amount } from "~/components/ui/amount";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import { Separator } from "~/components/ui/separator";
import { Text } from "~/components/ui/text";
import { H3, P } from "~/components/ui/typography";

const COLORS = [
  defaultColors.sky[500],
  defaultColors.indigo[500],
  defaultColors.violet[500],
  defaultColors.pink[500],
  defaultColors.rose[500],
  defaultColors.orange[500],
  defaultColors.yellow[500],
  defaultColors.green[500]
];

interface CategoryBreakdownProps {
  data: CategoryBreakdownData[];
}

export function CategoryBreakdown({ data }: CategoryBreakdownProps) {
  const { colors } = useTheme();

  const pieData = data.map((item, index) => ({
    value: item.total,
    text: `${item.percentage}%`,
    color: COLORS[index % COLORS.length],
    shiftTextX: 0,
    shiftTextY: 0,
    focused: false
  }));

  return (
    <View className="gap-4">
      <View>
        <H3>Expense Breakdown</H3>
        <P className="text-muted-foreground">Where your money goes</P>
      </View>

      <View className="items-center">
        <PieChart
          data={pieData}
          donut
          showText
          textColor={colors.text}
          sectionAutoFocus
          radius={120}
          innerRadius={60}
          innerCircleColor={colors.background}
          focusOnPress
        />
      </View>

      {/* Legend */}
      <View className="rounded-xl bg-primary-foreground">
        {data.map((item, index) => (
          <View key={item.categoryId}>
            {!!index && <Separator />}
            <View
              key={item.categoryId}
              className="h-16 flex-row items-center gap-3  px-3"
            >
              <View
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <Avatar alt={item.categoryTitle}>
                <AvatarFallback>
                  <Text>{item.categoryEmoji}</Text>
                </AvatarFallback>
              </Avatar>
              <P className="flex-1" numberOfLines={1}>
                {item.categoryTitle}
              </P>
              <View className="items-end">
                <Amount amount={item.total} />
                <P className="text-sm text-muted-foreground">
                  {item.percentage}%
                </P>
              </View>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}
