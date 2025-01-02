import { useState } from "react";

import { FlashList } from "@shopify/flash-list";
import { useRouter } from "expo-router";
import { TouchableOpacity, View } from "react-native";

import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { Text } from "~/components/ui/text";
import { P } from "~/components/ui/typography";
import { currencies } from "~/core/utils/currency";
import { CircleCheckIcon, CircleIcon } from "~/lib/icons";
import { useCurrencyStore } from "~/store/currency";

export default function CurrencyScreen() {
  const router = useRouter();

  const { currency, setCurrency } = useCurrencyStore();

  const [selectedCurrency, setSelectedCurrency] = useState(currency);

  const handleSave = () => {
    setCurrency(selectedCurrency);

    router.back();
  };

  return (
    <>
      <FlashList
        data={currencies}
        extraData={selectedCurrency}
        contentContainerStyle={{
          padding: 24
        }}
        contentInsetAdjustmentBehavior="automatic"
        estimatedItemSize={64}
        ItemSeparatorComponent={Separator}
        renderItem={({ index, item }) => {
          const isFirst = index === 0;

          const isLast = index === currencies.length - 1;

          const isSelected = selectedCurrency === item.code;

          return (
            <TouchableOpacity
              className={`h-16 flex-row items-center gap-3 bg-primary-foreground px-3 ${isFirst ? "rounded-t-xl" : ""} ${isLast ? "rounded-b-xl" : ""}`}
              onPress={() => setSelectedCurrency(item.code)}
            >
              <Avatar alt={item.name}>
                <AvatarFallback>
                  <Text>{item.symbol}</Text>
                </AvatarFallback>
              </Avatar>
              <P className="flex-1" numberOfLines={1}>
                {item.name}
              </P>
              {isSelected ? (
                <CircleCheckIcon className="text-primary" />
              ) : (
                <CircleIcon className="text-muted-foreground" />
              )}
            </TouchableOpacity>
          );
        }}
        showsVerticalScrollIndicator={false}
      />

      <View className="pb-safe p-6">
        <Button className="mb-6" onPress={handleSave}>
          <Text>Save</Text>
        </Button>
      </View>
    </>
  );
}
