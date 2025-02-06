drop policy "Individuals can delete their own transaction goals." on "public"."transactions_goals";

drop policy "Individuals can view their own transaction goals." on "public"."transactions_goals";

create policy "Individuals can delete their own transaction goals."
on "public"."transactions_goals"
as permissive
for delete
to authenticated
using (((goal_id IN ( SELECT goals.id
   FROM goals
  WHERE (goals.user_id = auth.uid()))) AND (transaction_id IN ( SELECT transactions.id
   FROM transactions
  WHERE (transactions.user_id = auth.uid())))));


create policy "Individuals can view their own transaction goals."
on "public"."transactions_goals"
as permissive
for select
to authenticated
using (((goal_id IN ( SELECT goals.id
   FROM goals
  WHERE (goals.user_id = auth.uid()))) AND (transaction_id IN ( SELECT transactions.id
   FROM transactions
  WHERE (transactions.user_id = auth.uid())))));



