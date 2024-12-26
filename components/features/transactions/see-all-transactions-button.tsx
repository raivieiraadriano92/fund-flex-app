import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";

export function SeeAllTransactionsButton() {
  return (
    <Button className="px-2" size="sm" variant="ghost">
      <Text className="text-primary group-active:text-primary">See All</Text>
    </Button>
  );
}
