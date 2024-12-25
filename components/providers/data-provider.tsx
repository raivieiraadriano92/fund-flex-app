import { useEffect, useState } from "react";

import { SplashScreen } from "expo-router";

import { useAuthStore } from "~/store/auth";
import { useCategoriesStore } from "~/store/categories";
import { useTransactionsStore } from "~/store/transactions";

export function DataProvider({ children }: { children: React.ReactNode }) {
  const session = useAuthStore((state) => state.session);

  const fetchCategories = useCategoriesStore((state) => state.fetchCategories);

  const fetchTransactions = useTransactionsStore(
    (state) => state.fetchTransactions
  );

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        if (session?.user.id) {
          await Promise.all([fetchCategories(), fetchTransactions()]);
        }
      } catch (error) {
        console.error("Error loading initial data:", error);
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
  }, [fetchCategories, fetchTransactions, session?.user.id]);

  if (isLoading) {
    return null;
  }

  return children;
}
