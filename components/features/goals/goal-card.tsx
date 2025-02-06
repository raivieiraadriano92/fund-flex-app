import { useMemo } from "react";

import { TouchableOpacity, View, ViewProps } from "react-native";

import type { GoalWithProgress } from "~/core/types/goal";

import { Amount } from "~/components/ui/amount";
import { Progress } from "~/components/ui/progress";
import { H4, Muted, P } from "~/components/ui/typography";
import { CircleCheckIcon, CircleIcon } from "~/lib/icons";

interface GoalCardProps extends ViewProps {
  goal: GoalWithProgress;
  currentAmount: number;
  isSelectable?: boolean;
  isSelected?: boolean;
  onPress: (goal: GoalWithProgress) => void;
}

export function GoalCard({
  className,
  goal,
  currentAmount,
  isSelectable,
  isSelected,
  onPress,
  ...props
}: GoalCardProps) {
  const progressColors = useMemo(() => {
    if (goal.progress === 0) return ["bg-transparent", ""];

    if (goal.progress >= 75) return ["bg-green-500", "bg-green-100"];

    if (goal.progress >= 50) return ["bg-yellow-500", "bg-yellow-100"];

    return ["bg-red-500", "bg-red-100"];
  }, [goal.progress]);

  return (
    <TouchableOpacity
      onPress={() => onPress(goal)}
      className={`h-32 flex-1 justify-center gap-2 rounded-xl bg-white px-3 dark:bg-background ${className}`}
      {...props}
    >
      <View className="flex-row justify-between">
        <View className="flex-1">
          {/* Header with emoji and title */}
          <P
            className="font-medium"
            numberOfLines={1}
          >{`${goal.emoji} ${goal.title}`}</P>

          {/* Amount target */}
          <Amount amount={goal.amount} as={H4} className="text-primary" />
        </View>
        {isSelectable && (
          <>
            {isSelected ? (
              <CircleCheckIcon className="text-primary" />
            ) : (
              <CircleIcon className="text-muted-foreground" />
            )}
          </>
        )}
      </View>

      <Progress
        className={`${progressColors[1]}`}
        indicatorClassName={`${progressColors[0]}`}
        value={goal.progress}
      />
      <Muted>
        <Amount amount={currentAmount} as={Muted} />
        {` (${goal.progress.toFixed(0)}%)`}
      </Muted>
    </TouchableOpacity>
  );
}
