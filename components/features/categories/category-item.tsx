import { TouchableOpacity } from "react-native";

import type { Category } from "~/core/types/category";

import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import { Text } from "~/components/ui/text";
import { P } from "~/components/ui/typography";
import {
  CircleCheckIcon,
  ChevronRightIcon,
  CircleIcon,
  SquareCheckIcon,
  SquareIcon
} from "~/lib/icons";

interface CategoryItemProps {
  category: Category;
  enableMultiSelect?: boolean;
  isFirst: boolean;
  isLast: boolean;
  isSelectable?: boolean;
  isSelected?: boolean;
  onPress: (category: Category) => void;
}

export function CategoryItem({
  category,
  enableMultiSelect,
  isFirst,
  isLast,
  isSelectable,
  isSelected,
  onPress
}: CategoryItemProps) {
  const renderRightIcon = () => {
    if (isSelectable) {
      if (isSelected) {
        return enableMultiSelect ? (
          <SquareCheckIcon className="text-primary" />
        ) : (
          <CircleCheckIcon className="text-primary" />
        );
      } else {
        return enableMultiSelect ? (
          <SquareIcon className="text-muted-foreground" />
        ) : (
          <CircleIcon className="text-muted-foreground" />
        );
      }
    } else {
      return <ChevronRightIcon className="text-muted-foreground" />;
    }
  };

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
      {renderRightIcon()}
    </TouchableOpacity>
  );
}
