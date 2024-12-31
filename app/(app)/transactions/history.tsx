import { useState } from "react";

import { Stack, useRouter } from "expo-router";

import { TransactionList } from "~/components/features/transactions/transaction-list";
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
      <TransactionList
        transactions={filteredTransactions}
        onPressTransaction={(transaction) =>
          router.push(`/(app)/transactions/${transaction.id}`)
        }
      />
    </>
  );
}
