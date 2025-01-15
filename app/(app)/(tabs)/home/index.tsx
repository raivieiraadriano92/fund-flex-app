import { Stack, useRouter } from "expo-router";
import { TouchableOpacity, View } from "react-native";

import { SetYourGoalsCard } from "~/components/features/goals/set-your-goals-card";
import { SeeAllTransactionsButton } from "~/components/features/transactions/see-all-transactions-button";
import { TransactionList } from "~/components/features/transactions/transaction-list";
import { Amount } from "~/components/ui/amount";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { H1, Muted, P } from "~/components/ui/typography";
import { PlusIcon, CirclePlusIcon, LayoutGridIcon } from "~/lib/icons";
import { useCategoriesStore } from "~/store/categories";
import { LIMIT, useTransactionsStore } from "~/store/transactions";

export default function HomeScreen() {
  const router = useRouter();

  const { transactions, count, totalBalance } = useTransactionsStore();

  const categoriesLength = useCategoriesStore(
    (state) => state.categories.length
  );

  const recentTransactions = transactions.slice(0, LIMIT);

  const handleCreateTransaction = () => {
    router.push("/(app)/transactions/new");
  };

  const hasTransactions = count > 0;

  const addNewCategoriesCard = (
    <TouchableOpacity
      className="flex-row items-center gap-3 rounded-xl border border-border p-3"
      onPress={() =>
        router.push(categoriesLength ? "/categories/new" : "/categories")
      }
    >
      <View className="h-12 w-12 items-center justify-center rounded-lg bg-primary-foreground">
        <LayoutGridIcon className="text-primary" />
      </View>
      <View className="flex-1">
        <P className="font-semibold">Add New Categories</P>
        <Muted>Organize your finances by custom categories</Muted>
      </View>
      <CirclePlusIcon className="rounded-full bg-primary-foreground text-primary" />
    </TouchableOpacity>
  );

  if (!hasTransactions) {
    return (
      <>
        <Stack.Screen
          options={{
            headerShown: false
          }}
        />
        <View className="flex-1 justify-center gap-16 p-6">
          <View className="gap-3">
            <H1>Welcome to FundFlex 👋</H1>
            <P>Start tracking your finances by:</P>
          </View>
          <View className="gap-3">
            {addNewCategoriesCard}
            <SetYourGoalsCard />
            <Muted className="text-center">and then</Muted>
            <Button onPress={handleCreateTransaction}>
              <Text>Add your first transaction</Text>
            </Button>
          </View>
        </View>
      </>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerLargeTitle: true,
          headerShown: true,
          title: "💰 Overview"
        }}
      />
      <TransactionList
        transactions={recentTransactions}
        flashListProps={{
          ListFooterComponent:
            transactions.length === LIMIT ? (
              <View className="items-center pt-3">
                <SeeAllTransactionsButton />
              </View>
            ) : null,
          ListHeaderComponent: (
            <View className="gap-6 pb-3">
              <View className="gap-1">
                <Muted className="text-muted-foreground">Total Balance</Muted>
                <Amount
                  as={H1}
                  amount={totalBalance}
                  type={totalBalance > 0 ? "income" : "expense"}
                />
              </View>
              <View className="gap-3">
                {addNewCategoriesCard}
                <SetYourGoalsCard />
              </View>
              <View className="flex-row items-center justify-between">
                <P className="font-semibold">History</P>
                <SeeAllTransactionsButton />
              </View>
            </View>
          )
        }}
        onPressTransaction={(transaction) =>
          router.push(`/(app)/transactions/${transaction.id}`)
        }
      />
      {hasTransactions && (
        <Button
          className="native:w-14 absolute bottom-4 right-4 w-11 rounded-full p-0"
          onPress={handleCreateTransaction}
          size="lg"
        >
          <PlusIcon className="text-white" />
        </Button>
      )}
    </>
  );
}
