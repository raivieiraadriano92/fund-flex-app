import { useState } from "react";

import { router, Stack, useLocalSearchParams } from "expo-router";
import { View } from "react-native";

import { GoalList } from "~/components/features/goals/goal-list";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { events } from "~/core/services/events";
import { useGoalsStore } from "~/store/goals";

export default function GoalPickerScreen() {
  const goals = useGoalsStore((state) => state.goals);

  const { defaultValue } = useLocalSearchParams<{
    defaultValue?: string;
  }>();

  const [selectedGoalId, setSelectedGoalId] = useState<string | undefined>(
    defaultValue
  );

  const handleContinue = () => {
    if (!selectedGoalId) {
      return;
    }

    events.emit("goal:selected", selectedGoalId);

    router.back();
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: "🎯 Goal Picker"
        }}
      />
      <GoalList
        goals={goals}
        flashListProps={{ extraData: selectedGoalId }}
        isSelectable
        isSelected={(goal) => goal.id === selectedGoalId}
        onPressGoal={(goal) => setSelectedGoalId(goal.id)}
      />
      <View className="pb-safe p-6">
        <Button
          className="mb-6"
          disabled={!selectedGoalId}
          onPress={handleContinue}
        >
          <Text>Continue</Text>
        </Button>
      </View>
    </>
  );
}
