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
}

interface DateFilter {
  startDate: Date;
  endDate: Date;
}

interface TransactionsActions {
  fetchLatestTransactions: (dateFilter?: DateFilter) => Promise<void>;
  fetchTotalBalance: (dateFilter?: DateFilter) => Promise<void>;
  createTransaction: (data: TransactionFormData[]) => Promise<void>;
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

      fetchLatestTransactions: async (dateFilter) => {
        const userId = useAuthStore.getState().session?.user.id;

        if (!userId) throw new Error("User not found");

        let query = supabase
          .from("transactions")
          .select("*")
          .eq("user_id", userId)
          .order("datetime", { ascending: false });

        // Add date filtering if provided
        if (dateFilter) {
          query = query
            .gte("datetime", dateFilter.startDate.toISOString())
            .lte("datetime", dateFilter.endDate.toISOString());
        } else {
          // Default: up to today
          query = query.lte("datetime", new Date().toISOString());
        }

        const { data } = await query.limit(LIMIT);

        if (data) {
          set({ transactions: data });
        }

        // Fetch updated balance
        get().fetchTotalBalance(dateFilter);
      },

      fetchTotalBalance: async (dateFilter) => {
        const userId = useAuthStore.getState().session?.user.id;

        if (!userId) throw new Error("User not found");

        const { data } = await supabase.rpc("calculate_balance", {
          user_id_param: userId,
          start_date: dateFilter?.startDate?.toISOString(),
          end_date: dateFilter?.endDate?.toISOString()
        });

        if (data) {
          set({ totalBalance: data });
        }
      },

      createTransaction: async (transactions) => {
        const userId = useAuthStore.getState().session?.user.id;

        if (!userId) throw new Error("User not found");

        const { data, error } = await supabase
          .from("transactions")
          .insert(
            transactions.map((transaction) => ({
              ...transaction,
              user_id: userId
            }))
          )
          .select();

        if (error) throw error;

        if (data) {
          set((state) => ({
            transactions: [...data, ...state.transactions]
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
          transactions: []
        });
      }
    }),
    {
      name: "transactions-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: ({ transactions }) => ({ transactions })
    }
  )
);
