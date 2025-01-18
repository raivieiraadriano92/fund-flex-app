create type "public"."transaction_type" as enum ('expense', 'income');

create table "public"."categories" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null,
    "type" transaction_type not null,
    "title" character varying(255) not null,
    "emoji" character varying(255) not null,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
);


alter table "public"."categories" enable row level security;

create table "public"."goals" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null,
    "title" character varying(255) not null,
    "emoji" character varying(255) not null,
    "amount" numeric(10,2) not null,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
);


alter table "public"."goals" enable row level security;

create table "public"."profiles" (
    "id" uuid not null
);


alter table "public"."profiles" enable row level security;

create table "public"."transactions" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null,
    "category_id" uuid not null,
    "goal_id" uuid,
    "type" transaction_type not null,
    "title" character varying(255) not null,
    "amount" numeric(10,2) not null,
    "datetime" timestamp with time zone not null default now(),
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
);


alter table "public"."transactions" enable row level security;

create table "public"."transactions_goals" (
    "transaction_id" uuid not null,
    "goal_id" uuid not null,
    "amount" numeric(10,2) not null
);


CREATE UNIQUE INDEX categories_pkey ON public.categories USING btree (id);

CREATE UNIQUE INDEX goals_pkey ON public.goals USING btree (id);

CREATE UNIQUE INDEX profiles_pkey ON public.profiles USING btree (id);

CREATE UNIQUE INDEX transactions_goals_pkey ON public.transactions_goals USING btree (transaction_id, goal_id);

CREATE UNIQUE INDEX transactions_pkey ON public.transactions USING btree (id);

alter table "public"."categories" add constraint "categories_pkey" PRIMARY KEY using index "categories_pkey";

alter table "public"."goals" add constraint "goals_pkey" PRIMARY KEY using index "goals_pkey";

alter table "public"."profiles" add constraint "profiles_pkey" PRIMARY KEY using index "profiles_pkey";

alter table "public"."transactions" add constraint "transactions_pkey" PRIMARY KEY using index "transactions_pkey";

alter table "public"."transactions_goals" add constraint "transactions_goals_pkey" PRIMARY KEY using index "transactions_goals_pkey";

alter table "public"."categories" add constraint "categories_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."categories" validate constraint "categories_user_id_fkey";

alter table "public"."goals" add constraint "goals_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."goals" validate constraint "goals_user_id_fkey";

alter table "public"."profiles" add constraint "profiles_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."profiles" validate constraint "profiles_id_fkey";

alter table "public"."transactions" add constraint "transactions_category_id_fkey" FOREIGN KEY (category_id) REFERENCES categories(id) not valid;

alter table "public"."transactions" validate constraint "transactions_category_id_fkey";

alter table "public"."transactions" add constraint "transactions_goal_id_fkey" FOREIGN KEY (goal_id) REFERENCES goals(id) not valid;

alter table "public"."transactions" validate constraint "transactions_goal_id_fkey";

alter table "public"."transactions" add constraint "transactions_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."transactions" validate constraint "transactions_user_id_fkey";

alter table "public"."transactions_goals" add constraint "transactions_goals_goal_id_fkey" FOREIGN KEY (goal_id) REFERENCES goals(id) not valid;

alter table "public"."transactions_goals" validate constraint "transactions_goals_goal_id_fkey";

alter table "public"."transactions_goals" add constraint "transactions_goals_transaction_id_fkey" FOREIGN KEY (transaction_id) REFERENCES transactions(id) not valid;

alter table "public"."transactions_goals" validate constraint "transactions_goals_transaction_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
  begin
    insert into public.profiles (id)
    values (new.id);
    return new;
  end;
$function$
;

grant delete on table "public"."categories" to "anon";

grant insert on table "public"."categories" to "anon";

grant references on table "public"."categories" to "anon";

grant select on table "public"."categories" to "anon";

grant trigger on table "public"."categories" to "anon";

grant truncate on table "public"."categories" to "anon";

grant update on table "public"."categories" to "anon";

grant delete on table "public"."categories" to "authenticated";

grant insert on table "public"."categories" to "authenticated";

grant references on table "public"."categories" to "authenticated";

grant select on table "public"."categories" to "authenticated";

grant trigger on table "public"."categories" to "authenticated";

grant truncate on table "public"."categories" to "authenticated";

grant update on table "public"."categories" to "authenticated";

grant delete on table "public"."categories" to "service_role";

grant insert on table "public"."categories" to "service_role";

grant references on table "public"."categories" to "service_role";

grant select on table "public"."categories" to "service_role";

grant trigger on table "public"."categories" to "service_role";

grant truncate on table "public"."categories" to "service_role";

grant update on table "public"."categories" to "service_role";

grant delete on table "public"."goals" to "anon";

grant insert on table "public"."goals" to "anon";

grant references on table "public"."goals" to "anon";

grant select on table "public"."goals" to "anon";

grant trigger on table "public"."goals" to "anon";

grant truncate on table "public"."goals" to "anon";

grant update on table "public"."goals" to "anon";

grant delete on table "public"."goals" to "authenticated";

grant insert on table "public"."goals" to "authenticated";

grant references on table "public"."goals" to "authenticated";

grant select on table "public"."goals" to "authenticated";

grant trigger on table "public"."goals" to "authenticated";

grant truncate on table "public"."goals" to "authenticated";

grant update on table "public"."goals" to "authenticated";

grant delete on table "public"."goals" to "service_role";

grant insert on table "public"."goals" to "service_role";

grant references on table "public"."goals" to "service_role";

grant select on table "public"."goals" to "service_role";

grant trigger on table "public"."goals" to "service_role";

grant truncate on table "public"."goals" to "service_role";

grant update on table "public"."goals" to "service_role";

grant delete on table "public"."profiles" to "anon";

grant insert on table "public"."profiles" to "anon";

grant references on table "public"."profiles" to "anon";

grant select on table "public"."profiles" to "anon";

grant trigger on table "public"."profiles" to "anon";

grant truncate on table "public"."profiles" to "anon";

grant update on table "public"."profiles" to "anon";

grant delete on table "public"."profiles" to "authenticated";

grant insert on table "public"."profiles" to "authenticated";

grant references on table "public"."profiles" to "authenticated";

grant select on table "public"."profiles" to "authenticated";

grant trigger on table "public"."profiles" to "authenticated";

grant truncate on table "public"."profiles" to "authenticated";

grant update on table "public"."profiles" to "authenticated";

grant delete on table "public"."profiles" to "service_role";

grant insert on table "public"."profiles" to "service_role";

grant references on table "public"."profiles" to "service_role";

grant select on table "public"."profiles" to "service_role";

grant trigger on table "public"."profiles" to "service_role";

grant truncate on table "public"."profiles" to "service_role";

grant update on table "public"."profiles" to "service_role";

grant delete on table "public"."transactions" to "anon";

grant insert on table "public"."transactions" to "anon";

grant references on table "public"."transactions" to "anon";

grant select on table "public"."transactions" to "anon";

grant trigger on table "public"."transactions" to "anon";

grant truncate on table "public"."transactions" to "anon";

grant update on table "public"."transactions" to "anon";

grant delete on table "public"."transactions" to "authenticated";

grant insert on table "public"."transactions" to "authenticated";

grant references on table "public"."transactions" to "authenticated";

grant select on table "public"."transactions" to "authenticated";

grant trigger on table "public"."transactions" to "authenticated";

grant truncate on table "public"."transactions" to "authenticated";

grant update on table "public"."transactions" to "authenticated";

grant delete on table "public"."transactions" to "service_role";

grant insert on table "public"."transactions" to "service_role";

grant references on table "public"."transactions" to "service_role";

grant select on table "public"."transactions" to "service_role";

grant trigger on table "public"."transactions" to "service_role";

grant truncate on table "public"."transactions" to "service_role";

grant update on table "public"."transactions" to "service_role";

grant delete on table "public"."transactions_goals" to "anon";

grant insert on table "public"."transactions_goals" to "anon";

grant references on table "public"."transactions_goals" to "anon";

grant select on table "public"."transactions_goals" to "anon";

grant trigger on table "public"."transactions_goals" to "anon";

grant truncate on table "public"."transactions_goals" to "anon";

grant update on table "public"."transactions_goals" to "anon";

grant delete on table "public"."transactions_goals" to "authenticated";

grant insert on table "public"."transactions_goals" to "authenticated";

grant references on table "public"."transactions_goals" to "authenticated";

grant select on table "public"."transactions_goals" to "authenticated";

grant trigger on table "public"."transactions_goals" to "authenticated";

grant truncate on table "public"."transactions_goals" to "authenticated";

grant update on table "public"."transactions_goals" to "authenticated";

grant delete on table "public"."transactions_goals" to "service_role";

grant insert on table "public"."transactions_goals" to "service_role";

grant references on table "public"."transactions_goals" to "service_role";

grant select on table "public"."transactions_goals" to "service_role";

grant trigger on table "public"."transactions_goals" to "service_role";

grant truncate on table "public"."transactions_goals" to "service_role";

grant update on table "public"."transactions_goals" to "service_role";

create policy "Individuals can create categories."
on "public"."categories"
as permissive
for insert
to public
with check ((auth.uid() = user_id));


create policy "Individuals can delete their own categories."
on "public"."categories"
as permissive
for delete
to public
using ((( SELECT auth.uid() AS uid) = user_id));


create policy "Individuals can update their own categories."
on "public"."categories"
as permissive
for update
to public
using ((( SELECT auth.uid() AS uid) = user_id));


create policy "Individuals can view their own categories. "
on "public"."categories"
as permissive
for select
to public
using ((( SELECT auth.uid() AS uid) = user_id));


create policy "Individuals can create goals."
on "public"."goals"
as permissive
for insert
to public
with check ((auth.uid() = user_id));


create policy "Individuals can delete their own goals."
on "public"."goals"
as permissive
for delete
to public
using ((( SELECT auth.uid() AS uid) = user_id));


create policy "Individuals can update their own goals."
on "public"."goals"
as permissive
for update
to public
using ((( SELECT auth.uid() AS uid) = user_id));


create policy "Individuals can view their own goals. "
on "public"."goals"
as permissive
for select
to public
using ((( SELECT auth.uid() AS uid) = user_id));


create policy "Individuals can create profiles."
on "public"."profiles"
as permissive
for insert
to public
with check ((auth.uid() = id));


create policy "Individuals can delete their own profile."
on "public"."profiles"
as permissive
for delete
to public
using ((( SELECT auth.uid() AS uid) = id));


create policy "Individuals can update their own profile."
on "public"."profiles"
as permissive
for update
to public
using ((( SELECT auth.uid() AS uid) = id));


create policy "Individuals can view their own profile. "
on "public"."profiles"
as permissive
for select
to public
using ((( SELECT auth.uid() AS uid) = id));


create policy "Individuals can create transactions."
on "public"."transactions"
as permissive
for insert
to public
with check ((auth.uid() = user_id));


create policy "Individuals can delete their own transactions."
on "public"."transactions"
as permissive
for delete
to public
using ((( SELECT auth.uid() AS uid) = user_id));


create policy "Individuals can update their own transactions."
on "public"."transactions"
as permissive
for update
to public
using ((( SELECT auth.uid() AS uid) = user_id));


create policy "Individuals can view their own transactions. "
on "public"."transactions"
as permissive
for select
to public
using ((( SELECT auth.uid() AS uid) = user_id));



