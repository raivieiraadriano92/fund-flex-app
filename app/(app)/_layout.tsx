import { Stack } from "expo-router";

export default function AppLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="categories/[id]"
        options={{
          presentation: "modal",
          headerLargeTitle: true
        }}
      />
      <Stack.Screen
        name="categories/picker"
        options={{
          presentation: "modal",
          headerLargeTitle: true
        }}
      />
      <Stack.Screen
        name="goals/[id]"
        options={{
          presentation: "modal",
          headerLargeTitle: true
        }}
      />
      <Stack.Screen
        name="transactions/[id]"
        options={{
          presentation: "modal",
          headerLargeTitle: true
        }}
      />
    </Stack>
  );
}
