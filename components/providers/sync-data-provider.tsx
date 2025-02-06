import { useEffect, useState } from "react";

import NetInfo from "@react-native-community/netinfo";

import {
  pushLocalCategoryDeletes,
  pushLocalCategoryUpserts
} from "~/core/api/categories";
import { pushLocalGoalDeletes, pushLocalGoalUpserts } from "~/core/api/goals";
import {
  pushLocalTransactionDeletes,
  pushLocalTransactionUpserts
} from "~/core/api/transactions";
import { useAuthStore } from "~/store/auth";

const SYNC_TIMEOUT = +(process.env.EXPO_PUBLIC_SYNC_TIMEOUT || 60000);

const pushLocalChanges = async () => {
  console.info("🔥 Syncing data...");

  // setIsLoading(true);

  // push local changes in sequence to avoid data conflicts
  // since transactions depend on categories and goals, we need to push them first
  await Promise.all([pushLocalCategoryUpserts(), pushLocalGoalUpserts()]);

  // now we can push transactions safely since categories and goals are already pushed
  await Promise.all([
    pushLocalTransactionUpserts(),
    // we push the transaction deletes before the category and goal deletes to remove the foreign key constraints
    // so the categories and goals can be deleted without any issues
    pushLocalTransactionDeletes()
  ]);

  // push category and goal deletes last
  await Promise.all([pushLocalCategoryDeletes(), pushLocalGoalDeletes()]);

  console.info("✅ Data synced!");
};

export function SyncDataProvider({ children }: { children: React.ReactNode }) {
  const session = useAuthStore((state) => state.session);

  const [isConnected, setConnected] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setConnected(!!state.isConnected);
    });

    return () => unsubscribe();
  }, []);

  // call pushLocalChanges when the user logs in
  // this will push any local changes to the server immediately after the user logs in
  useEffect(() => {
    if (isConnected && session?.user.id) {
      pushLocalChanges();
    }
  }, [isConnected, session?.user.id]);

  // call pushLocalChanges every SYNC_TIMEOUT milliseconds
  useEffect(() => {
    const interval = setInterval(async () => {
      if (session?.user.id) {
        pushLocalChanges();
      }
    }, SYNC_TIMEOUT);

    if (!isConnected) {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isConnected, session?.user.id]);

  return children;
}
