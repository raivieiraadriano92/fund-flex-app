import { useEffect } from "react";

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

  // setIsLoading(false);

  console.info("✅ Data synced!");
};

export function SyncDataProvider({ children }: { children: React.ReactNode }) {
  const session = useAuthStore((state) => state.session);

  // const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const interval = setInterval(async () => {
      if (session?.user.id) {
        pushLocalChanges();
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [session?.user.id]);

  return children;
}
