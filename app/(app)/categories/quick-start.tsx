import { useMemo, useState } from "react";

import { router, Stack } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import { toast } from "sonner-native";

import { CategoryList } from "~/components/features/categories/category-list";
import { Button } from "~/components/ui/button";
import { SegmentedControl } from "~/components/ui/segmented-control";
import { Text } from "~/components/ui/text";
import { defaultCategories } from "~/core/config/default-categories";
import { CategoryType } from "~/core/types/category";
import { useCategoriesStore } from "~/store/categories";

export default function CategoriesQuickStartScreen() {
  const createDefaultCategories = useCategoriesStore(
    (state) => state.createDefaultCategories
  );

  const [isLoading, setIsLoading] = useState(false);

  const [selectedCategoryId, setSelectedCategoryId] = useState<
    Record<string, boolean>
  >({});

  const selectedCategoryIds = useMemo(
    () =>
      Object.keys(selectedCategoryId).filter(
        (categoryId) => selectedCategoryId[categoryId]
      ),
    [selectedCategoryId]
  );

  const selectedCategoryIdsLength = selectedCategoryIds.length;

  const [selectedType, setSelectedType] = useState<CategoryType>("expense");

  const filteredCategories = useMemo(
    () =>
      defaultCategories.filter((category) => category.type === selectedType),
    [selectedType]
  );

  const handleContinue = async () => {
    if (!selectedCategoryIdsLength) {
      return;
    }

    try {
      setIsLoading(true);

      const categories = defaultCategories
        .filter((category) => selectedCategoryIds.includes(category.id))
        .map((category) => ({
          emoji: category.emoji,
          title: category.title,
          type: category.type
        }));

      await createDefaultCategories(categories);

      router.back();

      toast.success("Categories saved successfully.");
    } catch (_error) {
      toast.error(
        "An error occurred while saving the categories. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: "📋 Quick Start"
        }}
      />
      <CategoryList
        categories={filteredCategories}
        enableMultiSelect
        flashListProps={{
          extraData: selectedCategoryId,
          ListHeaderComponent: (
            <View className="mb-6">
              <SegmentedControl
                values={["Expense", "Income"]}
                selectedIndex={selectedType === "expense" ? 0 : 1}
                onChange={(event) => {
                  setSelectedType(
                    event.nativeEvent.selectedSegmentIndex === 0
                      ? "expense"
                      : "income"
                  );
                }}
              />
            </View>
          )
        }}
        isSelectable
        isSelected={(category) => selectedCategoryId[category.id]}
        onPressCategory={(category) =>
          setSelectedCategoryId((prev) => ({
            ...prev,
            [category.id]: !prev[category.id]
          }))
        }
      />
      <View className="pb-safe p-6">
        <Button
          className="mb-6"
          disabled={!selectedCategoryIdsLength || isLoading}
          onPress={handleContinue}
        >
          <Text>{`Continue${selectedCategoryIdsLength ? ` (${selectedCategoryIdsLength})` : ""}`}</Text>
          {isLoading && <ActivityIndicator color="white" />}
        </Button>
      </View>
    </>
  );
}
