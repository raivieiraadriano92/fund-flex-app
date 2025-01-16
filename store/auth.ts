import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { Session } from "@supabase/supabase-js";

import { supabase } from "~/core/api/supabase";

interface AuthState {
  session: Session | null | undefined;
}

interface AuthActions {
  setSession: (session: Session | null) => void;
  signOut: () => Promise<void>;
  markAccountToBeDeleted: () => Promise<void>;
}

type AuthStore = AuthState & AuthActions;

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
