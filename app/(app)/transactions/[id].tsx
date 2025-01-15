import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTheme } from "@react-navigation/native";
import { addMonths, parseISO } from "date-fns";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Switch,
  View
} from "react-native";
import CurrencyInput from "react-native-currency-input";
import { toast } from "sonner-native";

import type { TransactionFormData } from "~/core/types/transaction";

import { CategoryPicker } from "~/components/features/categories/category-picker";
import { GoalPicker } from "~/components/features/goals/goal-picker";
import { Button } from "~/components/ui/button";
import { DatePicker } from "~/components/ui/date-picker";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { SegmentedControl } from "~/components/ui/segmented-control";
import { Text } from "~/components/ui/text";
import { Small } from "~/components/ui/typography";
import {
  promptForReview,
  shouldPromptForReview
} from "~/core/services/app-review";
import { formatCurrency, getCurrencyByCode } from "~/core/utils/currency";
import { generateRecurringDates } from "~/core/utils/generate-recurring-dates";
import { generateId } from "~/core/utils/id";
import { transactionFormSchema } from "~/core/validations/transaction";
import { useCategoriesStore } from "~/store/categories";
import { useCurrencyStore } from "~/store/currency";
import { useGoalsStore } from "~/store/goals";
import { useTransactionsStore } from "~/store/transactions";

const frequencyOptions = ["Daily", "Weekly", "Monthly", "Yearly"];

export default function TransactionFormScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const theme = useTheme();

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

  const currencyCode = useCurrencyStore((state) => state.currency);

  const selectedCurrency = getCurrencyByCode(currencyCode);

  const { control, handleSubmit, setValue, watch } =
    useForm<TransactionFormData>({
      resolver: zodResolver(transactionFormSchema),
      defaultValues: transaction ?? {
        type: "expense",
        datetime: new Date().toISOString(),
        isRecurring: false
      }
    });

  const onSubmit = async ({
    isRecurring,
    recurring,
    ...data
  }: TransactionFormData) => {
    try {
      setIsLoading(true);

      if (isEditing) {
        await updateTransaction(id, data);
      } else {
        if (isRecurring && recurring) {
          const recurringId = generateId(); // Generate UUID for recurring group

          const dates = generateRecurringDates({
            ...recurring,
            startDate: data.datetime!
          });

          // Create all recurring transactions
          await createTransaction(
            dates.map((date) => ({
              ...data,
              datetime: date.toISOString(),
              recurring_id: recurringId
            }))
          );
        } else {
          await createTransaction([data]);
        }

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
    const handleDeleteTransaction = async (deleteFutureTransactions?: {
      recurringId: string;
      startDate: string;
    }) => {
      try {
        setIsDeleting(true);

        await deleteTransaction(id, deleteFutureTransactions);

        router.back();

        toast.success("Transaction deleted successfully.");
      } catch (_error) {
        toast.error(
          "An error occurred while deleting the transaction. Please try again."
        );
      } finally {
        setIsDeleting(false);
      }
    };

    if (transaction?.recurring_id) {
      Alert.alert(
        "Delete Recurring Transaction",
        "This is part of a recurring transaction. Would you like to delete:",
        [
          {
            text: "Cancel",
            style: "cancel"
          },
          {
            text: "This Transaction Only",
            onPress: async () => handleDeleteTransaction()
          },
          {
            text: "This and Future Transactions",
            onPress: async () =>
              handleDeleteTransaction({
                recurringId: transaction.recurring_id,
                startDate: transaction.datetime
              })
          }
        ]
      );

      return;
    }

    Alert.alert("Delete transaction", "Are you sure?", [
      {
        text: "Cancel",
        style: "cancel"
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => handleDeleteTransaction()
      }
    ]);
  };

  const type = watch("type");

  const isRecurring = watch("isRecurring");

  const endDate = watch("recurring.endDate");

  const datetime = watch("datetime");

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
              <DatePicker
                error={error?.message}
                label="Date"
                onChange={onChange}
                placeholder="Select date"
                value={value}
              />
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

          <Controller
            control={control}
            render={({ field: { onChange, value } }) => {
              const handleOnChange = (nextValue: boolean) => {
                onChange(nextValue);

                const startDate = datetime ? parseISO(datetime) : new Date();

                setValue(
                  "recurring",
                  nextValue
                    ? {
                        frequency: "monthly",
                        endDate: addMonths(startDate, 6).toISOString()
                      }
                    : undefined
                );
              };

              return (
                <View className="flex-row items-center justify-between">
                  <Label
                    nativeID="isRecurring"
                    onPress={() => handleOnChange(!value)}
                  >
                    Recurring Transaction
                  </Label>
                  <Switch
                    trackColor={{ true: theme.colors.primary }}
                    onValueChange={handleOnChange}
                    value={value}
                  />
                </View>
              );
            }}
            name="isRecurring"
          />

          {/* Recurring Options */}
          {isRecurring && (
            <>
              <Controller
                control={control}
                render={({ field: { onChange, value } }) => (
                  <View className="gap-2">
                    <Label>Frequency</Label>
                    <SegmentedControl
                      values={frequencyOptions}
                      selectedIndex={frequencyOptions.indexOf(
                        value?.charAt(0).toUpperCase() + value?.slice(1)
                      )}
                      onChange={(event) => {
                        onChange(
                          frequencyOptions[
                            event.nativeEvent.selectedSegmentIndex
                          ].toLowerCase()
                        );
                      }}
                    />
                  </View>
                )}
                name="recurring.frequency"
              />

              <View className="gap-2">
                <Label>End By</Label>
                <SegmentedControl
                  values={["End Date", "Occurrences"]}
                  selectedIndex={endDate ? 0 : 1}
                  onChange={(event) => {
                    if (event.nativeEvent.selectedSegmentIndex === 0) {
                      setValue("recurring.occurrences", undefined);

                      setValue(
                        "recurring.endDate",
                        addMonths(new Date(), 6).toISOString()
                      );
                    } else {
                      setValue("recurring.endDate", undefined);

                      setValue("recurring.occurrences", 6);
                    }
                  }}
                />
              </View>

              {endDate ? (
                <Controller
                  control={control}
                  key="recurring.endDate"
                  render={({
                    field: { onChange, value },
                    fieldState: { error }
                  }) => (
                    <DatePicker
                      error={error?.message}
                      mode="date"
                      onChange={onChange}
                      placeholder="Select date"
                      value={value}
                    />
                  )}
                  name="recurring.endDate"
                />
              ) : (
                <Controller
                  control={control}
                  key="recurring.occurrences"
                  render={({
                    field: { onChange, onBlur, value },
                    fieldState: { error }
                  }) => (
                    <Input
                      error={error?.message}
                      keyboardType="number-pad"
                      onBlur={onBlur}
                      onChangeText={(newValue) =>
                        onChange(newValue ? parseInt(newValue, 10) : 0)
                      }
                      placeholder="Number of times"
                      value={`${value}`}
                    />
                  )}
                  name="recurring.occurrences"
                />
              )}
            </>
          )}

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
