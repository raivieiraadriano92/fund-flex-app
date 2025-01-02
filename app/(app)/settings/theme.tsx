import { useState } from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { FlashList } from "@shopify/flash-list";
import { useRouter } from "expo-router";
import { TouchableOpacity, View } from "react-native";

import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { Text } from "~/components/ui/text";
import { P } from "~/components/ui/typography";
import { setAndroidNavigationBar } from "~/lib/android-navigation-bar";
import { CircleCheckIcon, CircleIcon } from "~/lib/icons";
import { SunIcon, MoonIcon } from "~/lib/icons";
import { useColorScheme } from "~/lib/useColorScheme";

const data = [
  {
    key: "light",
    name: "Light",
    Icon: SunIcon
  },
  {
    key: "dark",
    name: "Dark",
    Icon: MoonIcon
  }
];

export default function ThemeScreen() {
  const router = useRouter();

  const { colorScheme, isDarkColorScheme, setColorScheme } = useColorScheme();

  const [selectedTheme, setSelectedTheme] = useState(colorScheme);

  const handleSave = () => {
    const newTheme = isDarkColorScheme ? "light" : "dark";

    setColorScheme(newTheme);

    setAndroidNavigationBar(newTheme);

    AsyncStorage.setItem("theme", newTheme);

    router.back();
  };

  return (
    <>
      <FlashList
        data={data}
        extraData={selectedTheme}
        contentContainerStyle={{
          padding: 24
        }}
        contentInsetAdjustmentBehavior="automatic"
        estimatedItemSize={64}
        ItemSeparatorComponent={Separator}
        renderItem={({ index, item }) => {
          const isFirst = index === 0;

          const isLast = index === data.length - 1;

          const isSelected = selectedTheme === item.key;

          const Icon = item.Icon;

          return (
            <TouchableOpacity
              className={`h-16 flex-row items-center gap-3 bg-primary-foreground px-3 ${isFirst ? "rounded-t-xl" : ""} ${isLast ? "rounded-b-xl" : ""}`}
              onPress={() => setSelectedTheme(item.key)}
            >
              <Avatar alt={item.name}>
                <AvatarFallback>
                  <Icon className="text-primary" size={16} />
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
