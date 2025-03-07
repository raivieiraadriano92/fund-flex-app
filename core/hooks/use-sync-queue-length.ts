import { useCategoriesStore } from "~/store/categories";
import { useGoalsStore } from "~/store/goals";
import { useTransactionsStore } from "~/store/transactions";

export const useSyncQueueLength = () => {
  const categoriesSyncQueueLength = useCategoriesStore(
    (state) => state.deleteSyncQueue.length + state.upsertSyncQueue.length
  );

  const goalsSyncQueueLength = useGoalsStore(
    (state) => state.deleteSyncQueue.length + state.upsertSyncQueue.length
  );

  const transactionsSyncQueueLength = useTransactionsStore(
    (state) => state.deleteSyncQueue.length + state.upsertSyncQueue.length
  );

  return (
    categoriesSyncQueueLength +
    goalsSyncQueueLength +
    transactionsSyncQueueLength
  );
};
