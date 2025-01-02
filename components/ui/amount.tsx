import { ComponentType, useMemo } from "react";

import { TextProps } from "react-native";

import type { TransactionType } from "~/core/types/transaction";

import { Text } from "~/components/ui/text";
import { formatCurrency } from "~/core/utils/currency";
import { useCurrencyStore } from "~/store/currency";

interface AmountProps extends TextProps {
  as?: ComponentType<TextProps>;
  type?: TransactionType;
  amount: number;
}

export function Amount({ as, type, amount, className, ...props }: AmountProps) {
  const Component = as || Text;

  const currencyCode = useCurrencyStore((state) => state.currency);

  const formattedAmount = useMemo(
    () => formatCurrency(amount, currencyCode),
    [amount, currencyCode]
  );

  return (
    <Component
      className={`
        ${type === "expense" ? "text-destructive" : type === "income" ? "text-green-500" : ""}
        ${className}
      `}
      {...props}
    >
      {formattedAmount}
    </Component>
  );
}
