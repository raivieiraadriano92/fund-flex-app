// app/(app)/transactions/index.tsx
import { useState } from "react";

import { FlashList } from "@shopify/flash-list";
import { Stack, useRouter } from "expo-router";
import { View } from "react-native";

import { TransactionItem } from "~/components/features/transactions/transaction-item";
import { Input } from "~/components/ui/input";
import { Separator } from "~/components/ui/separator";
import { H2 } from "~/components/ui/typography";
// import { SearchIcon } from "~/lib/icons";
// import { useCategoriesStore } from "~/store/categories";
import { useTransactionsStore } from "~/store/transactions";

export default function TransactionsScreen() {
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");

  const transactions = useTransactionsStore((state) => state.transactions);

  const hasMore = useTransactionsStore((state) => state.hasMore);

  const fetchMoreTransactions = useTransactionsStore(
    (state) => state.fetchMoreTransactions
  );

  const filteredTransactions = transactions.filter((transaction) =>
    transaction.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <Stack.Screen
        options={{
          headerBackTitle: "Main",
          headerLargeTitle: true,
          headerSearchBarOptions: {},
          title: "History"
        }}
      />
      <FlashList
        contentInsetAdjustmentBehavior="automatic"
        data={filteredTransactions}
        contentContainerStyle={{
          padding: 24
        }}
        estimatedItemSize={64}
        ItemSeparatorComponent={(props) => <Separator {...props} />}
        renderItem={({ item }) => (
          <TransactionItem
            transaction={item}
            onPress={(transaction) =>
              router.push(`/(app)/transactions/${transaction.id}`)
            }
          />
        )}
        showsVerticalScrollIndicator={false}
      />
    </>
  );
}
