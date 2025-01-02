import AsyncStorage from "@react-native-async-storage/async-storage";
import { ScrollView, TouchableOpacity, View } from "react-native";

import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { Text } from "~/components/ui/text";
import { P } from "~/components/ui/typography";
import { setAndroidNavigationBar } from "~/lib/android-navigation-bar";
import {
  SunIcon,
  MoonIcon,
  GlobeIcon,
  DollarSignIcon,
  HelpCircleIcon,
  FileTextIcon,
  StarIcon,
  LogOutIcon
} from "~/lib/icons";
import { useColorScheme } from "~/lib/useColorScheme";
import { useAuthStore } from "~/store/auth";

export default function SettingsScreen() {
  const { isDarkColorScheme, setColorScheme } = useColorScheme();

  const signOut = useAuthStore((state) => state.signOut);

  const sections = [
    {
      title: "Preferences",
      items: [
        {
          label: "Theme",
          icon: isDarkColorScheme ? MoonIcon : SunIcon,
          onPress: () => {
            const newTheme = isDarkColorScheme ? "light" : "dark";

            setColorScheme(newTheme);

            setAndroidNavigationBar(newTheme);

            AsyncStorage.setItem("theme", newTheme);
          }
        },
        {
          label: "Language",
          icon: GlobeIcon,
          onPress: () => {}
        },
        {
          label: "Currency",
          icon: DollarSignIcon,
          onPress: () => {}
        }
      ]
    },
    {
      title: "Support",
      items: [
        {
          label: "Help & Support",
          icon: HelpCircleIcon,
          onPress: () => {}
        },
        {
          label: "Terms and Privacy",
          icon: FileTextIcon,
          onPress: () => {}
        }
      ]
    },
    {
      title: "About",
      items: [
        {
          label: "Rate this App",
          icon: StarIcon,
          onPress: () => {}
        }
      ]
    }
  ];

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      contentContainerClassName="p-6"
      keyboardDismissMode="on-drag"
      showsVerticalScrollIndicator={false}
    >
      <View className="gap-8">
        <View className="gap-3">
          {sections.map((section, i) => (
            <View key={i}>
              {/* <H3 className="px-4 py-2 text-muted-foreground">{section.title}</H3> */}
              {section.items.map((item, j) => {
                const isFirst = j === 0;

                const isLast = j === section.items.length - 1;

                const Icon = item.icon;

                return (
                  <View key={j}>
                    {!!j && <Separator />}
                    <TouchableOpacity
                      className={`h-16 flex-row items-center gap-3 bg-primary-foreground px-3 ${isFirst ? "rounded-t-xl" : ""} ${isLast ? "rounded-b-xl" : ""}`}
                      onPress={item.onPress}
                    >
                      <Avatar alt={item.label}>
                        <AvatarFallback>
                          <Icon className="text-primary" size={16} />
                        </AvatarFallback>
                      </Avatar>
                      <P>{item.label}</P>
                    </TouchableOpacity>
                  </View>
                );
              })}
            </View>
          ))}
        </View>
        <Button variant="destructive" onPress={signOut}>
          <LogOutIcon className="text-white" />
          <Text>Log out</Text>
        </Button>
      </View>
    </ScrollView>
  );
}
