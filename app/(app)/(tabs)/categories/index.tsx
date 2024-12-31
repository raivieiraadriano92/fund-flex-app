import { useState, useMemo } from "react";

import { useRouter } from "expo-router";
import { View } from "react-native";

import type { Category, CategoryType } from "~/core/types/category";

import { CategoryList } from "~/components/features/categories/category-list";
import { Button } from "~/components/ui/button";
import { SegmentedControl } from "~/components/ui/segmented-control";
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

  const handleCreateCategory = () => {
    router.push("/(app)/categories/new");
  };

  return (
    <>
      <CategoryList
        categories={filteredCategories}
        flashListProps={{
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
        onPressCategory={handleCategoryPress}
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
