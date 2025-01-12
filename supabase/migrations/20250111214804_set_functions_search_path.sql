CREATE OR REPLACE FUNCTION "public"."calculate_balance"("user_id_param" "uuid") RETURNS numeric
    LANGUAGE "plpgsql" SECURITY INVOKER
    AS $$
begin
  SET search_path = 'public';  -- Set a fixed search path

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

CREATE OR REPLACE FUNCTION "public"."get_monthly_overview"("user_id_param" "uuid", "start_date" timestamp without time zone, "end_date" timestamp without time zone) RETURNS TABLE("month" "text", "income" numeric, "expense" numeric, "net" numeric)
    LANGUAGE "sql" SECURITY INVOKER
    AS $$
  SET search_path = 'public';  -- Set a fixed search path
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

CREATE OR REPLACE FUNCTION "public"."get_category_breakdown"("user_id_param" "uuid", "start_date" timestamp without time zone, "end_date" timestamp without time zone) RETURNS TABLE("category_id" "text", "category_title" "text", "category_emoji" "text", "total" numeric, "percentage" numeric)
    LANGUAGE "sql" SECURITY INVOKER
    AS $$
  SET search_path = 'public';  -- Set a fixed search path
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