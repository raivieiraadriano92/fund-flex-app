import type { Database } from "~/core/api/database.types";

export type CategoryType = Database["public"]["Enums"]["transaction_type"];

export type Category = Database["public"]["Tables"]["categories"]["Row"];

export type CategoryInsert =
  Database["public"]["Tables"]["categories"]["Insert"];

export type CategoryUpdate =
  Database["public"]["Tables"]["categories"]["Update"];

export type CategoryFormData = Omit<
  CategoryInsert,
  "id" | "created_at" | "updated_at" | "user_id"
>;
