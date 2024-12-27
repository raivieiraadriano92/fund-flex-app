import * as React from "react";

import { TouchableOpacity, TouchableOpacityProps, View } from "react-native";

import { Label } from "./label";
import { Text } from "./text";
import { Small } from "./typography";

import { ChevronDownIcon } from "~/lib/icons";
import { cn } from "~/lib/utils";

interface PickProps extends TouchableOpacityProps {
  error?: string;
  label?: string;
  options?: { label: string; value: string }[];
  placeholder?: string;
  value?: string;
}

interface PickButtonProps extends TouchableOpacityProps {
  placeholder?: string;
  title?: string;
}

const Picker = React.forwardRef<
  React.ElementRef<typeof TouchableOpacity>,
  PickProps
>(({ className, error, label, options, placeholder, value, ...props }, ref) => {
  const selectedOption = options?.find((option) => option.value === value);

  return (
    <View className="gap-2">
      {!!label && <Label>{label}</Label>}
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
            selectedOption && "text-foreground"
          )}
        >
          {selectedOption?.label ?? placeholder}
        </Text>
        <ChevronDownIcon />
      </TouchableOpacity>
      {!!error && <Small className="text-destructive">{error}</Small>}
    </View>
  );
});

Picker.displayName = "Picker";

const PickerButton = React.forwardRef<
  React.ElementRef<typeof TouchableOpacity>,
  PickButtonProps
>(({ className, placeholder, title, ...props }, ref) => (
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
    <ChevronDownIcon />
  </TouchableOpacity>
));

PickerButton.displayName = "PickerButton";

export { Picker, PickerButton };
