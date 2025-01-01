import { FlashList, FlashListProps } from "@shopify/flash-list";

import type { Category } from "~/core/types/category";

import { CategoryItem } from "~/components/features/categories/category-item";
import { Separator } from "~/components/ui/separator";

interface CategoryListProps {
  categories: Category[];
  enableMultiSelect?: boolean;
  flashListProps?: Partial<FlashListProps<Category>>;
  isSelectable?: boolean;
  isSelected?(category: Category): boolean;
  onPressCategory: (category: Category) => void;
}

export function CategoryList({
  categories,
  enableMultiSelect,
  flashListProps,
  isSelectable,
  isSelected,
  onPressCategory
}: CategoryListProps) {
  return (
    <FlashList
      data={categories}
      contentContainerStyle={{
        padding: 24
      }}
      contentInsetAdjustmentBehavior="automatic"
      estimatedItemSize={64}
      ItemSeparatorComponent={Separator}
      renderItem={({ index, item }) => {
        const isFirst = index === 0;

        const isLast = index === categories.length - 1;

        return (
          <CategoryItem
            category={item}
            enableMultiSelect={enableMultiSelect}
            isFirst={isFirst}
            isLast={isLast}
            isSelectable={isSelectable}
            isSelected={isSelected?.(item)}
            onPress={onPressCategory}
          />
        );
      }}
      showsVerticalScrollIndicator={false}
      {...flashListProps}
    />
  );
}
