import { FlashList, FlashListProps } from "@shopify/flash-list";

import { TransactionItem } from "~/components/features/transactions/transaction-item";
import { Separator } from "~/components/ui/separator";
import { Transaction } from "~/core/types/transaction";

interface TransactionListProps {
  transactions: Transaction[];
  flashListProps?: Partial<FlashListProps<Transaction>>;
  onPressTransaction: (transaction: Transaction) => void;
}

export function TransactionList({
  transactions,
  flashListProps,
  onPressTransaction
}: TransactionListProps) {
  return (
    <FlashList
      data={transactions}
      contentContainerStyle={{
        padding: 24
      }}
      contentInsetAdjustmentBehavior="automatic"
      estimatedItemSize={64}
      ItemSeparatorComponent={(props) => <Separator {...props} />}
      renderItem={({ item }) => (
        <TransactionItem transaction={item} onPress={onPressTransaction} />
      )}
      showsVerticalScrollIndicator={false}
      {...flashListProps}
    />
  );
}
