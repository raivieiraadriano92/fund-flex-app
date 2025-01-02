import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface CurrencyState {
  currency: string;
}

interface CurrencyActions {
  setCurrency: (currency: string) => void;
  reset: () => void;
}

type CurrencyStore = CurrencyState & CurrencyActions;

export const useCurrencyStore = create<CurrencyStore>()(
  persist(
    (set) => ({
      currency: "USD",
      setCurrency: (currency) => set({ currency }),
      reset: () => set({ currency: "USD" })
    }),
    {
      name: "currency-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ currency: state.currency })
    }
  )
);
