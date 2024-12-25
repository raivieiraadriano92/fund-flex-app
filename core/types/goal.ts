import type { Database } from "~/core/api/database.types";

export type Goal = Database["public"]["Tables"]["goals"]["Row"];

export type GoalInsert = Database["public"]["Tables"]["goals"]["Insert"];

export type GoalUpdate = Database["public"]["Tables"]["goals"]["Update"];

export type GoalFormData = Omit<
  GoalInsert,
  "id" | "created_at" | "updated_at" | "user_id"
>;
