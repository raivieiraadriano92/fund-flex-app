import { useEffect, useState } from "react";

import { useRouter, useSegments } from "expo-router";

import { useAuthStore } from "~/store/auth";

export function useProtectedRoute() {
  const router = useRouter();

  const segments = useSegments();

  const userId = useAuthStore((state) => state.session?.user.id);

  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const inAppGroup = segments[0] === "(app)";

    if (!isInitialized) {
      setIsInitialized(true);

      return;
    }

    if (userId && !inAppGroup) {
      // User is authenticated and trying to access public routes
      router.replace("/(app)/(tabs)/home");
    } else if (!userId && inAppGroup) {
      // User is not authenticated and trying to access protected routes
      router.replace("/");
    }
  }, [isInitialized, router, segments, userId]);

  return {
    isInitialized,
    isAuthenticated: !!userId
  };
}
