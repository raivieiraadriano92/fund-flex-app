import { Stack } from "expo-router";

export default function GoalsLayout() {
  return (
    <Stack
      screenOptions={({ theme }) => ({
        headerLargeTitle: true,
        title: "Goals",
        contentStyle: {
          backgroundColor: theme.colors.primaryForeground
        }
      })}
    />
  );
}
