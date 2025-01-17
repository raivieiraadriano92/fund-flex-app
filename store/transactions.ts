import AsyncStorage from "@react-native-async-storage/async-storage";
import { parseISO } from "date-fns";
import Storage from "expo-sqlite/kv-store";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { useAuthStore } from "./auth";

import type {
  Transaction,
  TransactionFormData
} from "~/core/types/transaction";

import { generateId } from "~/core/utils/id";
import { sortTransactionsByDate } from "~/core/utils/sort";

interface TransactionsState {
  transactions: Transaction[];
  balance: number; // Total balance of all transactions til today

  // Sync queues
  upsertSyncQueue: string[]; // Array of transaction IDs to be upserted
  deleteSyncQueue: string[]; // Array of transaction IDs to be deleted
}

interface TransactionsActions {
  fetchTransactions: () => Promise<void>;
  createTransaction: (transactions: TransactionFormData[]) => Promise<void>;
  updateTransaction: (id: string, data: TransactionFormData) => Promise<void>;
  deleteTransaction: (
    id: string,
    deleteFutureTransactions?: {
      recurringId: string;
      startDate: string;
    }
  ) => Promise<void>;
  calculateBalance: () => void;
  reset: () => void;
}

type TransactionsStore = TransactionsState & TransactionsActions;

const initialTransactionsState: TransactionsState = {
  transactions: [],
  balance: 0,

  upsertSyncQueue: [],
  deleteSyncQueue: []
};

export const useTransactionsStore = create<TransactionsStore>()(
  persist(
    (set, get) => ({
      ...initialTransactionsState,

      fetchTransactions: async () => {
        const userId = useAuthStore.getState().session?.user.id;

        if (!userId) throw new Error("User not found");

        const prefix = `transaction:${userId}:`;

        const keys = await Storage.getAllKeys();

        const transactionKeys = keys.filter((key) => key.startsWith(prefix));

        const transactions: Transaction[] = [];

        for (const key of transactionKeys) {
          try {
            const item = await Storage.getItem(key);

            if (!item) {
              continue;
            }

            const transaction = JSON.parse(item);

            transactions.push(transaction);
          } catch (_e) {}
        }

        set({ transactions: sortTransactionsByDate(transactions) });

        get().calculateBalance();
      },

      createTransaction: async (transactions) => {
        const userId = useAuthStore.getState().session?.user.id;

        if (!userId) throw new Error("User not found");

        const prefix = `transaction:${userId}:`;

        const newTransactions = transactions.map<Transaction>(
          (transaction) => ({
            ...transaction,
            id: generateId(),
            user_id: userId,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
        );

        for (const newTransaction of newTransactions) {
          const key = `${prefix}${newTransaction.id}`;

          await Storage.setItem(key, JSON.stringify(newTransaction));
        }

        set((state) => ({
          transactions: sortTransactionsByDate([
            ...state.transactions,
            ...newTransactions
          ]),
          upsertSyncQueue: [
            ...state.upsertSyncQueue,
            ...newTransactions.map((c) => c.id)
          ]
        }));

        get().calculateBalance();
      },

      updateTransaction: async (id, data) => {
        const userId = useAuthStore.getState().session?.user.id;

        if (!userId) throw new Error("User not found");

        const key = `transaction:${userId}:${id}`;

        const item = await Storage.getItem(key);

        if (!item) throw new Error("Transaction not found");

        const transaction = JSON.parse(item);

        const updatedTransaction: Transaction = {
          ...transaction,
          ...data,
          updated_at: new Date().toISOString()
        };

        await Storage.setItem(key, JSON.stringify(updatedTransaction));

        set((state) => {
          // update the transaction in the list
          const transactions = sortTransactionsByDate(
            state.transactions.map((transaction) =>
              transaction.id === id ? updatedTransaction : transaction
            )
          );

          const upsertSyncQueue = [...state.upsertSyncQueue];

          // add to the upsert sync queue and remove any duplicates
          if (!upsertSyncQueue.includes(id)) {
            upsertSyncQueue.push(id);
          }

          return {
            transactions,
            upsertSyncQueue
          };
        });

        get().calculateBalance();
      },

      deleteTransaction: async (id, deleteFutureTransactions) => {
        const userId = useAuthStore.getState().session?.user.id;

        if (!userId) throw new Error("User not found");

        let transactionsToDelete = [id];

        if (deleteFutureTransactions) {
          const { recurringId, startDate } = deleteFutureTransactions;

          transactionsToDelete = get()
            .transactions.filter(
              (transaction) =>
                transaction.recurring_id === recurringId &&
                parseISO(transaction.datetime) >= parseISO(startDate)
            )
            .map((transaction) => transaction.id);
        }

        for (const transactionId of transactionsToDelete) {
          const key = `transaction:${userId}:${transactionId}`;

          await Storage.removeItem(key);
        }

        set((state) => {
          const transactions = state.transactions.filter(
            (transaction) => !transactionsToDelete.includes(transaction.id)
          );

          // add to the delete sync queue and remove any duplicates
          const deleteSyncQueue = [...state.deleteSyncQueue];

          // add to the delete sync queue and remove any duplicates
          for (const transactionId of transactionsToDelete) {
            if (!deleteSyncQueue.includes(transactionId)) {
              deleteSyncQueue.push(transactionId);
            }
          }

          // remove from the upsert sync queue
          // (in case the transaction was upserted offline and then deleted)
          const upsertSyncQueue = state.upsertSyncQueue.filter(
            (transactionId) => !transactionsToDelete.includes(transactionId)
          );

          return {
            transactions,
            deleteSyncQueue,
            upsertSyncQueue
          };
        });

        get().calculateBalance();
      },

      calculateBalance: () =>
        set((state) => {
          const today = new Date();

          today.setHours(23, 59, 59, 999); // End of today

          const balance = state.transactions
            // exclude future transactions
            .filter((transaction) => parseISO(transaction.datetime) <= today)
            .reduce(
              (total, transaction) =>
                total +
                (transaction.type === "income"
                  ? transaction.amount
                  : -transaction.amount),
              0
            );

          return { balance };
        }),

      reset: () => {
        set({
          ...initialTransactionsState
        });
      }
    }),
    {
      name: "transactions-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: ({ upsertSyncQueue, deleteSyncQueue }) => ({
        upsertSyncQueue,
        deleteSyncQueue
      })
    }
  )
);
