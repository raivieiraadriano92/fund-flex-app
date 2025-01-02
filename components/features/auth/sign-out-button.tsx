import { useState } from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { ActivityIndicator, Alert } from "react-native";
import { toast } from "sonner-native";

import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { LogOutIcon } from "~/lib/icons";
import { useAuthStore } from "~/store/auth";
import { useCategoriesStore } from "~/store/categories";
import { useCurrencyStore } from "~/store/currency";
import { useGoalsStore } from "~/store/goals";
import { useTransactionsStore } from "~/store/transactions";

export function SignOutButton() {
  const signOut = useAuthStore((state) => state.signOut);

  const [isLoading, setIsLoading] = useState(false);

  const handleSignOut = async () => {
    Alert.alert("Sign Out", "Are you sure?", [
      {
        text: "Cancel",
        style: "cancel"
      },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: async () => {
          try {
            setIsLoading(true);

            await signOut();

            useCategoriesStore.getState().reset();

            useGoalsStore.getState().reset();

            useTransactionsStore.getState().reset();

            useCurrencyStore.getState().reset();

            AsyncStorage.clear();
          } catch (_error) {
            toast.error(
              "An error occurred while signing out. Please try again."
            );
          } finally {
            setIsLoading(false);
          }
        }
      }
    ]);
  };

  return (
    <Button disabled={isLoading} onPress={handleSignOut} variant="destructive">
      <LogOutIcon className="text-white" />
      <Text>Log out</Text>
      {isLoading && <ActivityIndicator color="white" />}
    </Button>
  );
}
