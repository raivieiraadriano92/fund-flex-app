import { Transaction, TransactionTypeWithAll } from "../types/transaction";

import { supabase } from "./supabase";

import { useAuthStore } from "~/store/auth";
import { LIMIT } from "~/store/transactions";

type FetchTransactionsOptions = {
  page: number;
  searchQuery?: string;
  type?: TransactionTypeWithAll;
  categoryId?: string;
};

export const fetchFilteredTransactions = async ({
  page,
  searchQuery,
  categoryId,
  type
}: FetchTransactionsOptions) => {
  try {
    const userId = useAuthStore.getState().session?.user.id;

    if (!userId) {
      return [];
    }

    const from = (page - 1) * LIMIT;

    const to = from + LIMIT - 1;

    const query = supabase
      .from("transactions")
      .select("*")
      .eq("user_id", userId)
      .order("datetime", { ascending: false })
      .range(from, to);

    if (searchQuery) {
      query.ilike("title", `%${searchQuery}%`);
    }

    if (type && type !== "all") {
      query.eq("type", type);
    }

    if (categoryId) {
      query.eq("category_id", categoryId);
    }

    const { data } = await query;

    return (data ?? []) as Transaction[];
  } catch (_error) {
    // Handle error (maybe show toast)

    return [];
  }
};
