import { useEffect, useRef, useState } from "react";

import { Stack, useRouter } from "expo-router";
import { ActivityIndicator, View } from "react-native";

import { ActiveTransactionFilters } from "~/components/features/transactions/active-transaction-filters";
import { TransactionList } from "~/components/features/transactions/transaction-list";
import { Button } from "~/components/ui/button";
import { Muted, P } from "~/components/ui/typography";
import { fetchFilteredTransactions } from "~/core/api/transactions";
import { events } from "~/core/services/events";
import {
  Transaction,
  TransactionFiltersFormData
} from "~/core/types/transaction";
import { SlidersHorizontalIcon } from "~/lib/icons";
import { LIMIT, useTransactionsStore } from "~/store/transactions";

export default function TransactionsHistoryScreen() {
  const router = useRouter();

  const searchQuery = useRef("");

  const storeTransactions = useTransactionsStore((state) => state.transactions);

  /**
   * Start with the first 20 transactions from the store.
   * This will be updated when the user searches or fetches more transactions.
   * This will avoid unnecessary API calls when the user navigates back to this screen.
   */
  const [transactions, setTransactions] = useState<Transaction[]>(
    storeTransactions.slice(0, LIMIT)
  );

  const [isLoading, setIsLoading] = useState(false);

  /**
   * Whether there are more transactions to fetch.
   * Initially set to true if the store has more than 20 transactions.
   */
  const [hasMore, setHasMore] = useState(storeTransactions.length >= LIMIT);

  const [page, setPage] = useState(1);

  /**
   * Debounce the search query to avoid making too many API calls.
   */
  const debounceSearchQuery = useRef<NodeJS.Timeout>();

  const handleChangeSearchQuery = (query: string) => {
    searchQuery.current = query;

    if (debounceSearchQuery.current) {
      clearTimeout(debounceSearchQuery.current);
    }

    /**
     * If the search query is empty, show the first 20 transactions from the store.
     */
    if (!query) {
      setTransactions(storeTransactions.slice(0, LIMIT));

      setPage(1);

      setHasMore(storeTransactions.length >= LIMIT);

      return;
    }

    debounceSearchQuery.current = setTimeout(async () => {
      setPage(1);

      setHasMore(true);

      setIsLoading(true);

      const newTransactions = await fetchFilteredTransactions({
        page: 1,
        searchQuery: searchQuery.current,
        type: filters.current.type,
        categoryId: filters.current.category_id
      });

      if (newTransactions.length !== LIMIT) {
        setHasMore(false);
      }

      setTransactions(newTransactions);

      setIsLoading(false);
    }, 500);
  };

  const fetchMoreTransactions = async () => {
    if (isLoading || !hasMore) {
      return;
    }

    setIsLoading(true);

    const newTransactions = await fetchFilteredTransactions({
      page: page + 1,
      searchQuery: searchQuery.current,
      type: filters.current.type,
      categoryId: filters.current.category_id
    });

    setIsLoading(false);

    if (newTransactions.length !== LIMIT) {
      setHasMore(false);
    }

    setTransactions([...transactions, ...newTransactions]);

    setPage((prev) => prev + 1);
  };

  const filters = useRef<TransactionFiltersFormData>({
    type: "all"
  });

  useEffect(() => {
    const handleFilters = async (filtersData: TransactionFiltersFormData) => {
      filters.current = filtersData;

      setPage(1);

      setHasMore(true);

      setIsLoading(true);

      const newTransactions = await fetchFilteredTransactions({
        page: 1,
        searchQuery: searchQuery.current,
        type: filtersData.type,
        categoryId: filtersData.category_id
      });

      if (newTransactions.length !== LIMIT) {
        setHasMore(false);
      }

      setTransactions(newTransactions);

      setIsLoading(false);
    };

    events.on("transaction:applyFilter", handleFilters);

    return () => {
      events.off("transaction:applyFilter");
    };
  }, []);

  return (
    <>
      <Stack.Screen
        options={{
          headerLargeTitle: true,
          headerSearchBarOptions: {
            onChangeText: (event) =>
              handleChangeSearchQuery(event.nativeEvent.text)
          },
          title: "📝 History"
        }}
      />
      <TransactionList
        transactions={transactions}
        flashListProps={{
          ListEmptyComponent: !isLoading ? (
            <View className="flex-1 items-center justify-center">
              <Muted className="text-center">No transactions found</Muted>
            </View>
          ) : null,
          ListFooterComponent: isLoading ? <ActivityIndicator /> : null,
          ListHeaderComponent: (
            <View className=" pb-3">
              <View className="flex-row items-center justify-between">
                <P className="font-semibold">Filters</P>
                <Button
                  className="px-2"
                  onPress={() =>
                    router.push(
                      `/transactions/filters?type=${filters.current.type ?? "all"}&category_id=${filters.current.category_id ?? ""}`
                    )
                  }
                  size="sm"
                  variant="ghost"
                >
                  <SlidersHorizontalIcon
                    className="h-4 w-4 text-primary"
                    size={16}
                  />
                </Button>
              </View>
              <ActiveTransactionFilters />
            </View>
          ),
          onEndReached: fetchMoreTransactions,
          onEndReachedThreshold: 0.1
        }}
        onPressTransaction={(transaction) =>
          router.push(`/(app)/transactions/${transaction.id}`)
        }
      />
    </>
  );
}
