import { FlashList, FlashListProps } from "@shopify/flash-list";

import type { Category } from "~/core/types/category";

import { CategoryItem } from "~/components/features/categories/category-item";
import { Separator } from "~/components/ui/separator";

interface CategoriesListProps {
  categories: Category[];
  flashListProps?: Partial<FlashListProps<Category>>;
  isSelectable?: boolean;
  isSelected?(category: Category): boolean;
  onPressCategory: (category: Category) => void;
}

export function CategoryList({
  categories,
  flashListProps,
  isSelectable,
  isSelected,
  onPressCategory
}: CategoriesListProps) {
  return (
    <FlashList
      contentInsetAdjustmentBehavior="automatic"
      data={categories}
      contentContainerStyle={{
        padding: 24
      }}
      estimatedItemSize={64}
      ItemSeparatorComponent={Separator}
      renderItem={({ index, item }) => {
        const isFirst = index === 0;

        const isLast = index === categories.length - 1;

        return (
          <CategoryItem
            category={item}
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
