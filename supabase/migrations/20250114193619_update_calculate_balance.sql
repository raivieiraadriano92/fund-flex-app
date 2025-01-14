-- Drop existing functions
DROP FUNCTION IF EXISTS calculate_balance(uuid);
DROP FUNCTION IF EXISTS calculate_balance(uuid, timestamp, timestamp);

-- Create new function with default end_date as current_timestamp
create or replace function calculate_balance(
 user_id_param uuid,
 start_date timestamp default null,
 end_date timestamp default current_timestamp
)
returns numeric
language plpgsql
security definer
as $$
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
   where 
     user_id = user_id_param
     and (start_date is null or datetime >= start_date)
     and datetime <= end_date
 );
end;
$$;