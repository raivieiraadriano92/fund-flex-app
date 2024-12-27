import { useMemo } from "react";

import { FlashList } from "@shopify/flash-list";
import { useRouter } from "expo-router";
import { View } from "react-native";

import type { Goal } from "~/core/types/goal";

import { GoalCard } from "~/components/features/goals/goal-card";
import { Button } from "~/components/ui/button";
import { PlusIcon } from "~/lib/icons";
import { useGoalsStore } from "~/store/goals";
import { useTransactionsStore } from "~/store/transactions";

export default function GoalsScreen() {
  const router = useRouter();

  const goals = useGoalsStore((state) => state.goals);

  const transactions = useTransactionsStore((state) => state.transactions);

  const goalsWithProgress = useMemo(
    () =>
      goals.map((goal) => {
        const linkedTransactions = transactions.filter(
          (t) => t.goal_id === goal.id
        );

        const currentAmount = linkedTransactions.reduce(
          (total, t) => total + (t.type === "income" ? t.amount : -t.amount),
          0
        );

        return {
          ...goal,
          currentAmount
        };
      }),
    [goals, transactions]
  );

  const handleGoalPress = (goal: Goal) => {
    router.push(`/(app)/goals/${goal.id}`);
  };

  const handleCreateGoal = () => {
    router.push("/(app)/goals/new");
  };

  return (
    <>
      <FlashList
        contentInsetAdjustmentBehavior="automatic"
        data={goalsWithProgress}
        contentContainerStyle={{
          padding: 24
        }}
        renderItem={({ index, item }) => (
          <GoalCard
            currentAmount={item.currentAmount}
            goal={item}
            onPress={handleGoalPress}
            style={index % 2 === 0 ? { marginRight: 6 } : { marginLeft: 6 }}
          />
        )}
        ItemSeparatorComponent={(props) => <View className="h-3" {...props} />}
        estimatedItemSize={128}
        numColumns={2}
      />

      <Button
        className="native:w-14 absolute bottom-4 right-4 w-11 rounded-full p-0"
        onPress={handleCreateGoal}
        size="lg"
      >
        <PlusIcon className="text-white" />
      </Button>
    </>
  );
}
