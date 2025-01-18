alter table "public"."transactions_goals" enable row level security;

create policy "Individuals can create transaction goals."
on "public"."transactions_goals"
as permissive
for insert
to authenticated
with check ((goal_id IN ( SELECT goals.id
   FROM goals
  WHERE (goals.user_id = auth.uid()))));


create policy "Individuals can delete their own transaction goals."
on "public"."transactions_goals"
as permissive
for delete
to authenticated
using ((goal_id IN ( SELECT goals.id
   FROM goals
  WHERE (goals.user_id = auth.uid()))));


create policy "Individuals can update their own transaction goals."
on "public"."transactions_goals"
as permissive
for update
to authenticated
using ((goal_id IN ( SELECT goals.id
   FROM goals
  WHERE (goals.user_id = auth.uid()))))
with check ((goal_id IN ( SELECT goals.id
   FROM goals
  WHERE (goals.user_id = auth.uid()))));


create policy "Individuals can view their own transaction goals."
on "public"."transactions_goals"
as permissive
for select
to authenticated
using ((goal_id IN ( SELECT goals.id
   FROM goals
  WHERE (goals.user_id = auth.uid()))));



