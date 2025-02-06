drop policy "Individuals can create transaction goals." on "public"."transactions_goals";

create policy "Individuals can create transaction goals."
on "public"."transactions_goals"
as permissive
for insert
to authenticated
with check (((goal_id IN ( SELECT goals.id
   FROM goals
  WHERE (goals.user_id = auth.uid()))) AND (transaction_id IN ( SELECT transactions.id
   FROM transactions
  WHERE (transactions.user_id = auth.uid())))));



