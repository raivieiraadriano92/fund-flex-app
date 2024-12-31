import { useEffect } from "react";

import { router } from "expo-router";
import { View } from "react-native";

import { Label } from "~/components/ui/label";
import { PickerButton } from "~/components/ui/picker";
import { Small } from "~/components/ui/typography";
import { events } from "~/core/services/events";
import { Goal } from "~/core/types/goal";

interface GoalPickerProps {
  error?: string;
  onChange: (goalId: string) => void;
  selectedGoal?: Goal;
}

export function GoalPicker({ error, onChange, selectedGoal }: GoalPickerProps) {
  useEffect(() => {
    const handleGoalSelected = (goalId: string) => {
      onChange(goalId);
    };

    events.on("goal:selected", handleGoalSelected);

    return () => {
      events.off("goal:selected");
    };
  }, [onChange]);

  return (
    <View className="gap-2">
      <Label>Goal</Label>
      <PickerButton
        onPress={() =>
          router.push(`/goals/picker?defaultValue=${selectedGoal?.id || ""}`)
        }
        placeholder="Select goal"
        title={selectedGoal && `${selectedGoal?.emoji} ${selectedGoal?.title}`}
      />
      {!!error && <Small className="text-destructive">{error}</Small>}
    </View>
  );
}
