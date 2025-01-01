import type { Database } from "~/core/api/database.types";

export type TransactionType = Database["public"]["Enums"]["transaction_type"];

export type TransactionTypeWithAll =
  | Database["public"]["Enums"]["transaction_type"]
  | "all";

export type Transaction = Database["public"]["Tables"]["transactions"]["Row"];

export type TransactionInsert =
  Database["public"]["Tables"]["transactions"]["Insert"];

export type TransactionUpdate =
  Database["public"]["Tables"]["transactions"]["Update"];

export type TransactionFormData = Omit<
  TransactionInsert,
  "id" | "created_at" | "updated_at" | "user_id"
>;

export type TransactionFiltersFormData = {
  type?: TransactionTypeWithAll;
  category_id?: string;
};
