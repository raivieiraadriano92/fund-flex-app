import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { AuthStore } from "~/core/types/auth";

import { supabase } from "~/core/api/supabase";

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      session: undefined,

      setSession: (session) => set({ session }),

      signOut: async () => {
        const { error } = await supabase.auth.signOut();

        if (error) throw error;

        set({ session: null });
      },

      markAccountToBeDeleted: async () => {
        const userId = get().session?.user?.id;

        if (!userId) throw new Error("User not found");

        const { error } = await supabase
          .from("profiles")
          .update({ marked_to_delete: true })
          .eq("id", userId);

        if (error) throw error;
      }
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: ({ session }) => ({ session })
    }
  )
);
