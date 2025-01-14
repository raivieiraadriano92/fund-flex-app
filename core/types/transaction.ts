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

export type TransactionFrequency = "daily" | "weekly" | "monthly" | "yearly";

export type TransactionFormData = Omit<
  TransactionInsert,
  "id" | "created_at" | "updated_at" | "user_id"
> & {
  isRecurring?: boolean;
  recurring?: {
    frequency: TransactionFrequency;
    endDate?: string; // Either end date
    occurrences?: number; // Or number of occurrences
  };
};

export type TransactionFiltersFormData = {
  type?: TransactionTypeWithAll;
  category_id?: string;
};
