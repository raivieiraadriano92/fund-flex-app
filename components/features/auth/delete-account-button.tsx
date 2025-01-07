import { useState } from "react";

import { ActivityIndicator, Alert } from "react-native";
import { toast } from "sonner-native";

import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { signOut } from "~/core/utils/auth";
import { CircleAlertIcon } from "~/lib/icons";
import { useAuthStore } from "~/store/auth";

export function DeleteAccountButton() {
  const markAccountToBeDeleted = useAuthStore(
    (state) => state.markAccountToBeDeleted
  );

  const [isLoading, setIsLoading] = useState(false);

  const handleSignOut = async () => {
    Alert.alert(
      "Delete Account",
      "This action cannot be undone. This will permanently delete your account and remove all your data from our servers.",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete Account",
          style: "destructive",
          onPress: async () => {
            try {
              setIsLoading(true);

              await markAccountToBeDeleted();

              await signOut();

              Alert.alert(
                "We're sorry to see you go.",
                "Your account has been successfully marked to be deleted. Soon your account will be permanently deleted from our servers."
              );
            } catch (_error) {
              toast.error(
                "An error occurred while deleting your account. Please try again."
              );
            } finally {
              setIsLoading(false);
            }
          }
        }
      ]
    );
  };

  return (
    <Button disabled={isLoading} onPress={handleSignOut} variant="destructive">
      <CircleAlertIcon className="text-white" />
      <Text>Delete account</Text>
      {isLoading && <ActivityIndicator color="white" />}
    </Button>
  );
}
