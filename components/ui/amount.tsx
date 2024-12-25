// components/ui/amount.tsx
import { ComponentType } from "react";

import { TextProps } from "react-native";

import type { TransactionType } from "~/core/types/transaction";

import { Text } from "~/components/ui/text";

interface AmountProps extends TextProps {
  as?: ComponentType<TextProps>;
  type: TransactionType;
  amount: number;
}

export function Amount({ as, type, amount, className, ...props }: AmountProps) {
  const Component = as || Text;

  return (
    <Component
      className={`
        ${type === "expense" ? "text-destructive" : "text-green-500"}
        ${className}
      `}
      {...props}
    >
      {amount.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        style: "currency",
        currency: "USD"
      })}
    </Component>
  );
}
