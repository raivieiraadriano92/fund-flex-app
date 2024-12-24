import { useRouter, useSegments } from 'expo-router';
import { useEffect, useState } from 'react';

import { useAuthStore } from '~/store/auth';

export function useProtectedRoute() {
  const router = useRouter();
  const segments = useSegments();
  const session = useAuthStore((state) => state.session);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const inAppGroup = segments[0] === '(app)';

    if (!isInitialized) {
      setIsInitialized(true);
      return;
    }

    if (session && !inAppGroup) {
      // User is authenticated and trying to access public routes
      router.replace('/(app)/(tabs)/home');
    } else if (!session && inAppGroup) {
      // User is not authenticated and trying to access protected routes
      router.replace('/');
    }
  }, [session, segments, isInitialized]);

  return {
    isInitialized,
    isAuthenticated: !!session,
  };
}
