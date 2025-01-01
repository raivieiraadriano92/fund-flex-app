import { router, Stack } from "expo-router";
import { ScrollView, View } from "react-native";

import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";

export default function TransactionsFiltersScreen() {
  const handleContinue = async () => {
    router.back();
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: "Filters"
        }}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerClassName="p-6"
        keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator={false}
      ></ScrollView>
      <View className="pb-safe p-6">
        <Button className="mb-6" onPress={handleContinue}>
          <Text>Continue</Text>
        </Button>
      </View>
    </>
  );
}
