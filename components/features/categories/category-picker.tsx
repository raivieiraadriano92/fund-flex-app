import { useEffect } from "react";

import { router } from "expo-router";
import { View } from "react-native";

import { Label } from "~/components/ui/label";
import { PickerButton } from "~/components/ui/picker";
import { Small } from "~/components/ui/typography";
import { events } from "~/core/services/events";
import { Category, CategoryType } from "~/core/types/category";

interface CategoryPickerProps {
  error?: string;
  onChange: (categoryId: string) => void;
  selectedCategory?: Category;
  type: CategoryType;
}

export function CategoryPicker({
  error,
  onChange,
  selectedCategory,
  type
}: CategoryPickerProps) {
  useEffect(() => {
    const handleCategorySelected = (categoryId: string) => {
      onChange(categoryId);
    };

    events.on("category:selected", handleCategorySelected);

    return () => {
      events.off("category:selected");
    };
  }, [onChange]);

  return (
    <View className="gap-2">
      <Label>Category</Label>
      <PickerButton
        onPress={() =>
          router.push(
            `/categories/picker?type=${type}&defaultValue=${selectedCategory?.id || ""}`
          )
        }
        placeholder="Select category"
        title={
          selectedCategory &&
          `${selectedCategory?.emoji} ${selectedCategory?.title}`
        }
      />
      {!!error && <Small className="text-destructive">{error}</Small>}
    </View>
  );
}
