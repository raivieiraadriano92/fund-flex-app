import { Stack } from "expo-router";

export default function GoalsLayout() {
  return (
    <Stack
      screenOptions={({ theme }) => ({
        contentStyle: {
          backgroundColor: theme.colors.primaryForeground
        }
      })}
    />
  );
}
