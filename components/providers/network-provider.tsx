import { useEffect, useState } from "react";

import NetInfo from "@react-native-community/netinfo";

import { OfflineNotice } from "~/components/features/offline/offline-notice";

export function NetworkProvider({ children }: { children: React.ReactNode }) {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsOnline(state.isConnected ?? false);
    });

    return () => unsubscribe();
  }, []);

  if (!isOnline) {
    return <OfflineNotice />;
  }

  return children;
}
