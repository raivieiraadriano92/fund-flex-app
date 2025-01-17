import { useEffect } from "react";

import { pushLocalCategories } from "~/core/api/categories";
import { pushLocalGoals } from "~/core/api/goals";
import { pushLocalTransactions } from "~/core/api/transactions";
import { useAuthStore } from "~/store/auth";

export function SyncDataProvider({ children }: { children: React.ReactNode }) {
  const session = useAuthStore((state) => state.session);

  // const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const interval = setInterval(async () => {
      if (session?.user.id) {
        console.info("🔥 Syncing data...");

        // setIsLoading(true);

        await Promise.all([pushLocalCategories(), pushLocalGoals()]);

        await pushLocalTransactions();

        // setIsLoading(false);

        console.info("✅ Data synced!");
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [session?.user.id]);

  return children;
}
