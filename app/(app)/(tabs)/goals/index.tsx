import { Stack, useRouter } from "expo-router";
import { View } from "react-native";

import type { Goal } from "~/core/types/goal";

import { GoalList } from "~/components/features/goals/goal-list";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { H1 } from "~/components/ui/typography";
import { PlusIcon } from "~/lib/icons";
import { useGoalsStore } from "~/store/goals";

export default function GoalsScreen() {
  const router = useRouter();

  const goals = useGoalsStore((state) => state.goals);

  const hasGoals = goals.length > 0;

  const handleGoalPress = (goal: Goal) => {
    router.push(`/(app)/goals/${goal.id}`);
  };

  const handleCreateGoal = () => {
    router.push("/(app)/goals/new");
  };

  if (!hasGoals) {
    return (
      <>
        <Stack.Screen
          options={{
            headerShown: false
          }}
        />
        <View className="flex-1 justify-center gap-16 bg-background p-6">
          <H1>What goals do you want to achieve?</H1>
          <Button onPress={() => router.push("/goals/new")}>
            <Text>Add your first goal</Text>
          </Button>
        </View>
      </>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerLargeTitle: true,
          headerShown: true,
          title: "🎯 Goals"
        }}
      />
      <GoalList goals={goals} onPressGoal={handleGoalPress} />
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
