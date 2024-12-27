import { Stack } from "expo-router";

export default function HomeLayout() {
  return (
    <Stack screenOptions={{ headerLargeTitle: true, title: "Welcome!" }} />
  );
}
