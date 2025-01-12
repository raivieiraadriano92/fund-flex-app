import { useEffect, useState } from "react";

import { SplashScreen } from "expo-router";

import { useAuthStore } from "~/store/auth";
import { useCategoriesStore } from "~/store/categories";
import { useGoalsStore } from "~/store/goals";
import { useTransactionsStore } from "~/store/transactions";

export function DataProvider({ children }: { children: React.ReactNode }) {
  const session = useAuthStore((state) => state.session);

  const fetchCategories = useCategoriesStore((state) => state.fetchCategories);

  const fetchGoals = useGoalsStore((state) => state.fetchGoals);

  const fetchLatestTransactions = useTransactionsStore(
    (state) => state.fetchLatestTransactions
  );

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        if (session?.user.id) {
          await Promise.all([
            fetchCategories(),
            fetchGoals(),
            fetchLatestTransactions()
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
  }, [fetchCategories, fetchGoals, fetchLatestTransactions, session?.user.id]);

  if (isLoading) {
    return null;
  }

  return children;
}
