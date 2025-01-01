import { useEffect, useState } from "react";

import { View } from "react-native";

import { Badge } from "~/components/ui/badge";
import { Text } from "~/components/ui/text";
import { events } from "~/core/services/events";
import { TransactionFiltersFormData } from "~/core/types/transaction";
import { useCategoriesStore } from "~/store/categories";

export function ActiveTransactionFilters() {
  const [filters, setFilters] = useState<TransactionFiltersFormData>({
    type: "all"
  });

  const hasFilters = Object.values(filters).some(
    (value) => !!value && value !== "all"
  );

  const selectedCategory = useCategoriesStore((state) =>
    state.categories.find((category) => category.id === filters.category_id)
  );

  useEffect(() => {
    events.on("transaction:applyFilter", setFilters);

    return () => {
      events.off("transaction:applyFilter");
    };
  }, []);

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
    </View>
  );
}
