import { useEffect } from "react";

import { syncCategories } from "~/core/api/categories";
import { syncGoals } from "~/core/api/goals";
import { syncTransactions } from "~/core/api/transactions";
import { useAuthStore } from "~/store/auth";

export function SyncDataProvider({ children }: { children: React.ReactNode }) {
  const session = useAuthStore((state) => state.session);

  // const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const interval = setInterval(async () => {
      if (session?.user.id) {
        console.info("🔥 Syncing data...");

        // setIsLoading(true);

        await Promise.all([syncCategories(), syncGoals()]);

        await syncTransactions();

        // setIsLoading(false);

        console.info("✅ Data synced!");
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [session?.user.id]);

  return children;
}
