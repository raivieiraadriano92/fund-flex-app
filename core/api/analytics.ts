import { CategoryBreakdownData } from "../types/analytics";

import { supabase } from "~/core/api/supabase";
import { useAuthStore } from "~/store/auth";

export async function fetchMonthlyOverview(startDate: Date, endDate: Date) {
  const userId = useAuthStore.getState().session?.user.id;

  if (!userId) throw new Error("User not found");

  const { data } = await supabase.rpc("get_monthly_overview", {
    user_id_param: userId,
    start_date: startDate.toISOString(),
    end_date: endDate.toISOString()
  });

  return data ?? [];
}

export async function fetchCategoryBreakdown(startDate: Date, endDate: Date) {
  const userId = useAuthStore.getState().session?.user.id;

  if (!userId) throw new Error("User not found");

  const { data, error } = await supabase.rpc("get_category_breakdown", {
    user_id_param: userId,
    start_date: startDate.toISOString(),
    end_date: endDate.toISOString()
  });

  if (error) throw error;

  return data.map((item) => ({
    categoryId: item.category_id,
    categoryTitle: item.category_title,
    categoryEmoji: item.category_emoji,
    total: item.total,
    percentage: item.percentage
  })) as CategoryBreakdownData[];
}
