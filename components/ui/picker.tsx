import * as React from "react";

import { TouchableOpacity, TouchableOpacityProps } from "react-native";
import { SvgProps } from "react-native-svg";

import { Text } from "./text";

import { ChevronDownIcon } from "~/lib/icons";
import { cn } from "~/lib/utils";

interface PickerButtonProps extends TouchableOpacityProps {
  Icon?: React.ComponentType<SvgProps>;
  placeholder?: string;
  title?: string;
}

export const PickerButton = React.forwardRef<
  React.ElementRef<typeof TouchableOpacity>,
  PickerButtonProps
>(
  (
    { className, Icon = ChevronDownIcon, placeholder, title, ...props },
    ref
  ) => (
    <TouchableOpacity
      ref={ref}
      className={cn(
        "native:h-12 h-10 flex-row items-center justify-between rounded-xl border border-input bg-background px-3 web:flex web:w-full web:py-2 web:ring-offset-background web:focus-visible:outline-none web:focus-visible:ring-2 web:focus-visible:ring-ring web:focus-visible:ring-offset-2",
        props.disabled && "opacity-50 web:cursor-not-allowed"
      )}
      {...props}
    >
      <Text
        className={cn(
          "native:text-lg native:leading-[1.25] text-base text-muted-foreground lg:text-sm",
          !!title && "text-foreground"
        )}
      >
        {title ?? placeholder}
      </Text>
      <Icon className="text-primary" />
    </TouchableOpacity>
  )
);

PickerButton.displayName = "PickerButton";
