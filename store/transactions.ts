import AsyncStorage from "@react-native-async-storage/async-storage";
import { parseISO } from "date-fns";
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
  count: number;
}

interface DateFilter {
  startDate: Date;
  endDate: Date;
}

interface TransactionsActions {
  fetchLatestTransactions: (dateFilter?: DateFilter) => Promise<void>;
  fetchTotalBalance: (dateFilter?: DateFilter) => Promise<void>;
  fetchCount: () => Promise<void>;
  createTransaction: (data: TransactionFormData[]) => Promise<void>;
  updateTransaction: (id: string, data: TransactionFormData) => Promise<void>;
  deleteTransaction: (
    id: string,
    deleteFutureTransactions?: {
      recurringId: string;
      startDate: string;
    }
  ) => Promise<void>;
  reset: () => void;
}

export const LIMIT = 20;

type TransactionsStore = TransactionsState & TransactionsActions;

export const useTransactionsStore = create<TransactionsStore>()(
  persist(
    (set, get) => ({
      transactions: [],
      totalBalance: 0,
      count: 0,

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

        // Fetch total count
        get().fetchCount();
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

      fetchCount: async () => {
        const userId = useAuthStore.getState().session?.user.id;

        if (!userId) throw new Error("User not found");

        const { count } = await supabase
          .from("transactions")
          .select("*", { count: "estimated", head: true })
          .eq("user_id", userId);

        set({ count: count || 0 });
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
            transactions: [...data, ...state.transactions],
            count: state.count + data.length
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

      deleteTransaction: async (id, deleteFutureTransactions) => {
        const userId = useAuthStore.getState().session?.user.id;

        if (!userId) throw new Error("User not found");

        const query = supabase
          .from("transactions")
          .delete()
          .eq("user_id", userId);

        if (deleteFutureTransactions) {
          query
            .eq("recurring_id", deleteFutureTransactions.recurringId)
            .gte("datetime", deleteFutureTransactions.startDate);
        } else {
          query.eq("id", id);
        }

        const { error } = await query;

        console.log("error", error);

        if (error) throw error;

        set((state) => ({
          transactions: state.transactions.filter((transaction) => {
            if (deleteFutureTransactions) {
              return (
                transaction.recurring_id !==
                  deleteFutureTransactions.recurringId ||
                parseISO(transaction.datetime) <
                  parseISO(deleteFutureTransactions.startDate)
              );
            }

            return transaction.id !== id;
          }),
          count: state.count - 1
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
