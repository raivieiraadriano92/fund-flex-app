import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { useAuthStore } from "./auth";

import type {
  Transaction,
  TransactionFormData
} from "~/core/types/transaction";

import { supabase } from "~/core/api/supabase";

interface TransactionsState {
  transactions: Transaction[];
  totalBalance: number;
  hasMore: boolean;
  page: number;
}

interface TransactionsActions {
  fetchTransactions: () => Promise<void>;
  fetchMoreTransactions: () => Promise<void>;
  fetchTotalBalance: () => Promise<void>;
  createTransaction: (data: TransactionFormData) => Promise<void>;
  updateTransaction: (id: string, data: TransactionFormData) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  reset: () => void;
}

export const LIMIT = 20;

type TransactionsStore = TransactionsState & TransactionsActions;

export const useTransactionsStore = create<TransactionsStore>()(
  persist(
    (set, get) => ({
      transactions: [],
      totalBalance: 0,
      hasMore: true,
      page: 1,

      fetchTransactions: async () => {
        const userId = useAuthStore.getState().session?.user.id;

        if (!userId) throw new Error("User not found");

        const { data } = await supabase
          .from("transactions")
          .select("*")
          .eq("user_id", userId)
          .order("datetime", { ascending: false })
          .range(0, LIMIT - 1);

        set({
          transactions: data ?? [],
          page: 1,
          hasMore: (data?.length ?? 0) === LIMIT
        });

        // Fetch updated balance
        get().fetchTotalBalance();
      },

      fetchMoreTransactions: async () => {
        const userId = useAuthStore.getState().session?.user.id;

        if (!userId) throw new Error("User not found");

        const { hasMore, page, transactions } = get();

        if (!hasMore) return;

        const from = page * LIMIT;

        const to = from + LIMIT - 1;

        const { data } = await supabase
          .from("transactions")
          .select("*")
          .eq("user_id", userId)
          .order("datetime", { ascending: false })
          .range(from, to);

        if (data) {
          set({
            transactions: [...transactions, ...data],
            page: page + 1,
            hasMore: data.length === LIMIT
          });
        }
      },

      fetchTotalBalance: async () => {
        const userId = useAuthStore.getState().session?.user.id;

        if (!userId) throw new Error("User not found");

        const { data } = await supabase.rpc("calculate_balance", {
          user_id_param: userId
        });

        if (data) {
          set({ totalBalance: data });
        }
      },

      createTransaction: async (data) => {
        const userId = useAuthStore.getState().session?.user.id;

        if (!userId) throw new Error("User not found");

        const { data: newTransaction, error } = await supabase
          .from("transactions")
          .insert([{ ...data, user_id: userId }])
          .select()
          .single();

        if (error) throw error;

        if (newTransaction) {
          set((state) => ({
            transactions: [newTransaction, ...state.transactions]
          }));

          // Fetch updated balance
          get().fetchTotalBalance();
        }
      },

      updateTransaction: async (id, data) => {
        const userId = useAuthStore.getState().session?.user.id;

        if (!userId) throw new Error("User not found");

        const { data: updatedTransaction, error } = await supabase
          .from("transactions")
          .update(data)
          .eq("id", id)
          .eq("user_id", userId)
          .select()
          .single();

        if (error) throw error;

        if (updatedTransaction) {
          set((state) => ({
            transactions: state.transactions.map((transaction) =>
              transaction.id === id ? updatedTransaction : transaction
            )
          }));

          // Fetch updated balance
          get().fetchTotalBalance();
        }
      },

      deleteTransaction: async (id) => {
        const userId = useAuthStore.getState().session?.user.id;

        if (!userId) throw new Error("User not found");

        const { error } = await supabase
          .from("transactions")
          .delete()
          .eq("id", id)
          .eq("user_id", userId);

        if (error) throw error;

        set((state) => ({
          transactions: state.transactions.filter(
            (transaction) => transaction.id !== id
          )
        }));

        // Fetch updated balance
        get().fetchTotalBalance();
      },

      reset: () => {
        set({
          transactions: [],
          hasMore: true,
          page: 1
        });
      }
    }),
    {
      name: "transactions-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ transactions: state.transactions })
    }
  )
);
