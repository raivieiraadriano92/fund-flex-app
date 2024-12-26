import { Tabs } from "expo-router";

import {
  HomeIcon,
  LayoutGridIcon,
  BarChart3Icon,
  TargetIcon,
  SettingsIcon
} from "~/lib/icons";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        animation: "shift",
        headerShown: false
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ color, size }) => (
            <HomeIcon size={size} color={color} />
          )
        }}
      />
      <Tabs.Screen
        name="categories"
        options={{
          tabBarLabel: "Categories",
          tabBarIcon: ({ color, size }) => (
            <LayoutGridIcon size={size} color={color} />
          )
        }}
      />
      <Tabs.Screen
        name="analytics"
        options={{
          tabBarLabel: "Analytics",
          tabBarIcon: ({ color, size }) => (
            <BarChart3Icon size={size} color={color} />
          )
        }}
      />
      <Tabs.Screen
        name="goals"
        options={{
          tabBarLabel: "Goals",
          tabBarIcon: ({ color, size }) => (
            <TargetIcon size={size} color={color} />
          )
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          tabBarLabel: "Settings",
          tabBarIcon: ({ color, size }) => (
            <SettingsIcon size={size} color={color} />
          )
        }}
      />
    </Tabs>
  );
}
