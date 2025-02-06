alter table "public"."transactions" add column "goal_id" uuid;

alter table "public"."transactions" add constraint "transactions_goal_id_fkey" FOREIGN KEY (goal_id) REFERENCES goals(id) not valid;

alter table "public"."transactions" validate constraint "transactions_goal_id_fkey";


