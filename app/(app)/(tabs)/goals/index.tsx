import { useRouter } from "expo-router";

import type { Goal } from "~/core/types/goal";

import { GoalList } from "~/components/features/goals/goal-list";
import { Button } from "~/components/ui/button";
import { PlusIcon } from "~/lib/icons";
import { useGoalsStore } from "~/store/goals";

export default function GoalsScreen() {
  const router = useRouter();

  const goals = useGoalsStore((state) => state.goals);

  const handleGoalPress = (goal: Goal) => {
    router.push(`/(app)/goals/${goal.id}`);
  };

  const handleCreateGoal = () => {
    router.push("/(app)/goals/new");
  };

  return (
    <>
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
