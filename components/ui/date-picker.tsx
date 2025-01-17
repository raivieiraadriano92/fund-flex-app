import { useMemo, useState } from "react";

import { format, parseISO } from "date-fns";
import { View } from "react-native";
import DateTimePickerModal, {
  ReactNativeModalDateTimePickerProps
} from "react-native-modal-datetime-picker";

import { Label } from "./label";
import { PickerButton } from "./picker";
import { Small } from "./typography";

import { CalendarIcon } from "~/lib/icons";

type DatePickerProps = Pick<ReactNativeModalDateTimePickerProps, "mode"> & {
  error?: string;
  label?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  value?: string;
};

export const DatePicker = ({
  error,
  label,
  mode = "date",
  onChange,
  placeholder,
  value
}: DatePickerProps) => {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const formattedValue = useMemo(() => {
    if (!value) {
      return "";
    }

    switch (mode) {
      case "date":
        return format(parseISO(value), "MMM dd, yyyy");

      case "time":
        return format(parseISO(value), "hh:mm a");

      default:
        return format(parseISO(value), "MMM dd, yyyy hh:mm a");
    }
  }, [mode, value]);

  return (
    <View className="gap-2">
      {!!label && <Label>{label}</Label>}
      <PickerButton
        Icon={CalendarIcon}
        onPress={() => setDatePickerVisibility(true)}
        placeholder={placeholder}
        title={formattedValue}
      />
      {!!error && <Small className="text-destructive">{error}</Small>}
      <DateTimePickerModal
        date={value ? parseISO(value) : new Date()}
        mode={mode}
        onCancel={() => setDatePickerVisibility(false)}
        onConfirm={(date) => {
          onChange(date.toISOString());

          setDatePickerVisibility(false);
        }}
        isVisible={isDatePickerVisible}
      />
    </View>
  );
};
