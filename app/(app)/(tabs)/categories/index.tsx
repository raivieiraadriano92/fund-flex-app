import { useState, useMemo } from "react";

import { useRouter } from "expo-router";
import { TouchableOpacity, View } from "react-native";

import type { Category, CategoryType } from "~/core/types/category";

import { CategoryList } from "~/components/features/categories/category-list";
import { Button } from "~/components/ui/button";
import { SegmentedControl } from "~/components/ui/segmented-control";
import { Text } from "~/components/ui/text";
import { Muted, P } from "~/components/ui/typography";
import { ChevronRightIcon, LayoutGridIcon, PlusIcon } from "~/lib/icons";
import { useCategoriesStore } from "~/store/categories";

export default function CategoriesScreen() {
  const router = useRouter();

  const categories = useCategoriesStore((state) => state.categories);

  const hasCategories = categories.length > 0;

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
              {hasCategories ? (
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
              ) : (
                <View className="gap-6">
                  <P>Get Started with Categories:</P>
                  <TouchableOpacity
                    className="flex-row items-center gap-3 rounded-xl border border-border p-3"
                    onPress={() => router.push("/categories/quick-start")}
                  >
                    <View className="h-12 w-12 items-center justify-center rounded-lg bg-primary-foreground">
                      <LayoutGridIcon className="text-primary" />
                    </View>
                    <View className="flex-1">
                      <P className="font-semibold">Quick Start!</P>
                      <Muted>
                        We've prepared a set of common categories to help you
                        get started quickly.
                      </Muted>
                    </View>
                    <ChevronRightIcon className="rounded-full bg-primary-foreground text-primary" />
                  </TouchableOpacity>
                  <Muted className="text-center">or</Muted>
                  <Button onPress={() => router.push("/categories/new")}>
                    <Text>Add your first category</Text>
                  </Button>
                </View>
              )}
            </View>
          )
        }}
        onPressCategory={handleCategoryPress}
      />
      {hasCategories && (
        <Button
          className="native:w-14 absolute bottom-4 right-4 w-11 rounded-full p-0"
          onPress={handleCreateCategory}
          size="lg"
        >
          <PlusIcon className="text-white" />
        </Button>
      )}
    </>
  );
}
