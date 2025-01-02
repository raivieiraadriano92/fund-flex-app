import { router } from "expo-router";
import { Linking, ScrollView, TouchableOpacity, View } from "react-native";

import { SignOutButton } from "~/components/features/auth/sign-out-button";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import { Separator } from "~/components/ui/separator";
import { P } from "~/components/ui/typography";
import {
  SunIcon,
  MoonIcon,
  GlobeIcon,
  DollarSignIcon,
  HelpCircleIcon,
  FileTextIcon,
  StarIcon,
  ChevronRightIcon
} from "~/lib/icons";
import { useColorScheme } from "~/lib/useColorScheme";

export default function SettingsScreen() {
  const { isDarkColorScheme } = useColorScheme();

  const sections = [
    {
      title: "Preferences",
      items: [
        {
          label: "Theme",
          icon: isDarkColorScheme ? MoonIcon : SunIcon,
          onPress: () => router.push("settings/theme")
        },
        {
          label: "Language",
          icon: GlobeIcon,
          onPress: () => {}
        },
        {
          label: "Currency",
          icon: DollarSignIcon,
          onPress: () => router.push("settings/currency")
        }
      ]
    },
    {
      title: "Support",
      items: [
        {
          label: "Help & Support",
          icon: HelpCircleIcon,
          onPress: () => Linking.openURL("mailto:raivieiraadriano92@gmail.com")
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
                      <P className="flex-1">{item.label}</P>
                      <ChevronRightIcon className="text-muted-foreground" />
                    </TouchableOpacity>
                  </View>
                );
              })}
            </View>
          ))}
        </View>
        <SignOutButton />
      </View>
    </ScrollView>
  );
}
