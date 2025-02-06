import { useMemo } from "react";

import { FlashList, FlashListProps } from "@shopify/flash-list";
import { View } from "react-native";

import type { Goal, GoalWithProgress } from "~/core/types/goal";

import { GoalCard } from "~/components/features/goals/goal-card";
import { useTransactionsStore } from "~/store/transactions";

interface GoalListProps {
  goals: Goal[];
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
  const transactions = useTransactionsStore((state) =>
    state.transactions
      .filter((transaction) => transaction.goals?.length)
      .flatMap(({ id, goals }) =>
        (goals || []).map((goal) => ({ ...goal, transaction_id: id }))
      )
  );

  const goalsWithProgress = useMemo(
    () =>
      goals.map<GoalWithProgress>((goal) => {
        const transactionsForGoal = transactions.filter(
          (transaction) => transaction.goal_id === goal.id
        );

        const currentAmount = transactionsForGoal.reduce(
          (sum, transaction) => sum + transaction.amount,
          0
        );

        const progress = Math.min((currentAmount / goal.amount) * 100, 100);

        return {
          ...goal,
          currentAmount,
          progress
        };
      }),
    [goals, transactions]
  );

  return (
    <FlashList
      contentContainerStyle={{
        padding: 24
      }}
      contentInsetAdjustmentBehavior="automatic"
      data={goalsWithProgress}
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
