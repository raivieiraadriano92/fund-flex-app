// app/(app)/_layout.tsx
import { Stack } from "expo-router";
import { Platform } from "react-native";

export default function AppLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="categories/[id]"
        options={{
          presentation: Platform.OS === "ios" ? "formSheet" : "modal",
          sheetGrabberVisible: true,
          headerLargeTitle: true
        }}
      />
    </Stack>
  );
}
