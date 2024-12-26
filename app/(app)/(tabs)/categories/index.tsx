import { useState, useMemo } from "react";

import { FlashList } from "@shopify/flash-list";
import { useRouter } from "expo-router";
import { View } from "react-native";

import type { Category, CategoryType } from "~/core/types/category";

import { CategoryItem } from "~/components/features/categories/category-item";
import { Button } from "~/components/ui/button";
import { SegmentedControl } from "~/components/ui/segmented-control";
import { Separator } from "~/components/ui/separator";
import { PlusIcon } from "~/lib/icons";
import { useCategoriesStore } from "~/store/categories";

export default function CategoriesScreen() {
  const router = useRouter();

  const categories = useCategoriesStore((state) => state.categories);

  const [selectedType, setSelectedType] = useState<CategoryType>("expense");

  const filteredCategories = useMemo(
    () => categories.filter((category) => category.type === selectedType),
    [categories, selectedType]
  );

  const handleCategoryPress = (category: Category) => {
    router.push(`/(app)/categories/${category.id}`);
  };

  const renderItem = ({ index, item }: { index: number; item: Category }) => {
    const isFirst = index === 0;

    const isLast = index === filteredCategories.length - 1;

    return (
      <CategoryItem
        category={item}
        isFirst={isFirst}
        isLast={isLast}
        onPress={handleCategoryPress}
      />
    );
  };

  const handleCreateCategory = () => {
    router.push("/(app)/categories/new");
  };

  return (
    <>
      <FlashList
        contentInsetAdjustmentBehavior="automatic"
        data={filteredCategories}
        contentContainerStyle={{
          padding: 24
        }}
        estimatedItemSize={64}
        ListHeaderComponent={
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
        }
        ItemSeparatorComponent={Separator}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
      />
      <Button
        className="native:w-14 absolute bottom-4 right-4 w-11 rounded-full p-0"
        onPress={handleCreateCategory}
        size="lg"
      >
        <PlusIcon className="text-white" />
      </Button>
    </>
  );
}
