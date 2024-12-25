import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { AuthStore } from "~/core/types/auth";

import { supabase } from "~/core/api/supabase";

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      session: undefined,

      setSession: (session) => set({ session }),

      signOut: async () => {
        const { error } = await supabase.auth.signOut();

        if (error) throw error;

        set({ session: null });
      }
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ session: state.session })
    }
  )
);
