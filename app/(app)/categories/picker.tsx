import { useMemo, useState } from "react";

import { FlashList } from "@shopify/flash-list";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { View } from "react-native";

import { CategoryItem } from "~/components/features/categories/category-item";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { Text } from "~/components/ui/text";
import { events } from "~/core/services/events";
import { Category, CategoryType } from "~/core/types/category";
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

  const renderItem = ({ index, item }: { index: number; item: Category }) => {
    const isFirst = index === 0;

    const isLast = index === filteredCategories.length - 1;

    return (
      <CategoryItem
        category={item}
        isFirst={isFirst}
        isLast={isLast}
        isSelectable
        isSelected={item.id === selectedCategoryId}
        onPress={(category) => setSelectedCategoryId(category.id)}
      />
    );
  };

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
      <FlashList
        contentInsetAdjustmentBehavior="automatic"
        data={filteredCategories}
        extraData={selectedCategoryId}
        contentContainerStyle={{
          padding: 24
        }}
        estimatedItemSize={64}
        ItemSeparatorComponent={Separator}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
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
