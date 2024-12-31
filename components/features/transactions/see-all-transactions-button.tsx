import { router } from "expo-router";

import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";

export function SeeAllTransactionsButton() {
  return (
    <Button
      className="px-2"
      onPress={() => router.push("/transactions/history")}
      size="sm"
      variant="ghost"
    >
      <Text className="text-primary group-active:text-primary">See All</Text>
    </Button>
  );
}
