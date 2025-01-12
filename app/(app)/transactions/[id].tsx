import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { format, parseISO } from "date-fns";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { ActivityIndicator, Alert, ScrollView, View } from "react-native";
import CurrencyInput from "react-native-currency-input";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { toast } from "sonner-native";

import type { TransactionFormData } from "~/core/types/transaction";

import { CategoryPicker } from "~/components/features/categories/category-picker";
import { GoalPicker } from "~/components/features/goals/goal-picker";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { PickerButton } from "~/components/ui/picker";
import { SegmentedControl } from "~/components/ui/segmented-control";
import { Text } from "~/components/ui/text";
import { Small } from "~/components/ui/typography";
import {
  promptForReview,
  shouldPromptForReview
} from "~/core/services/app-review";
import { formatCurrency, getCurrencyByCode } from "~/core/utils/currency";
import { transactionFormSchema } from "~/core/validations/transaction";
import { CalendarIcon } from "~/lib/icons";
import { useCategoriesStore } from "~/store/categories";
import { useCurrencyStore } from "~/store/currency";
import { useGoalsStore } from "~/store/goals";
import { useTransactionsStore } from "~/store/transactions";

export default function TransactionFormScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const router = useRouter();

  const isEditing = id !== "new";

  const [isLoading, setIsLoading] = useState(false);

  const [isDeleting, setIsDeleting] = useState(false);

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const transaction = useTransactionsStore((state) =>
    isEditing ? state.transactions.find((t) => t.id === id) : null
  );

  const categories = useCategoriesStore((state) => state.categories);

  const goals = useGoalsStore((state) => state.goals);

  const { createTransaction, deleteTransaction, updateTransaction } =
    useTransactionsStore();

  const currencyCode = useCurrencyStore((state) => state.currency);

  const selectedCurrency = getCurrencyByCode(currencyCode);

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

        // Check and prompt for review after successful creation
        const shouldPrompt = await shouldPromptForReview();

        if (shouldPrompt) {
          await promptForReview();
        }
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

  const type = watch("type");

  return (
    <>
      <Stack.Screen
        options={{
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
                  precision={selectedCurrency?.decimalPlaces}
                  keyboardType="number-pad"
                  onBlur={onBlur}
                  onChangeValue={(value) => onChange(value ?? 0)}
                  placeholder={formatCurrency(0, currencyCode)}
                  placeholderClassName="text-muted-foreground"
                  prefix={
                    selectedCurrency?.symbolPosition === "prefix"
                      ? `${selectedCurrency?.symbol}${selectedCurrency?.spaceAfterSymbol ? " " : ""}`
                      : ""
                  }
                  suffix={
                    selectedCurrency?.symbolPosition === "suffix"
                      ? `${selectedCurrency?.spaceAfterSymbol ? " " : ""}${selectedCurrency?.symbol}`
                      : ""
                  }
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
            render={({ field: { onChange, value }, fieldState: { error } }) => {
              const selectedCategory = categories.find(
                (category) => category.id === value
              );

              return (
                <CategoryPicker
                  error={error?.message}
                  onChange={onChange}
                  selectedCategory={selectedCategory}
                  type={type}
                />
              );
            }}
            name="category_id"
          />

          <Controller
            control={control}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <View className="gap-2">
                <Label>Date</Label>
                <PickerButton
                  Icon={CalendarIcon}
                  onPress={() => setDatePickerVisibility(true)}
                  placeholder="Select date"
                  title={
                    value && format(parseISO(value), "MMM dd, yyyy hh:mm a")
                  }
                />
                {!!error && (
                  <Small className="text-destructive">{error.message}</Small>
                )}
                <DateTimePickerModal
                  mode="datetime"
                  onCancel={() => setDatePickerVisibility(false)}
                  onConfirm={(date) => {
                    onChange(date.toISOString());

                    setDatePickerVisibility(false);
                  }}
                  isVisible={isDatePickerVisible}
                />
              </View>
            )}
            name="datetime"
          />

          <Controller
            control={control}
            render={({ field: { onChange, value }, fieldState: { error } }) => {
              const selectedGoal = goals.find(
                (category) => category.id === value
              );

              return (
                <GoalPicker
                  error={error?.message}
                  onChange={onChange}
                  selectedGoal={selectedGoal}
                />
              );
            }}
            name="goal_id"
          />

          <Button
            onPress={handleSubmit(onSubmit)}
            disabled={isLoading || isDeleting}
          >
            <Text>{isEditing ? "Update" : "Create"} Transaction</Text>
            {isLoading && <ActivityIndicator color="white" />}
          </Button>

          {isEditing && (
            <Button
              disabled={isDeleting}
              onPress={handleDelete}
              variant="ghost"
            >
              <Text className="text-destructive group-active:text-destructive">
                Delete
              </Text>
              {isDeleting && <ActivityIndicator className="text-destructive" />}
            </Button>
          )}
        </View>
      </ScrollView>
    </>
  );
}
