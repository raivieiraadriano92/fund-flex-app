import { format } from "date-fns";
import { TouchableOpacity, View } from "react-native";

import type { Transaction } from "~/core/types/transaction";

import { Amount } from "~/components/ui/amount";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import { Text } from "~/components/ui/text";
import { Muted } from "~/components/ui/typography";
import { useCategoriesStore } from "~/store/categories";

interface TransactionItemProps {
  transaction: Transaction;
  onPress: (transaction: Transaction) => void;
}

export function TransactionItem({
  transaction,
  onPress
}: TransactionItemProps) {
  const category = useCategoriesStore((state) =>
    state.categories.find((c) => c.id === transaction.category_id)
  );

  return (
    <TouchableOpacity
      className="h-16 flex-row items-center gap-3"
      onPress={() => onPress(transaction)}
    >
      <Avatar alt={category?.title ?? "?"}>
        <AvatarFallback>
          <Text>{category?.emoji}</Text>
        </AvatarFallback>
      </Avatar>
      <View className="flex-1 justify-center">
        <View className="flex-row items-center justify-between">
          <Text className="font-semibold">{transaction.title}</Text>
          <Amount amount={transaction.amount} type={transaction.type} />
        </View>
        <View className="flex-row items-center justify-between">
          <Muted>{category?.title}</Muted>
          <Muted>
            {format(new Date(transaction.datetime), "MMM dd, yyyy")}
          </Muted>
        </View>
      </View>
    </TouchableOpacity>
  );
}
