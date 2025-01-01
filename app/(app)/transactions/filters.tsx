import { router, Stack, useLocalSearchParams } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { ScrollView, View } from "react-native";

import { CategoryPicker } from "~/components/features/categories/category-picker";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { SegmentedControl } from "~/components/ui/segmented-control";
import { Text } from "~/components/ui/text";
import { events } from "~/core/services/events";
import { TransactionFiltersFormData } from "~/core/types/transaction";
import { useCategoriesStore } from "~/store/categories";

export default function TransactionsFiltersScreen() {
  const defaultValues = useLocalSearchParams<TransactionFiltersFormData>();

  const { control, handleSubmit, reset, setValue, watch } =
    useForm<TransactionFiltersFormData>({
      defaultValues: {
        type: defaultValues.type ?? "all",
        category_id: defaultValues.category_id ?? undefined
      }
    });

  const categories = useCategoriesStore((state) => state.categories);

  const type = watch("type");

  const handleApply = async (data: TransactionFiltersFormData) => {
    events.emit("transaction:applyFilter", data);

    router.back();
  };

  const handleReset = () => reset({ type: "all", category_id: "" });

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
