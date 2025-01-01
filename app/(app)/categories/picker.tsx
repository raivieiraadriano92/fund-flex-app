import { useMemo, useState } from "react";

import { router, Stack, useLocalSearchParams } from "expo-router";
import { View } from "react-native";

import { CategoryList } from "~/components/features/categories/category-list";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { events } from "~/core/services/events";
import { CategoryType } from "~/core/types/category";
import { useCategoriesStore } from "~/store/categories";

export default function CategoryPickerScreen() {
  const categories = useCategoriesStore((state) => state.categories);

  const { type, defaultValue } = useLocalSearchParams<{
    defaultValue?: string;
    type: CategoryType;
  }>();

  const [selectedCategoryId, setSelectedCategoryId] = useState<
    string | undefined
  >(defaultValue);

  const filteredCategories = useMemo(
    () => categories.filter((category) => category.type === type),
    [categories, type]
  );

  const handleContinue = () => {
    if (!selectedCategoryId) {
      return;
    }

    events.emit("category:selected", selectedCategoryId);

    router.back();
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: "📋 Category Picker"
        }}
      />
      <CategoryList
        categories={filteredCategories}
        flashListProps={{ extraData: selectedCategoryId }}
        isSelectable
        isSelected={(category) => category.id === selectedCategoryId}
        onPressCategory={(category) => setSelectedCategoryId(category.id)}
      />
      <View className="pb-safe p-6">
        <Button
          className="mb-6"
          disabled={!selectedCategoryId}
          onPress={handleContinue}
        >
          <Text>Continue</Text>
        </Button>
      </View>
    </>
  );
}
