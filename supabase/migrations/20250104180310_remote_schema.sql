

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


CREATE EXTENSION IF NOT EXISTS "pgsodium" WITH SCHEMA "pgsodium";






COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE TYPE "public"."transaction_type" AS ENUM (
    'expense',
    'income'
);


ALTER TYPE "public"."transaction_type" OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."calculate_balance"("user_id_param" "uuid") RETURNS numeric
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
begin
  return (
    select coalesce(
      sum(case 
        when type = 'income' then amount 
        else -amount 
      end),
      0
    )
    from transactions
    where user_id = user_id_param
  );
end;
$$;


ALTER FUNCTION "public"."calculate_balance"("user_id_param" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_category_breakdown"("user_id_param" "uuid", "start_date" timestamp without time zone, "end_date" timestamp without time zone) RETURNS TABLE("category_id" "text", "category_title" "text", "category_emoji" "text", "total" numeric, "percentage" numeric)
    LANGUAGE "sql"
    AS $$
  with category_totals as (
    select 
      c.id as category_id,
      c.title as category_title,
      c.emoji as category_emoji,
      coalesce(sum(t.amount), 0) as total
    from categories c
    left join transactions t on 
      c.id = t.category_id 
      and t.type = 'expense'
      and t.datetime >= start_date 
      and t.datetime <= end_date
      and t.user_id = user_id_param
    where 
      c.user_id = user_id_param
      and c.type = 'expense'
    group by c.id, c.title, c.emoji
  ),
  total_expenses as (
    select coalesce(sum(total), 0) as grand_total
    from category_totals
  )
  select 
    ct.category_id,
    ct.category_title,
    ct.category_emoji,
    ct.total,
    case 
      when te.grand_total > 0 then round((ct.total / te.grand_total * 100)::numeric, 1)
      else 0 
    end as percentage
  from category_totals ct
  cross join total_expenses te
  where ct.total > 0
  order by ct.total desc;
$$;


ALTER FUNCTION "public"."get_category_breakdown"("user_id_param" "uuid", "start_date" timestamp without time zone, "end_date" timestamp without time zone) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_monthly_overview"("user_id_param" "uuid", "start_date" timestamp without time zone, "end_date" timestamp without time zone) RETURNS TABLE("month" "text", "income" numeric, "expense" numeric, "net" numeric)
    LANGUAGE "sql"
    AS $$
  select
    to_char(date_trunc('month', datetime), 'Mon') as month,
    coalesce(sum(case when type = 'income' then amount else 0 end), 0) as income,
    coalesce(sum(case when type = 'expense' then amount else 0 end), 0) as expense,
    coalesce(sum(case when type = 'income' then amount else -amount end), 0) as net
  from transactions
  where 
    user_id = user_id_param
    and datetime >= start_date
    and datetime <= end_date
  group by date_trunc('month', datetime)
  order by date_trunc('month', datetime);
$$;


ALTER FUNCTION "public"."get_monthly_overview"("user_id_param" "uuid", "start_date" timestamp without time zone, "end_date" timestamp without time zone) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO ''
    AS $$
  begin
    insert into public.profiles (id)
    values (new.id);
    return new;
  end;
$$;


ALTER FUNCTION "public"."handle_new_user"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."categories" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "type" "public"."transaction_type" NOT NULL,
    "title" character varying(255) NOT NULL,
    "emoji" character varying(255) NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."categories" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."goals" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "title" character varying(255) NOT NULL,
    "emoji" character varying(255) NOT NULL,
    "amount" numeric(10,2) NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."goals" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."profiles" (
    "id" "uuid" NOT NULL
);


ALTER TABLE "public"."profiles" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."transactions" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "category_id" "uuid" NOT NULL,
    "goal_id" "uuid",
    "type" "public"."transaction_type" NOT NULL,
    "title" character varying(255) NOT NULL,
    "amount" numeric(10,2) NOT NULL,
    "datetime" timestamp with time zone DEFAULT "now"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."transactions" OWNER TO "postgres";


ALTER TABLE ONLY "public"."categories"
    ADD CONSTRAINT "categories_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."goals"
    ADD CONSTRAINT "goals_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."transactions"
    ADD CONSTRAINT "transactions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."categories"
    ADD CONSTRAINT "categories_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."goals"
    ADD CONSTRAINT "goals_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."transactions"
    ADD CONSTRAINT "transactions_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id");



ALTER TABLE ONLY "public"."transactions"
    ADD CONSTRAINT "transactions_goal_id_fkey" FOREIGN KEY ("goal_id") REFERENCES "public"."goals"("id");



ALTER TABLE ONLY "public"."transactions"
    ADD CONSTRAINT "transactions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



CREATE POLICY "Individuals can create categories." ON "public"."categories" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Individuals can create goals." ON "public"."goals" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Individuals can create profiles." ON "public"."profiles" FOR INSERT WITH CHECK (("auth"."uid"() = "id"));



CREATE POLICY "Individuals can create transactions." ON "public"."transactions" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Individuals can delete their own categories." ON "public"."categories" FOR DELETE USING ((( SELECT "auth"."uid"() AS "uid") = "user_id"));



CREATE POLICY "Individuals can delete their own goals." ON "public"."goals" FOR DELETE USING ((( SELECT "auth"."uid"() AS "uid") = "user_id"));



CREATE POLICY "Individuals can delete their own profile." ON "public"."profiles" FOR DELETE USING ((( SELECT "auth"."uid"() AS "uid") = "id"));



CREATE POLICY "Individuals can delete their own transactions." ON "public"."transactions" FOR DELETE USING ((( SELECT "auth"."uid"() AS "uid") = "user_id"));



CREATE POLICY "Individuals can update their own categories." ON "public"."categories" FOR UPDATE USING ((( SELECT "auth"."uid"() AS "uid") = "user_id"));



CREATE POLICY "Individuals can update their own goals." ON "public"."goals" FOR UPDATE USING ((( SELECT "auth"."uid"() AS "uid") = "user_id"));



CREATE POLICY "Individuals can update their own profile." ON "public"."profiles" FOR UPDATE USING ((( SELECT "auth"."uid"() AS "uid") = "id"));



CREATE POLICY "Individuals can update their own transactions." ON "public"."transactions" FOR UPDATE USING ((( SELECT "auth"."uid"() AS "uid") = "user_id"));



CREATE POLICY "Individuals can view their own categories. " ON "public"."categories" FOR SELECT USING ((( SELECT "auth"."uid"() AS "uid") = "user_id"));



CREATE POLICY "Individuals can view their own goals. " ON "public"."goals" FOR SELECT USING ((( SELECT "auth"."uid"() AS "uid") = "user_id"));



CREATE POLICY "Individuals can view their own profile. " ON "public"."profiles" FOR SELECT USING ((( SELECT "auth"."uid"() AS "uid") = "id"));



CREATE POLICY "Individuals can view their own transactions. " ON "public"."transactions" FOR SELECT USING ((( SELECT "auth"."uid"() AS "uid") = "user_id"));



ALTER TABLE "public"."categories" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."goals" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."profiles" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."transactions" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";




















































































































































































GRANT ALL ON FUNCTION "public"."calculate_balance"("user_id_param" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."calculate_balance"("user_id_param" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."calculate_balance"("user_id_param" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."get_category_breakdown"("user_id_param" "uuid", "start_date" timestamp without time zone, "end_date" timestamp without time zone) TO "anon";
GRANT ALL ON FUNCTION "public"."get_category_breakdown"("user_id_param" "uuid", "start_date" timestamp without time zone, "end_date" timestamp without time zone) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_category_breakdown"("user_id_param" "uuid", "start_date" timestamp without time zone, "end_date" timestamp without time zone) TO "service_role";



GRANT ALL ON FUNCTION "public"."get_monthly_overview"("user_id_param" "uuid", "start_date" timestamp without time zone, "end_date" timestamp without time zone) TO "anon";
GRANT ALL ON FUNCTION "public"."get_monthly_overview"("user_id_param" "uuid", "start_date" timestamp without time zone, "end_date" timestamp without time zone) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_monthly_overview"("user_id_param" "uuid", "start_date" timestamp without time zone, "end_date" timestamp without time zone) TO "service_role";



GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "service_role";


















GRANT ALL ON TABLE "public"."categories" TO "anon";
GRANT ALL ON TABLE "public"."categories" TO "authenticated";
GRANT ALL ON TABLE "public"."categories" TO "service_role";



GRANT ALL ON TABLE "public"."goals" TO "anon";
GRANT ALL ON TABLE "public"."goals" TO "authenticated";
GRANT ALL ON TABLE "public"."goals" TO "service_role";



GRANT ALL ON TABLE "public"."profiles" TO "anon";
GRANT ALL ON TABLE "public"."profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."profiles" TO "service_role";



GRANT ALL ON TABLE "public"."transactions" TO "anon";
GRANT ALL ON TABLE "public"."transactions" TO "authenticated";
GRANT ALL ON TABLE "public"."transactions" TO "service_role";



ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";






























RESET ALL;
