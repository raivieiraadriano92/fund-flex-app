import Storage from "expo-sqlite/kv-store";

import { TransactionWithGoals } from "../types/transaction";

import { supabase } from "./supabase";

import { useAuthStore } from "~/store/auth";
import { useTransactionsStore } from "~/store/transactions";

const getAndParseTransaction = async (key: string) => {
  const transaction = await Storage.getItem(key);

  if (!transaction) {
    return null;
  }

  return JSON.parse(transaction) as TransactionWithGoals;
};

export const pushLocalTransactionUpserts = async () => {
  try {
    const userId = useAuthStore.getState().session?.user.id;

    if (!userId) {
      throw new Error("User not found");
    }

    const prefix = `transaction:${userId}:`;

    const { upsertSyncQueue } = useTransactionsStore.getState();

    const transactionsToUpsert = await Promise.all(
      upsertSyncQueue.map(
        async (id) => await getAndParseTransaction(`${prefix}${id}`)
      )
    );

    const upsertData = transactionsToUpsert.filter(
      (transaction) => transaction !== null
    );

    if (upsertData.length) {
      const upsertResponse = await supabase
        .from("transactions")
        // remove goals from the transaction data before upserting
        .upsert(upsertData.map(({ goals, ...transaction }) => transaction));

      if (upsertResponse.error) {
        throw upsertResponse.error;
      }

      // remap the goals to include the transaction_id
      const transactionsGoals = upsertData.flatMap(({ id, goals }) =>
        (goals || []).map((goal) => ({ ...goal, transaction_id: id }))
      );

      // remove all existing goals for the transactions being upserted
      const removeTransactionsGoalsResponse = await supabase
        .from("transactions_goals")
        .delete()
        .in(
          "transaction_id",
          upsertData.map(({ id }) => id)
        );

      if (removeTransactionsGoalsResponse.error) {
        throw removeTransactionsGoalsResponse.error;
      }

      // insert the new goals
      const insertTransactionsGoalsResponse = await supabase
        .from("transactions_goals")
        .insert(transactionsGoals);

      if (insertTransactionsGoalsResponse.error) {
        throw insertTransactionsGoalsResponse.error;
      }

      // remove the transactions from the sync queue
      useTransactionsStore.setState((state) => ({
        upsertSyncQueue: state.upsertSyncQueue.filter(
          (id) => !upsertData.some((transaction) => transaction.id === id)
        )
      }));

      console.info("- 💰 Successfully upserted transactions");
    }
  } catch (e) {
    console.error(e);
  }
};

export const pushLocalTransactionDeletes = async () => {
  try {
    const userId = useAuthStore.getState().session?.user.id;

    if (!userId) {
      throw new Error("User not found");
    }

    const { deleteSyncQueue } = useTransactionsStore.getState();

    if (deleteSyncQueue.length) {
      const deleteResponse = await supabase
        .from("transactions")
        .delete()
        .in("id", deleteSyncQueue);

      if (deleteResponse.error) {
        throw deleteResponse.error;
      }

      useTransactionsStore.setState((state) => ({
        deleteSyncQueue: state.deleteSyncQueue.filter(
          (id) => !deleteSyncQueue.includes(id)
        )
      }));

      console.info("- 💰 Successfully deleted transactions");
    }
  } catch (e) {
    console.error(e);
  }
};
