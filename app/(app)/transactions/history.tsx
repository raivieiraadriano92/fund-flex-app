import { useEffect, useMemo, useState } from "react";

import { endOfToday, parseISO } from "date-fns";
import { Stack, useRouter } from "expo-router";
import { View } from "react-native";

import { ActiveTransactionFilters } from "~/components/features/transactions/active-transaction-filters";
import { TransactionList } from "~/components/features/transactions/transaction-list";
import { Button } from "~/components/ui/button";
import { Muted, P } from "~/components/ui/typography";
import { events } from "~/core/services/events";
import { TransactionFiltersFormData } from "~/core/types/transaction";
import { objectToQueryString } from "~/core/utils/url";
import { SlidersHorizontalIcon } from "~/lib/icons";
import { useTransactionsStore } from "~/store/transactions";

export default function TransactionsHistoryScreen() {
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");

  const transactions = useTransactionsStore((state) => state.transactions);

  const [filters, setFilters] = useState<TransactionFiltersFormData>({
    type: "all",
    period: "custom",
    endDate: endOfToday().toISOString()
  });

  const transactionsFiltered = useMemo(
    () =>
      transactions.filter(
        (transaction) =>
          // filter by search query
          (searchQuery
            ? transaction.title
                .toLowerCase()
                .includes(searchQuery.toLowerCase())
            : true) &&
          // filter by type
          (filters.type === "all" ? true : transaction.type === filters.type) &&
          // filter by category
          (filters.category_id
            ? transaction.category_id === filters.category_id
            : true) &&
          // filter by start date
          (filters.startDate
            ? parseISO(transaction.datetime) >= parseISO(filters.startDate)
            : true) &&
          // filter by end date
          (filters.endDate
            ? parseISO(transaction.datetime) <= parseISO(filters.endDate)
            : true)
      ),
    [
      filters.category_id,
      filters.endDate,
      filters.startDate,
      filters.type,
      searchQuery,
      transactions
    ]
  );

  useEffect(() => {
    events.on("transaction:applyFilter", setFilters);

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
            onCancelButtonPress: () => setSearchQuery(""),
            onChangeText: (event) => setSearchQuery(event.nativeEvent.text)
          },
          title: "📝 History"
        }}
      />
      <TransactionList
        transactions={transactionsFiltered}
        flashListProps={{
          ListEmptyComponent: (
            <View className="flex-1 items-center justify-center">
              <Muted className="text-center">No transactions found</Muted>
            </View>
          ),
          ListHeaderComponent: (
            <View className=" pb-3">
              <View className="flex-row items-center justify-between">
                <P className="font-semibold">Filters</P>
                <Button
                  className="px-2"
                  onPress={() =>
                    router.push(
                      `/transactions/filters?${objectToQueryString(filters)}`
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
              <ActiveTransactionFilters filters={filters} />
            </View>
          )
        }}
        onPressTransaction={(transaction) =>
          router.push(`/(app)/transactions/${transaction.id}`)
        }
      />
    </>
  );
}
