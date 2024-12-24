import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { useAuthStore } from './auth';

import { supabase } from '~/core/api/supabase';
import type { Transaction, TransactionFormData } from '~/core/types/transaction';

interface TransactionsState {
  transactions: Transaction[];
  hasMore: boolean;
  page: number;
}

interface TransactionsActions {
  fetchTransactions: () => Promise<void>;
  fetchMoreTransactions: () => Promise<void>;
  createTransaction: (data: TransactionFormData) => Promise<void>;
  updateTransaction: (id: string, data: TransactionFormData) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  reset: () => void;
}

const LIMIT = 20;

type TransactionsStore = TransactionsState & TransactionsActions;

export const useTransactionsStore = create<TransactionsStore>()(
  persist(
    (set, get) => ({
      transactions: [],
      hasMore: true,
      page: 1,

      fetchTransactions: async () => {
        const { data } = await supabase
          .from('transactions')
          .select('*')
          .order('datetime', { ascending: false })
          .range(0, LIMIT - 1);

        set({
          transactions: data ?? [],
          page: 1,
          hasMore: (data?.length ?? 0) === LIMIT,
        });
      },

      fetchMoreTransactions: async () => {
        const { hasMore, page, transactions } = get();

        if (!hasMore) return;

        const from = page * LIMIT;
        const to = from + LIMIT - 1;

        const { data } = await supabase
          .from('transactions')
          .select('*')
          .order('datetime', { ascending: false })
          .range(from, to);

        if (data) {
          set({
            transactions: [...transactions, ...data],
            page: page + 1,
            hasMore: data.length === LIMIT,
          });
        }
      },

      createTransaction: async (data) => {
        const userId = useAuthStore.getState().session?.user.id;
        const { data: newTransaction } = await supabase
          .from('transactions')
          .insert([{ ...data, user_id: userId }])
          .select()
          .single();

        if (newTransaction) {
          set((state) => ({
            transactions: [newTransaction, ...state.transactions],
          }));
        }
      },

      updateTransaction: async (id, data) => {
        const { data: updatedTransaction } = await supabase
          .from('transactions')
          .update(data)
          .eq('id', id)
          .select()
          .single();

        if (updatedTransaction) {
          set((state) => ({
            transactions: state.transactions.map((transaction) =>
              transaction.id === id ? updatedTransaction : transaction
            ),
          }));
        }
      },

      deleteTransaction: async (id) => {
        await supabase.from('transactions').delete().eq('id', id);

        set((state) => ({
          transactions: state.transactions.filter((transaction) => transaction.id !== id),
        }));
      },

      reset: () => {
        set({
          transactions: [],
          hasMore: true,
          page: 1,
        });
      },
    }),
    {
      name: 'transactions-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ transactions: state.transactions }),
    }
  )
);
