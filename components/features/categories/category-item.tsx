import { TouchableOpacity } from "react-native";

import type { Category } from "~/core/types/category";

import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import { Text } from "~/components/ui/text";
import { P } from "~/components/ui/typography";
import { CircleCheckIcon, ChevronRightIcon, CircleIcon } from "~/lib/icons";

interface CategoryItemProps {
  category: Category;
  isFirst: boolean;
  isLast: boolean;
  isSelectable?: boolean;
  isSelected?: boolean;
  onPress: (category: Category) => void;
}

export function CategoryItem({
  category,
  isFirst,
  isLast,
  isSelectable,
  isSelected,
  onPress
}: CategoryItemProps) {
  return (
    <TouchableOpacity
      className={`h-16 flex-row items-center gap-3 bg-primary-foreground px-3 ${isFirst ? "rounded-t-xl" : ""} ${isLast ? "rounded-b-xl" : ""}`}
      onPress={() => onPress(category)}
    >
      <Avatar alt={category.title}>
        <AvatarFallback>
          <Text>{category.emoji}</Text>
        </AvatarFallback>
      </Avatar>
      <P className="flex-1" numberOfLines={1}>
        {category.title}
      </P>
      {isSelectable ? (
        <>
          {isSelected ? (
            <CircleCheckIcon className="text-primary" />
          ) : (
            <CircleIcon className="text-muted-foreground" />
          )}
        </>
      ) : (
        <ChevronRightIcon className="text-muted-foreground" />
      )}
    </TouchableOpacity>
  );
}
