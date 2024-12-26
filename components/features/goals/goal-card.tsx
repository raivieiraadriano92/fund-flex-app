import { useMemo } from "react";

import { TouchableOpacity, ViewProps } from "react-native";

import type { Goal } from "~/core/types/goal";

import { Amount } from "~/components/ui/amount";
import { Progress } from "~/components/ui/progress";
import { H4, Muted, P } from "~/components/ui/typography";

interface GoalCardProps extends ViewProps {
  goal: Goal;
  currentAmount: number;
  onPress: (goal: Goal) => void;
}

export function GoalCard({
  className,
  goal,
  currentAmount,
  onPress,
  ...props
}: GoalCardProps) {
  const progress = useMemo(
    () => Math.min((currentAmount / goal.amount) * 100, 100),
    [currentAmount, goal.amount]
  );

  const progressColors = useMemo(() => {
    if (progress === 0) return ["bg-transparent", ""];

    if (progress >= 75) return ["bg-green-500", "bg-green-100"];

    if (progress >= 50) return ["bg-yellow-500", "bg-yellow-100"];

    return ["bg-red-500", "bg-red-100"];
  }, [progress]);

  return (
    <TouchableOpacity
      onPress={() => onPress(goal)}
      className={`h-32 flex-1 justify-center gap-2 rounded-xl bg-white px-3 ${className}`}
      {...props}
    >
      {/* Header with emoji and title */}
      <P
        className="font-medium"
        numberOfLines={1}
      >{`${goal.emoji} ${goal.title}`}</P>

      {/* Amount target */}
      <Amount amount={goal.amount} as={H4} className="text-primary" />

      <Progress
        className={`${progressColors[1]}`}
        indicatorClassName={`${progressColors[0]}`}
        value={progress}
      />
      <Muted>
        <Amount amount={currentAmount} as={Muted} />
        {` (${progress.toFixed(0)}%)`}
      </Muted>
    </TouchableOpacity>
  );
}
