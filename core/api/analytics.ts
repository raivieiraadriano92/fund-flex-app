import { subMonths } from "date-fns";

import { supabase } from "~/core/api/supabase";
import { useAuthStore } from "~/store/auth";

export async function fetchMonthlyOverview() {
  const userId = useAuthStore.getState().session?.user.id;

  if (!userId) throw new Error("User not found");

  const startDate = subMonths(new Date(), 6);

  const endDate = new Date();

  const { data } = await supabase.rpc("get_monthly_overview", {
    user_id_param: userId,
    start_date: startDate.toISOString(),
    end_date: endDate.toISOString()
  });

  return data ?? [];
}
