import { useState } from "react";

import { ActivityIndicator, ScrollView, View } from "react-native";
import { toast } from "sonner-native";

import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { useSyncQueueLength } from "~/core/hooks/use-sync-queue-length";
import { pushLocalDataToRemote } from "~/core/utils/backup";
import { CircleAlertIcon } from "~/lib/icons";

export default function DataSyncStatusScreen() {
  const totalSyncQueueLength = useSyncQueueLength();

  const [isLoading, setIsLoading] = useState(false);

  const handleBackup = async () => {
    try {
      setIsLoading(true);

      await pushLocalDataToRemote();

      toast.success("Data backed up successfully!");
    } catch (_) {
      toast.error("Failed to backup data. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerClassName="p-6 gap-8"
        showsVerticalScrollIndicator={false}
      >
        <Alert icon={CircleAlertIcon} className="max-w-xl">
          <AlertTitle>{`${totalSyncQueueLength} pending items to backup!`}</AlertTitle>
          <AlertDescription>
            Your data will be backed up automatically. Or you can do it
            manually.
          </AlertDescription>
        </Alert>
      </ScrollView>
      <View className="pb-safe p-6">
        <Button
          className="mb-6"
          disabled={!totalSyncQueueLength || isLoading}
          onPress={handleBackup}
        >
          <Text>Backup Now</Text>
          {isLoading && <ActivityIndicator color="white" />}
        </Button>
      </View>
    </>
  );
}
