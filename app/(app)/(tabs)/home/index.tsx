import { FlashList } from "@shopify/flash-list";
import { useRouter } from "expo-router";
import { TouchableOpacity, View } from "react-native";

import { SeeAllTransactionsButton } from "~/components/features/transactions/see-all-transactions-button";
import { TransactionItem } from "~/components/features/transactions/transaction-item";
import { Amount } from "~/components/ui/amount";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { Text } from "~/components/ui/text";
import { H1, Muted, P } from "~/components/ui/typography";
import {
  PlusIcon,
  CirclePlusIcon,
  TargetIcon,
  LayoutGridIcon
} from "~/lib/icons";
import { LIMIT, useTransactionsStore } from "~/store/transactions";

export default function HomeScreen() {
  const router = useRouter();

  const { transactions, totalBalance } = useTransactionsStore();

  const recentTransactions = transactions.slice(0, LIMIT);

  const handleCreateTransaction = () => {
    router.push("/(app)/transactions/new");
  };

  const hasTransactions = transactions.length > 0;

  return (
    <>
      <FlashList
        contentInsetAdjustmentBehavior="automatic"
        data={recentTransactions}
        contentContainerStyle={{
          padding: 24
        }}
        estimatedItemSize={64}
        ItemSeparatorComponent={(props) => <Separator {...props} />}
        ListFooterComponent={
          transactions.length === LIMIT ? (
            <View className="items-center pt-3">
              <SeeAllTransactionsButton />
            </View>
          ) : null
        }
        ListHeaderComponent={
          <View className="gap-6 pb-3">
            {hasTransactions ? (
              <View className="gap-1">
                <Muted className="text-muted-foreground">Total Balance</Muted>
                <Amount
                  as={H1}
                  amount={totalBalance}
                  type={totalBalance > 0 ? "income" : "expense"}
                />
              </View>
            ) : (
              <P>Start tracking your finances by:</P>
            )}
            <TouchableOpacity
              className="flex-row items-center gap-3 rounded-xl border border-border p-3"
              onPress={() => router.push("/categories/new")}
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
            {hasTransactions ? (
              <View className="flex-row items-center justify-between">
                <P className="font-semibold">History</P>
                <SeeAllTransactionsButton />
              </View>
            ) : (
              <View className="gap-6">
                <Muted className="text-center">or</Muted>
                <Button onPress={handleCreateTransaction}>
                  <Text>Add your first transaction</Text>
                </Button>
              </View>
            )}
          </View>
        }
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
