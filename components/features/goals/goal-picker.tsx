import { useEffect } from "react";

import { router } from "expo-router";
import { View, ViewProps } from "react-native";

import { Label } from "~/components/ui/label";
import { PickerButton } from "~/components/ui/picker";
import { Small } from "~/components/ui/typography";
import { events } from "~/core/services/events";
import { Goal } from "~/core/types/goal";

interface GoalPickerProps extends ViewProps {
  error?: string;
  hideLabel?: boolean;
  index?: number;
  onChange: (goalId: string) => void;
  selectedGoal?: Goal;
}

export function GoalPicker({
  className,
  error,
  hideLabel,
  index = 0,
  onChange,
  selectedGoal,
  ...props
}: GoalPickerProps) {
  useEffect(() => {
    const handleGoalSelected = (goalId: string, selectedIndex = 0) => {
      if (selectedIndex === index) {
        onChange(goalId);
      }
    };

    events.on("goal:selected", handleGoalSelected);

    return () => {
      events.off("goal:selected");
    };
  }, [index, onChange]);

  return (
    <View className={`gap-2 ${className}`} {...props}>
      {!hideLabel && <Label>Goal</Label>}
      <PickerButton
        onPress={() =>
          router.push(
            `/goals/picker?defaultValue=${selectedGoal?.id || ""}&index=${index}`
          )
        }
        placeholder="Select goal"
        title={selectedGoal && `${selectedGoal?.emoji} ${selectedGoal?.title}`}
      />
      {!!error && <Small className="text-destructive">{error}</Small>}
    </View>
  );
}
