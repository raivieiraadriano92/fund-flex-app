import * as React from "react";

import { FlashList } from "@shopify/flash-list";
import {
  Modal,
  TouchableOpacity,
  TouchableOpacityProps,
  TouchableWithoutFeedback,
  View
} from "react-native";

import { Avatar, AvatarFallback } from "./avatar";
import { Button } from "./button";
import { Label } from "./label";
import { Separator } from "./separator";
import { Text } from "./text";
import { P, Small } from "./typography";

import { CheckCircleIcon, CircleIcon } from "~/lib/icons";
import { ChevronDownIcon } from "~/lib/icons";
import { cn } from "~/lib/utils";

interface PickProps extends Omit<TouchableOpacityProps, "onPress"> {
  error?: string;
  label?: string;
  onSelect: (value: string) => void;
  options: any[];
  optionLabelToken?: string;
  optionValueToken?: string;
  placeholder?: string;
  value?: string | null;
}

interface PickButtonProps extends TouchableOpacityProps {
  placeholder?: string;
  title?: string;
}

const Picker = React.forwardRef<
  React.ElementRef<typeof TouchableOpacity>,
  PickProps
>(
  (
    {
      error,
      label,
      onSelect,
      options,
      optionLabelToken = "label",
      optionValueToken = "value",
      placeholder,
      value,
      ...props
    },
    ref
  ) => {
    const selectedOption = options?.find(
      (option) => option[optionValueToken] === value
    );

    const [isVisible, setIsVisible] = React.useState(false);

    const renderItem = ({ index, item }: any) => {
      const isFirst = index === 0;

      const isLast = index === options.length - 1;

      return (
        <TouchableOpacity
          className={`h-16 flex-row items-center gap-3 bg-primary-foreground px-3 ${isFirst ? "rounded-t-xl" : ""} ${isLast ? "rounded-b-xl" : ""}`}
          onPress={() => onSelect(item[optionValueToken])}
        >
          <Avatar alt={item[optionLabelToken]}>
            <AvatarFallback>
              <Text>{item.emoji}</Text>
            </AvatarFallback>
          </Avatar>
          <P className="flex-1" numberOfLines={1}>
            {item[optionLabelToken]}
          </P>
          {selectedOption?.[optionValueToken] === item[optionValueToken] ? (
            <CheckCircleIcon className="text-primary" />
          ) : (
            <CircleIcon className="text-muted-foreground" />
          )}
        </TouchableOpacity>
      );
    };

    return (
      <>
        <View className="gap-2">
          {!!label && <Label>{label}</Label>}
          <PickerButton
            placeholder={placeholder}
            ref={ref}
            onPress={() => setIsVisible(true)}
            title={
              selectedOption &&
              `${selectedOption.emoji} ${selectedOption[optionLabelToken]}`
            }
            {...props}
          />
          {!!error && <Small className="text-destructive">{error}</Small>}
        </View>
        <Modal animationType="fade" transparent visible={isVisible}>
          <TouchableWithoutFeedback onPress={() => setIsVisible(false)}>
            <View
              className="flex-1 justify-end"
              style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
            >
              {isVisible && (
                <TouchableWithoutFeedback onPress={() => {}}>
                  <View className="pb-safe h-4/5 bg-background">
                    <Label className="p-6">{placeholder}</Label>
                    <FlashList
                      extraData={selectedOption}
                      contentInsetAdjustmentBehavior="automatic"
                      data={options}
                      contentContainerStyle={{
                        paddingHorizontal: 24
                      }}
                      estimatedItemSize={64}
                      ItemSeparatorComponent={Separator}
                      keyExtractor={(item) => item[optionValueToken]}
                      renderItem={renderItem}
                      showsVerticalScrollIndicator={false}
                    />
                    <View className="p-6">
                      <Button onPress={() => setIsVisible(false)}>
                        <Text>Continue</Text>
                      </Button>
                    </View>
                  </View>
                </TouchableWithoutFeedback>
              )}
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </>
    );
  }
);

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
