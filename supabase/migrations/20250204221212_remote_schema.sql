alter table "public"."transactions_goals" drop constraint "transactions_goals_goal_id_fkey";

alter table "public"."transactions_goals" drop constraint "transactions_goals_transaction_id_fkey";

alter table "public"."transactions_goals" add constraint "transactions_goals_goal_id_fkey" FOREIGN KEY (goal_id) REFERENCES goals(id) ON DELETE CASCADE not valid;

alter table "public"."transactions_goals" validate constraint "transactions_goals_goal_id_fkey";

alter table "public"."transactions_goals" add constraint "transactions_goals_transaction_id_fkey" FOREIGN KEY (transaction_id) REFERENCES transactions(id) ON DELETE CASCADE not valid;

alter table "public"."transactions_goals" validate constraint "transactions_goals_transaction_id_fkey";


