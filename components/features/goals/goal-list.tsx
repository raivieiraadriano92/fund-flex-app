import { FlashList, FlashListProps } from "@shopify/flash-list";
import { View } from "react-native";

import type { GoalWithProgress } from "~/core/types/goal";

import { GoalCard } from "~/components/features/goals/goal-card";

interface GoalListProps {
  goals: GoalWithProgress[];
  flashListProps?: Partial<FlashListProps<GoalWithProgress>>;
  isSelectable?: boolean;
  isSelected?(goal: GoalWithProgress): boolean;
  onPressGoal: (goal: GoalWithProgress) => void;
}

export function GoalList({
  goals,
  flashListProps,
  isSelectable,
  isSelected,
  onPressGoal
}: GoalListProps) {
  return (
    <FlashList
      contentContainerStyle={{
        padding: 24
      }}
      contentInsetAdjustmentBehavior="automatic"
      data={goals}
      estimatedItemSize={128}
      numColumns={2}
      renderItem={({ index, item }) => (
        <GoalCard
          currentAmount={item.currentAmount}
          goal={item}
          isSelectable={isSelectable}
          isSelected={isSelected?.(item)}
          onPress={onPressGoal}
          style={index % 2 === 0 ? { marginRight: 6 } : { marginLeft: 6 }}
        />
      )}
      ItemSeparatorComponent={(props) => <View className="h-3" {...props} />}
      {...flashListProps}
    />
  );
}
