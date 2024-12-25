import { ComponentProps } from "react";

import RNSegmentedControl from "@react-native-segmented-control/segmented-control";

export function SegmentedControl(
  props: ComponentProps<typeof RNSegmentedControl>
) {
  return (
    <RNSegmentedControl
      activeFontStyle={{
        fontSize: 14,
        fontWeight: "600"
      }}
      fontStyle={{ fontSize: 14 }}
      style={{ height: 44 }}
      {...props}
    />
  );
}
