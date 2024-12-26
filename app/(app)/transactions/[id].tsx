import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useForm } from "react-hook-form";
import { ActivityIndicator, Alert, ScrollView, View } from "react-native";
import { toast } from "sonner-native";

import type { TransactionFormData } from "~/core/types/transaction";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { SegmentedControl } from "~/components/ui/segmented-control";
import { Text } from "~/components/ui/text";
import { P } from "~/components/ui/typography";
import { transactionFormSchema } from "~/core/validations/transaction";
import { TrashIcon } from "~/lib/icons";
import { useCategoriesStore } from "~/store/categories";
import { useGoalsStore } from "~/store/goals";
import { useTransactionsStore } from "~/store/transactions";

export default function TransactionFormScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const router = useRouter();

  const isEditing = id !== "new";

  const [isLoading, setIsLoading] = useState(false);

  const [isDeleting, setIsDeleting] = useState(false);

  const transaction = useTransactionsStore((state) =>
    isEditing ? state.transactions.find((t) => t.id === id) : null
  );

  const categories = useCategoriesStore((state) => state.categories);

  const goals = useGoalsStore((state) => state.goals);

  const { createTransaction, deleteTransaction, updateTransaction } =
    useTransactionsStore();

  const form = useForm<TransactionFormData>({
    resolver: zodResolver(transactionFormSchema),
    defaultValues: transaction ?? {
      type: "expense",
      amount: 0,
      title: "",
      datetime: new Date().toISOString(),
      category_id: "",
      goal_id: undefined
    }
  });

  const onSubmit = async (data: TransactionFormData) => {
    try {
      setIsLoading(true);

      if (isEditing) {
        await updateTransaction(id, data);
      } else {
        await createTransaction(data);
      }

      router.back();

      toast.success("Transaction saved successfully.");
    } catch (error) {
      toast.error(
        "An error occurred while saving the transaction. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    Alert.alert("Delete transaction", "Are you sure?", [
      {
        text: "Cancel",
        style: "cancel"
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            setIsDeleting(true);

            await deleteTransaction(id);

            router.back();

            toast.success("Transaction deleted successfully.");
          } catch (_error) {
            toast.error(
              "An error occurred while deleting the transaction. Please try again."
            );
          } finally {
            setIsDeleting(false);
          }
        }
      }
    ]);
  };

  const filteredCategories = categories.filter(
    (category) => category.type === form.watch("type")
  );

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: transaction ? transaction?.title : "New Transaction"
        }}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerClassName="p-6"
        keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator={false}
      >
        <View className="gap-6">
          <View>
            <P className="mb-2">Type</P>
            <SegmentedControl
              values={["Expense", "Income"]}
              selectedIndex={form.watch("type") === "expense" ? 0 : 1}
              onChange={(event) => {
                form.setValue(
                  "type",
                  event.nativeEvent.selectedSegmentIndex === 0
                    ? "expense"
                    : "income"
                );

                // Clear category when type changes since they're different
                form.setValue("category_id", "");
              }}
            />
          </View>

          <View>
            <P className="mb-2">Amount</P>
            <Input
              keyboardType="numeric"
              placeholder="Enter amount"
              value={form.watch("amount").toString()}
              onChangeText={(value) => {
                const amount = parseFloat(value) || 0;

                form.setValue("amount", amount);
              }}
              error={form.formState.errors.amount?.message}
            />
          </View>

          <View>
            <P className="mb-2">Title</P>
            <Input
              placeholder="Enter title"
              value={form.watch("title")}
              onChangeText={(value) => form.setValue("title", value)}
              error={form.formState.errors.title?.message}
            />
          </View>

          <View>
            <P className="mb-2">Category</P>
            {/* This would be a custom picker/selector component */}
            <Input
              placeholder="Select category"
              //   value={
              //     categories.find((c) => c.id === form.watch("category_id"))
              //       ?.title ?? ""
              //   }
              value={form.watch("category_id")}
              onChangeText={(value) => form.setValue("category_id", value)}
              error={form.formState.errors.category_id?.message}
            />
          </View>

          <View>
            <P className="mb-2">Date</P>
            {/* This would be a date picker component */}
            <Input
              placeholder="Select date"
              value={new Date(form.watch("datetime")).toLocaleDateString()}
              error={form.formState.errors.datetime?.message}
            />
          </View>

          {/* Goal selection would be optional */}
          <View>
            <P className="mb-2">Link to Goal (Optional)</P>
            {/* This would be a custom picker/selector component */}
            <Input
              placeholder="Select goal"
              value={
                goals.find((g) => g.id === form.watch("goal_id"))?.title ?? ""
              }
            />
          </View>

          <Button onPress={form.handleSubmit(onSubmit)} disabled={isLoading}>
            <Text>{isEditing ? "Update" : "Create"} Transaction</Text>
            {isLoading && <ActivityIndicator color="white" />}
          </Button>

          {isEditing && (
            <Button
              className="mt-4"
              disabled={isDeleting}
              onPress={handleDelete}
              variant="destructive"
            >
              <TrashIcon className="text-destructive-foreground" />
              <Text className="text-destructive-foreground">
                Delete Category
              </Text>
              {isDeleting && <ActivityIndicator color="white" />}
            </Button>
          )}
        </View>
      </ScrollView>
    </>
  );
}
