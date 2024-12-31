import { useState } from "react";

import { FlashList } from "@shopify/flash-list";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { View } from "react-native";

import { GoalCard } from "~/components/features/goals/goal-card";
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
      <FlashList
        contentInsetAdjustmentBehavior="automatic"
        data={goals}
        extraData={selectedGoalId}
        contentContainerStyle={{
          padding: 24
        }}
        estimatedItemSize={128}
        ItemSeparatorComponent={(props) => <View className="h-3" {...props} />}
        renderItem={({ item }) => (
          <GoalCard
            currentAmount={item.currentAmount}
            goal={item}
            isSelectable
            isSelected={item.id === selectedGoalId}
            onPress={(goal) => setSelectedGoalId(goal.id)}
          />
        )}
        showsVerticalScrollIndicator={false}
      />
      <View className="pb-safe bg-white p-6">
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
