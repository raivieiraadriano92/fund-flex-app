import { format, parseISO } from "date-fns";
import { View } from "react-native";

import { Badge } from "~/components/ui/badge";
import { Text } from "~/components/ui/text";
import { TransactionFiltersFormData } from "~/core/types/transaction";
import { useCategoriesStore } from "~/store/categories";

type ActiveTransactionFiltersProps = {
  filters: TransactionFiltersFormData;
};

export function ActiveTransactionFilters({
  filters
}: ActiveTransactionFiltersProps) {
  const hasFilters = Object.values(filters).some(
    (value) => !!value && value !== "all"
  );

  const selectedCategory = useCategoriesStore((state) =>
    state.categories.find((category) => category.id === filters.category_id)
  );

  if (!hasFilters) {
    return null;
  }

  return (
    <View className="flex-row gap-2">
      {!!filters.type && filters.type !== "all" && (
        <Badge variant="secondary">
          <Text>{filters.type === "expense" ? "Expense" : "Income"}</Text>
        </Badge>
      )}
      {!!selectedCategory && (
        <Badge variant="secondary">
          <Text>{`${selectedCategory.emoji} ${selectedCategory.title}`}</Text>
        </Badge>
      )}
      {!!filters.startDate && (
        <Badge variant="secondary">
          <Text>{format(parseISO(filters.startDate), "MMM dd, yyyy")}</Text>
        </Badge>
      )}
      {!!filters.endDate && (
        <Badge variant="secondary">
          <Text>{format(parseISO(filters.endDate), "MMM dd, yyyy")}</Text>
        </Badge>
      )}
    </View>
  );
}
