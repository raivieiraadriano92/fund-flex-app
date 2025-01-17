import Storage from "expo-sqlite/kv-store";

import { Transaction } from "../types/transaction";

import { supabase } from "./supabase";

import { useAuthStore } from "~/store/auth";
import { useTransactionsStore } from "~/store/transactions";

const getAndParseTransaction = async (key: string) => {
  const transaction = await Storage.getItem(key);

  if (!transaction) {
    return null;
  }

  return JSON.parse(transaction) as Transaction;
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
        .upsert(upsertData);

      if (upsertResponse.error) {
        throw upsertResponse.error;
      }

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
