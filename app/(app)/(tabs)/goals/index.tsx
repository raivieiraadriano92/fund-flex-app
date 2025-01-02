import { useRouter } from "expo-router";
import { View } from "react-native";

import type { Goal } from "~/core/types/goal";

import { GoalList } from "~/components/features/goals/goal-list";
import { SetYourGoalsCard } from "~/components/features/goals/set-your-goals-card";
import { Button } from "~/components/ui/button";
import { P } from "~/components/ui/typography";
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

  return (
    <>
      <GoalList
        flashListProps={{
          ListEmptyComponent: (
            <View className="gap-6">
              <P>
                Start tracking your financial goals and watch your progress
                grow.
              </P>
              <SetYourGoalsCard />
            </View>
          )
        }}
        goals={goals}
        onPressGoal={handleGoalPress}
      />
      {hasGoals && (
        <Button
          className="native:w-14 absolute bottom-4 right-4 w-11 rounded-full p-0"
          onPress={handleCreateGoal}
          size="lg"
        >
          <PlusIcon className="text-white" />
        </Button>
      )}
    </>
  );
}
