import { useEffect, useState } from "react";

import * as SplashScreen from "expo-splash-screen";

import { useAuthStore } from "~/store/auth";
import { useCategoriesStore } from "~/store/categories";
import { useGoalsStore } from "~/store/goals";
import { useTransactionsStore } from "~/store/transactions";

export function DataProvider({ children }: { children: React.ReactNode }) {
  const session = useAuthStore((state) => state.session);

  const { fetchCategories } = useCategoriesStore();

  const { fetchGoals } = useGoalsStore();

  const { fetchTransactions } = useTransactionsStore();

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        if (session?.user.id) {
          await Promise.all([
            fetchCategories(),
            fetchGoals(),
            fetchTransactions()
          ]);
        }
      } catch (_error) {
        // Handle error (maybe show toast)
      } finally {
        setIsLoading(false);

        // This becomes the single point where we hide the splash screen
        // Hide the splash screen after a short delay to prevent flickering
        setTimeout(() => {
          SplashScreen.hideAsync();
        }, 500);
      }
    }

    loadData();
  }, [fetchCategories, fetchGoals, fetchTransactions, session?.user.id]);

  if (isLoading) {
    return null;
  }

  return children;
}
