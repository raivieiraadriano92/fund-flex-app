import { useState } from "react";

import { ActivityIndicator, Alert } from "react-native";
import { toast } from "sonner-native";

import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { signOut } from "~/core/utils/auth";
import { LogOutIcon } from "~/lib/icons";

export function SignOutButton() {
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
    <Button disabled={isLoading} onPress={handleSignOut} variant="ghost">
      <LogOutIcon className="text-destructive" />
      <Text className="text-destructive">Log out</Text>
      {isLoading && <ActivityIndicator className="text-destructive" />}
    </Button>
  );
}
