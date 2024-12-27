import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { HeaderButton } from "@react-navigation/elements";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { ActivityIndicator, Alert, ScrollView, View } from "react-native";
import CurrencyInput from "react-native-currency-input";
import { toast } from "sonner-native";

import type { TransactionFormData } from "~/core/types/transaction";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Picker } from "~/components/ui/picker";
import { SegmentedControl } from "~/components/ui/segmented-control";
import { Text } from "~/components/ui/text";
import { Small } from "~/components/ui/typography";
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

  const { control, handleSubmit, setValue, watch } =
    useForm<TransactionFormData>({
      resolver: zodResolver(transactionFormSchema),
      defaultValues: transaction ?? {
        type: "expense",
        datetime: new Date().toISOString()
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
    } catch (_error) {
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
    (category) => category.type === watch("type")
  );

  return (
    <>
      <Stack.Screen
        options={{
          headerRight: () =>
            isEditing && (
              <HeaderButton
                accessibilityLabel="Delete category"
                disabled={isDeleting}
                onPress={handleDelete}
              >
                {isDeleting ? (
                  <ActivityIndicator className="text-destructive" />
                ) : (
                  <TrashIcon className="text-destructive" />
                )}
              </HeaderButton>
            ),
          headerTitle: transaction ? transaction?.title : "💰 New Transaction"
        }}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerClassName="p-6"
        keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator={false}
      >
        <View className="gap-6">
          <Controller
            control={control}
            render={({ field: { onChange, value } }) => (
              <View className="gap-2">
                <Label>Type</Label>
                <SegmentedControl
                  values={["Expense", "Income"]}
                  selectedIndex={value === "expense" ? 0 : 1}
                  onChange={(event) => {
                    onChange(
                      event.nativeEvent.selectedSegmentIndex === 0
                        ? "expense"
                        : "income"
                    );

                    // Clear category when type changes since they're different
                    setValue("category_id", "");
                  }}
                />
              </View>
            )}
            name="type"
          />

          <Controller
            control={control}
            render={({
              field: { onChange, onBlur, value },
              fieldState: { error }
            }) => (
              <View className="gap-2">
                <Label>Amount</Label>
                <CurrencyInput
                  autoFocus
                  className="text-5xl font-bold text-foreground"
                  keyboardType="number-pad"
                  onBlur={onBlur}
                  onChangeValue={(value) => onChange(value ?? 0)}
                  placeholder="$0,00"
                  placeholderClassName="text-muted-foreground"
                  prefix="$"
                  style={{ lineHeight: 57.6 }}
                  value={value}
                />
                {!!error?.message && (
                  <Small className="text-destructive">{error?.message}</Small>
                )}
              </View>
            )}
            name="amount"
          />

          <Controller
            control={control}
            render={({
              field: { onChange, onBlur, value },
              fieldState: { error }
            }) => (
              <Input
                error={error?.message}
                label="Title"
                onBlur={onBlur}
                onChangeText={onChange}
                placeholder="Enter title"
                value={value}
              />
            )}
            name="title"
          />

          <Controller
            control={control}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <Picker
                error={error?.message}
                label="Category"
                onSelect={onChange}
                options={filteredCategories}
                optionLabelToken="title"
                optionValueToken="id"
                placeholder="Select category"
                value={value}
              />
            )}
            name="category_id"
          />

          <Controller
            control={control}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <Input
                label="Date"
                onChangeText={onChange}
                placeholder="Select date"
                value={new Date(value).toLocaleDateString()}
                error={error?.message}
              />
            )}
            name="datetime"
          />

          <Controller
            control={control}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <Picker
                error={error?.message}
                label="Link to Goal (Optional)"
                onSelect={onChange}
                options={goals}
                optionLabelToken="title"
                optionValueToken="id"
                placeholder="Select goal"
                value={value}
              />
            )}
            name="goal_id"
          />

          <Button
            onPress={handleSubmit(onSubmit)}
            disabled={isLoading || isDeleting}
          >
            <Text>{isEditing ? "Update" : "Create"} Transaction</Text>
            {isLoading && <ActivityIndicator color="white" />}
          </Button>
        </View>
      </ScrollView>
    </>
  );
}
