import {
  pushLocalCategoryDeletes,
  pushLocalCategoryUpserts
} from "../api/categories";
import { pushLocalGoalDeletes, pushLocalGoalUpserts } from "../api/goals";
import {
  pushLocalTransactionDeletes,
  pushLocalTransactionUpserts
} from "../api/transactions";

export const pushLocalDataToRemote = async () => {
  try {
    console.info("🔥 Syncing data...");

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
  } catch (error) {
    console.error("Failed to execute the background task:", error);

    throw error;
  }
};
