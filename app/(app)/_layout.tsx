import { useEffect } from "react";

import * as QuickActions from "expo-quick-actions";
import { useQuickActionRouting, RouterAction } from "expo-quick-actions/router";
import { Stack } from "expo-router";
import { Platform } from "react-native";

export default function AppLayout() {
  useQuickActionRouting();

  useEffect(() => {
    QuickActions.setItems<RouterAction>([
      {
        title: "Wait! Don't delete me!",
        subtitle: "We're here to help",
        icon:
          Platform.OS === "ios"
            ? "symbol:person.crop.circle.badge.questionmark"
            : undefined,
        id: "help",
        params: {
          href: "/settings"
        }
      },
      {
        title: "💰 New Transaction",
        id: "new-transaction",
        params: {
          href: "/transactions/new"
        }
      },
      {
        title: "📋 New Category",
        id: "new-category",
        params: {
          href: "/categories/new"
        }
      },
      {
        title: "🎯 New Goal",
        id: "new-goal",
        params: {
          href: "/goals/new"
        }
      }
    ]);
  }, []);

  return (
    <Stack>
      <Stack.Screen
        name="(tabs)"
        options={{ title: "Main", headerShown: false }}
      />
      <Stack.Screen
        name="categories/[id]"
        options={{
          // presentation: "modal",
          headerLargeTitle: true
        }}
      />
      <Stack.Screen
        name="categories/picker"
        options={{
          // presentation: "modal",
          headerLargeTitle: true
        }}
      />
      <Stack.Screen
        name="categories/quick-start"
        options={{
          // presentation: "modal",
          headerLargeTitle: true
        }}
      />
      <Stack.Screen
        name="goals/[id]"
        options={{
          // presentation: "modal",
          headerLargeTitle: true
        }}
      />
      <Stack.Screen
        name="goals/picker"
        options={({ theme }) => ({
          // presentation: "modal",
          headerLargeTitle: true,
          contentStyle: {
            backgroundColor: theme.colors.primaryForeground
          }
        })}
      />
      <Stack.Screen
        name="transactions/[id]"
        options={{
          // presentation: "modal",
          headerLargeTitle: true
        }}
      />
      <Stack.Screen
        name="transactions/filters"
        options={{
          // presentation: "modal",
          headerLargeTitle: true
        }}
      />
      <Stack.Screen
        name="settings/currency"
        options={{
          // presentation: "modal",
          headerLargeTitle: true,
          title: "💱 Currency Picker"
        }}
      />
      <Stack.Screen
        name="settings/theme"
        options={{
          // presentation: "modal",
          headerLargeTitle: true,
          title: "🎨 Theme"
        }}
      />
      <Stack.Screen
        name="settings/backup"
        options={{
          // presentation: "modal",
          headerLargeTitle: true,
          title: "🔄 Backup"
        }}
      />
    </Stack>
  );
}
