import { router } from "expo-router";
import { TouchableOpacity, View } from "react-native";

import { Muted, P } from "~/components/ui/typography";
import { CirclePlusIcon, TargetIcon } from "~/lib/icons";

export function SetYourGoalsCard() {
  return (
    <TouchableOpacity
      className="flex-row items-center gap-3 rounded-xl border border-border p-3"
      onPress={() => router.push("/goals/new")}
    >
      <View className="h-12 w-12 items-center justify-center rounded-lg bg-primary-foreground">
        <TargetIcon className="text-primary" />
      </View>
      <View className="flex-1">
        <P className="font-semibold">Set your Goals</P>
        <Muted>Take control your spending and get your goals</Muted>
      </View>
      <CirclePlusIcon className="rounded-full bg-primary-foreground text-primary" />
    </TouchableOpacity>
  );
}
