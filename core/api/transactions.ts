import { Transaction } from "../types/transaction";

import { supabase } from "./supabase";

import { useAuthStore } from "~/store/auth";
import { LIMIT } from "~/store/transactions";

type FetchTransactionsOptions = {
  page: number;
  searchQuery?: string;
};

export const fetchFilteredTransactions = async ({
  page,
  searchQuery
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

    const { data } = await query;

    return (data ?? []) as Transaction[];
  } catch (error) {
    console.error("Error fetching transactions", error);

    return [];
  }
};
