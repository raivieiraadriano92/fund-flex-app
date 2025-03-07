import Constants from "expo-constants";
import { router } from "expo-router";
import { Linking, ScrollView, TouchableOpacity, View } from "react-native";

import { DeleteAccountButton } from "~/components/features/auth/delete-account-button";
import { SignOutButton } from "~/components/features/auth/sign-out-button";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import { Badge } from "~/components/ui/badge";
import { Separator } from "~/components/ui/separator";
import { Text } from "~/components/ui/text";
import { Muted, P } from "~/components/ui/typography";
import { useSyncQueueLength } from "~/core/hooks/use-sync-queue-length";
import { redirectToWriteReview } from "~/core/services/app-review";
import {
  GlobeLockIcon,
  SunIcon,
  MoonIcon,
  GlobeIcon,
  DollarSignIcon,
  HelpCircleIcon,
  FileTextIcon,
  StarIcon,
  ChevronRightIcon,
  RefreshCcwIcon
} from "~/lib/icons";
import { useColorScheme } from "~/lib/useColorScheme";

export default function SettingsScreen() {
  const { isDarkColorScheme } = useColorScheme();

  const totalSyncQueueLength = useSyncQueueLength();

  const sections = [
    {
      title: "Preferences",
      items: [
        {
          label: "Theme",
          icon: isDarkColorScheme ? MoonIcon : SunIcon,
          onPress: () => router.push("/settings/theme")
        },
        {
          label: "Language",
          icon: GlobeIcon,
          onPress: () => {}
        },
        {
          label: "Currency",
          icon: DollarSignIcon,
          onPress: () => router.push("/settings/currency")
        },
        {
          label: "Backup",
          icon: RefreshCcwIcon,
          onPress: () => router.push("/settings/backup"),
          badge: totalSyncQueueLength
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
          label: "Terms & Conditions",
          icon: FileTextIcon,
          onPress: () =>
            Linking.openURL(
              "https://fund-flex-app.vercel.app/terms-conditions.html"
            )
        },
        {
          label: "Privacy Policy",
          icon: GlobeLockIcon,
          onPress: () =>
            Linking.openURL(
              "https://fund-flex-app.vercel.app/privacy-policy.html"
            )
        }
      ]
    },
    {
      title: "About",
      items: [
        {
          label: "Rate this App",
          icon: StarIcon,
          onPress: () => redirectToWriteReview()
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
                      {!!item.badge && (
                        <Badge variant="destructive">
                          <Text>{item.badge}</Text>
                        </Badge>
                      )}
                      <ChevronRightIcon className="text-muted-foreground" />
                    </TouchableOpacity>
                  </View>
                );
              })}
            </View>
          ))}
        </View>
        <SignOutButton />
        <DeleteAccountButton />
        <Muted className="text-center">
          Version {Constants.expoConfig?.version}
        </Muted>
      </View>
    </ScrollView>
  );
}
