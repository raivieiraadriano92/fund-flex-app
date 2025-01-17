import { endOfDay, endOfToday, parseISO, startOfDay } from "date-fns";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { ScrollView, View } from "react-native";

import { CategoryPicker } from "~/components/features/categories/category-picker";
import { Button } from "~/components/ui/button";
import { DatePicker } from "~/components/ui/date-picker";
import { Label } from "~/components/ui/label";
import { SegmentedControl } from "~/components/ui/segmented-control";
import { Text } from "~/components/ui/text";
import { events } from "~/core/services/events";
import { TransactionFiltersFormData } from "~/core/types/transaction";
import { useCategoriesStore } from "~/store/categories";

const periodOptions = ["All", "Custom"];

export default function TransactionsFiltersScreen() {
  const defaultValues = useLocalSearchParams<TransactionFiltersFormData>();

  const { control, handleSubmit, reset, setValue, watch } =
    useForm<TransactionFiltersFormData>({
      defaultValues: {
        type: defaultValues.type ?? "all",
        category_id: defaultValues.category_id ?? undefined,
        period: defaultValues.period ?? "custom",
        startDate: defaultValues.startDate ?? undefined,
        endDate: defaultValues.endDate ?? endOfToday().toISOString()
      }
    });

  const categories = useCategoriesStore((state) => state.categories);

  const type = watch("type");

  const handleApply = async (data: TransactionFiltersFormData) => {
    events.emit("transaction:applyFilter", data);

    router.back();
  };

  const handleReset = () =>
    reset({
      type: "all",
      category_id: "",
      period: "custom",
      startDate: undefined,
      endDate: endOfToday().toISOString()
    });

  const period = watch("period");

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: "Filters"
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
                  values={["All", "Expense", "Income"]}
                  selectedIndex={
                    value === "all" ? 0 : value === "expense" ? 1 : 2
                  }
                  onChange={(event) => {
                    onChange(
                      event.nativeEvent.selectedSegmentIndex === 0
                        ? "all"
                        : event.nativeEvent.selectedSegmentIndex === 1
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
            render={({ field: { onChange, value }, fieldState: { error } }) => {
              const selectedCategory = categories.find(
                (category) => category.id === value
              );

              return (
                <CategoryPicker
                  error={error?.message}
                  isDisabled={type === "all"}
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
            render={({ field: { onChange, value } }) => (
              <View className="gap-2">
                <Label>Period</Label>
                <SegmentedControl
                  values={periodOptions}
                  selectedIndex={periodOptions.indexOf(
                    value?.charAt(0).toUpperCase() + value?.slice(1)
                  )}
                  onChange={(event) => {
                    const index = event.nativeEvent.selectedSegmentIndex;

                    onChange(periodOptions[index].toLowerCase());

                    if (index === 0) {
                      setValue("startDate", undefined);

                      setValue("endDate", undefined);
                    } else {
                      setValue("endDate", new Date().toISOString());
                    }
                  }}
                />
              </View>
            )}
            name="period"
          />

          {period === "custom" && (
            <>
              <Controller
                control={control}
                key="startDate"
                render={({
                  field: { onChange, value },
                  fieldState: { error }
                }) => (
                  <DatePicker
                    error={error?.message}
                    label="Start Date"
                    onChange={(newValue) =>
                      onChange(startOfDay(parseISO(newValue)).toISOString())
                    }
                    placeholder="Select date"
                    value={value}
                  />
                )}
                name="startDate"
              />
              <Controller
                control={control}
                key="endDate"
                render={({
                  field: { onChange, value },
                  fieldState: { error }
                }) => (
                  <DatePicker
                    error={error?.message}
                    label="End Date"
                    onChange={(newValue) =>
                      onChange(endOfDay(parseISO(newValue)).toISOString())
                    }
                    placeholder="Select date"
                    value={value}
                  />
                )}
                name="endDate"
              />
            </>
          )}
        </View>
      </ScrollView>
      <View className="pb-safe gap-3 p-6">
        <Button onPress={handleSubmit(handleApply)}>
          <Text>Apply</Text>
        </Button>
        <Button className="mb-6" onPress={handleReset} variant="outline">
          <Text>Clear</Text>
        </Button>
      </View>
    </>
  );
}
