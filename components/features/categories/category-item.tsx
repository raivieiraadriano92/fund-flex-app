import { TouchableOpacity } from 'react-native';

import { Avatar, AvatarFallback } from '~/components/ui/avatar';
import { Text } from '~/components/ui/text';
import { P } from '~/components/ui/typography';
import type { Category } from '~/core/types/category';
import { ChevronRightIcon } from '~/lib/icons';

interface CategoryItemProps {
  category: Category;
  isFirst: boolean;
  isLast: boolean;
  onPress: (category: Category) => void;
}

export function CategoryItem({ category, isFirst, isLast, onPress }: CategoryItemProps) {
  return (
    <TouchableOpacity
      className={`h-16 flex-row items-center gap-x-3 bg-primary-foreground px-3 ${isFirst ? 'rounded-t-xl' : ''} ${isLast ? 'rounded-b-xl' : ''}`}
      onPress={() => onPress(category)}>
      <Avatar alt={category.title}>
        <AvatarFallback>
          <Text>{category.emoji}</Text>
        </AvatarFallback>
      </Avatar>
      <P className="flex-1" numberOfLines={1}>
        {category.title}
      </P>
      <ChevronRightIcon className="text-muted-foreground" />
    </TouchableOpacity>
  );
}
