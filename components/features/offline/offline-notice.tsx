import { View } from "react-native";

import { H1, P } from "~/components/ui/typography";
import { WifiOffIcon } from "~/lib/icons";

export function OfflineNotice() {
  return (
    <View className="flex-1 items-center justify-center bg-background p-6">
      <View className="items-center gap-6">
        <WifiOffIcon className=" text-muted-foreground" size={40} />

        <View className="items-center gap-3">
          <H1 className="text-center">No Internet Connection</H1>
          <P className="text-center">
            Please check your internet connection and try again.
          </P>
          <P className="mt-4 text-center text-sm text-muted-foreground">
            Offline support is coming in our next release!
          </P>
        </View>
      </View>
    </View>
  );
}
